import { Injectable } from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {firestorageConstants, firestoreConstants} from '../../public/shared/constants';
import {catchError, finalize, first, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UploadComplete, UploadPercentChanged} from './upload.actions';
import {ErrorOccoured} from '../../error/shared/error.action';
import {UploadBehaviour} from './upload-behaviour';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  uploadBehaviors: UploadBehaviour[] = [];
  constructor(private afst: AngularFireStorage) {}

  // data is either base64 or a file
  upload(uid: string, data: File | string): UploadBehaviour {
    // cancel upload if its in progress!
    this.cancelUpload(uid);
    // Find path for upload file
    const path = firestorageConstants.images + firestoreConstants.slash + uid;
    // Create task to upload File or Base64
    let task: AngularFireUploadTask;
    if (data instanceof File) {
      task = this.afst.upload(path, data);
    } else {
      task = this.afst.ref(path).putString(data, 'data_url');
    }
    // Create UploadBehavior
    const upload: UploadBehaviour = new UploadBehaviour();
    // get notified when the download URL is available
    const subPercentage = task.percentageChanges()
      .pipe(
        tap(newPercentage => {
          upload.percentageChanged.next({uid, data, percentage: newPercentage});
        })
      ).subscribe();
    // Get notified when upload is complete
    const subUpload = task.snapshotChanges().pipe(
      finalize(() => {
        this.afst.ref(firestorageConstants.images + firestoreConstants.slash + uid)
          .getDownloadURL()
          .pipe(
            first(),
            tap(url => {
              upload.uploadComplete.next({uid, data, percentage: 100, url});
              this.removeFromBehaviourList(uid);
            })
          ).subscribe();
        subPercentage.unsubscribe();
        subUpload.unsubscribe();
      })
    ).subscribe();
    // subscribe for cancel
    upload.cancelUpload.pipe(
      first()
    ).subscribe(() => {
      if (task) {
        task.cancel();
        this.removeFromBehaviourList(uid);
      }
    });
    // If we wanna cancel or pause/resume later
    this.uploadBehaviors.push(upload);

    return upload;
  }

  private removeFromBehaviourList(uid: string) {
    this.uploadBehaviors = [...this.uploadBehaviors.filter(upload => upload.uid !== uid)];
  }

  deleteFile(uid: string): Observable<any> {
    if (uid) {
      const path = firestorageConstants.images + firestoreConstants.slash + uid;
      return this.afst.ref(path)
        .delete();
    }
  }

  cancelUpload(uid: string) {
    const behavior = [...this.uploadBehaviors.filter(upload => upload.uid === uid)];
    if (behavior.length > 0) {
      behavior[0].cancelUpload.next();
      behavior[0].cancelUpload.complete();
      this.removeFromBehaviourList(uid);
    }
  }
}
