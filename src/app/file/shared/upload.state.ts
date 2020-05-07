import {Action, Selector, State, StateContext} from '@ngxs/store';
import {catchError, first, retry, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorOccoured} from '../../error/shared/error.action';
import {FileService} from './file.service';
import {UploadComplete, UploadCompleteRegistered, UploadFile, UploadPercentChanged} from './upload.actions';
import {UploadBehaviour} from './upload-behaviour';
import UpdateData = firebase.firestore.UpdateData;
import {UploadData} from './upload-data';

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

  @Selector()
  static filesUploaded(state: UploadStateModel) {
    return state.uploadsInProgress;
  }

  @Selector()
  static uploadsComplete(state: UploadStateModel) {
    return state.uploadsComplete;
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
    return;
  }

  @Action(UploadPercentChanged)
  uploadPercentChanged({getState, setState}: StateContext<UploadStateModel>, uploadData: UploadData) {
    const state = getState();
    // create mutate-able list with all but the current one in progress
    const newUploadsInProgress: UploadData[] = [...state.uploadsInProgress.filter(upload => upload.uid !== uploadData.uid)];
    // add it again with the new percentage
    newUploadsInProgress.push(uploadData);
    // set new State
    setState({
      ...state,
      uploadsInProgress: newUploadsInProgress,
    });
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
  uploadCompleteRegistered({getState, setState}: StateContext<UploadStateModel>, action: UploadCompleteRegistered) {
    const state = getState();
    // Find registrered upload that is completed and remover it from the completed list
    const uploadToChangeList = state.uploadsComplete.filter(upload => upload.uid !== action.uid);
    const newUploadsCompleted: UploadData[] = [...uploadToChangeList];
    // set new State
    setState({
      ...state,
      uploadsComplete: newUploadsCompleted
    });
    return;
  }

}




