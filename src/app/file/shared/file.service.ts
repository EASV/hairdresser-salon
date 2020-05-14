import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
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

  upload(uid: string, file: File): UploadBehaviour {
    const path = firestorageConstants.images + firestoreConstants.slash + uid;
    const task = this.afst.upload(path, file);

    const upload: UploadBehaviour = new UploadBehaviour();
    // get notified when the download URL is available
    const subPercentage = task.percentageChanges()
      .pipe(
        tap(newPercentage => {
          upload.percentageChanged.next({uid, file, percentage: newPercentage});
        })
      ).subscribe();
    const subUpload = task.snapshotChanges().pipe(
      finalize(() => {
        this.afst.ref(firestorageConstants.images + firestoreConstants.slash + uid)
          .getDownloadURL()
          .pipe(
            first(),
            tap(url => {
              upload.uploadComplete.next({uid, file, percentage: 100, url});
            })
          ).subscribe();
        subPercentage.unsubscribe();
        subUpload.unsubscribe();
      })
    ).subscribe();
    upload.cancelUpload.pipe(
      first()
    ).subscribe(() => {
      if (task) {
        task.cancel();
      }
    });
    // If we wanna cancel or pause/resume later
    this.uploadBehaviors.push(upload);

    return upload;
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
    }
  }
}
