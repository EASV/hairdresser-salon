import {Action, createSelector, Selector, State, StateContext} from '@ngxs/store';
import {first, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorOccoured} from '../../error/shared/error.action';
import {FileService} from './file.service';
import {CancelUpload, DeleteFile, UploadComplete, UploadCompleteRegistered, UploadFile, UploadPercentChanged} from './upload.actions';
import {UploadData} from './upload-data';
import {ProductStateModel} from '../../products/shared/product.state';

export class UploadStateModel {
  uploadsInProgress: UploadData[];
  uploadsComplete: UploadData[];
}

@State<UploadStateModel>({
  name: 'upload',
  defaults: {
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

  @Selector()
  static uploadsInProgress(state: UploadStateModel) {
    return state.uploadsInProgress;
  }

  static uploadsCompleteById(id: string) {
    return createSelector([UploadState], (state: UploadStateModel) => {
      const found = state.uploadsComplete.filter(u => u.uid === id);
      return found.length > 0 ? found[0] : undefined;
    });
  }

  @Action(UploadFile)
  uploadFile({getState, setState, dispatch}: StateContext<UploadStateModel>, action: UploadFile) {
    const state = getState();
    // Not done uploading last file with same id,then cancel upload
    const uploadInProgressForFile = [...state.uploadsInProgress.filter(uploadInProgress => uploadInProgress.uid === action.uid)];
    if (uploadInProgressForFile.length > 0) {
      dispatch(new CancelUpload(action.uid));
    }
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
  uploadComplete({getState, setState, dispatch}: StateContext<UploadStateModel>, action: UploadComplete) {
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
    this.fileService.cancelUpload(action.uid);
    this.removeUploadFromState(ctx, action.uid);
    return;
  }

  private removeUploadFromState(ctx: StateContext<UploadStateModel>, uid: string) {
    const state = ctx.getState();
    // Remove from upload in Progress
    const uploadToChangeListInProgress = [...state.uploadsInProgress.filter(upload => upload.uid !== uid)];
    const uploadToChangeListComplete = [...state.uploadsComplete.filter(upload => upload.uid !== uid)];
    // set new State
    ctx.setState({
      ...state,
      uploadsInProgress: uploadToChangeListInProgress,
      uploadsComplete: uploadToChangeListComplete
    });
  }
}




