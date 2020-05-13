import {Action, createSelector, Selector, State, StateContext} from '@ngxs/store';
import {catchError, first, retry, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorOccoured} from '../../error/shared/error.action';
import {FileService} from './file.service';
import {CancelUpload, DeleteFile, UploadComplete, UploadCompleteRegistered, UploadFile, UploadPercentChanged} from './upload.actions';
import {UploadBehaviour} from './upload-behaviour';
import UpdateData = firebase.firestore.UpdateData;
import {UploadData} from './upload-data';

export class UploadStateModel {
  uploadBehaviors: UploadBehaviour[];
  uploadsInProgress: UploadData[];
  uploadsComplete: UploadData[];
}

@State<UploadStateModel>({
  name: 'upload',
  defaults: {
    uploadBehaviors: [],
    uploadsInProgress: [],
    uploadsComplete: []
  }
})
@Injectable()
export class UploadState {
  constructor(private fileService: FileService) {}

  static uploadsInProgressById(id: string) {
    return createSelector([UploadState], (state: UploadStateModel) => {
      const found = state.uploadsInProgress.filter(u => u.uid === id);
      return found.length > 0 ? found[0] : undefined;
    });
  }

  static uploadsCompleteById(id: string) {
    return createSelector([UploadState], (state: UploadStateModel) => {
      const found = state.uploadsComplete.filter(u => u.uid === id);
      return found.length > 0 ? found[0] : undefined;
    });
  }

  @Action(UploadFile)
  uploadFile({getState, setState, dispatch}: StateContext<UploadStateModel>, action: UploadFile) {
    // New Upload startet
    const upload = this.fileService
      .upload(action.uid, action.file);
    // Listen for when the upload percentage changes
    upload.percentageChanged
      .subscribe(uploadData => {
        dispatch(new UploadPercentChanged(uploadData));
      }, error => {
        dispatch(new ErrorOccoured(error));
      });
    // Listen for when the upload completes
    upload.uploadComplete
      .pipe(
        first()
      )
      .subscribe(uploadData => {
        dispatch(new UploadComplete(uploadData));
      }, error => {
        dispatch(new ErrorOccoured(error));
      });
    const state = getState();
    const updatedBehaviors = state.uploadBehaviors;
    updatedBehaviors.push(upload);
    // set new State
    setState({
      ...state,
      uploadBehaviors: updatedBehaviors
    });
    return;
  }

  @Action(UploadPercentChanged)
  uploadPercentChanged({getState, setState}: StateContext<UploadStateModel>, uploadData: UploadPercentChanged) {
    if (uploadData.upload) {
      const state = getState();
      // create mutate-able list with all but the current one in progress
      const newUploadsInProgress: UploadData[] = [...state.uploadsInProgress.filter(upload => upload.uid !== uploadData.upload.uid)];
      // add it again with the new percentage
      newUploadsInProgress.push(uploadData.upload);
      // set new State
      setState({
        ...state,
        uploadsInProgress: newUploadsInProgress,
      });
    }
  }

  @Action(UploadComplete)
  uploadComplete({getState, setState}: StateContext<UploadStateModel>, action: UploadComplete) {
    const state = getState();
    // Remove from upload in Progress
    const uploadsInProgressMinusCompleted = [...state.uploadsInProgress.filter(upload => upload.uid !== action.upload.uid)];
    // Add to upload complete
    const newUploadsCompleted: UploadData[] = [...state.uploadsComplete];
    newUploadsCompleted.push(action.upload);
    // set new State
    setState({
      ...state,
      uploadsInProgress: uploadsInProgressMinusCompleted,
      uploadsComplete: newUploadsCompleted
    });
    return;
  }

  @Action(UploadCompleteRegistered)
  uploadCompleteRegistered(ctx: StateContext<UploadStateModel>, action: UploadCompleteRegistered) {
    this.removeUploadFromState(ctx, action.uid);
    return;
  }

  @Action(DeleteFile)
  deleteFile(ctx: StateContext<UploadStateModel>, action: DeleteFile) {
    return this.fileService.deleteFile(action.uid)
      .pipe(
        first(),
        tap(() => {
          this.removeUploadFromState(ctx, action.uid);
        })
      );
  }

  @Action(CancelUpload)
  cancelUpload(ctx: StateContext<UploadStateModel>, action: CancelUpload) {
    const state = ctx.getState();
    const behavior = [...state.uploadBehaviors.filter(upload => upload.uid === action.uid)];
    if (behavior.length > 0) {
      behavior[0].cancelUpload.next();
      behavior[0].cancelUpload.complete();
      this.removeUploadFromState(ctx, action.uid);
    }
    return;
  }

  removeUploadFromState(ctx: StateContext<UploadStateModel>, uid: string) {
    const state = ctx.getState();
    // Remove from upload in Progress
    const removeBehavior = [...state.uploadBehaviors.filter(upload => upload.uid !== uid)];
    const uploadToChangeListInProgress = [...state.uploadsInProgress.filter(upload => upload.uid !== uid)];
    const uploadToChangeListComplete = [...state.uploadsComplete.filter(upload => upload.uid !== uid)];
    // set new State
    ctx.setState({
      ...state,
      uploadBehaviors: removeBehavior,
      uploadsInProgress: uploadToChangeListInProgress,
      uploadsComplete: uploadToChangeListComplete
    });
  }
}




