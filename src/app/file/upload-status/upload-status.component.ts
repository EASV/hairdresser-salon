import {Component, Inject, OnInit} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {UploadData} from '../shared/upload-data';
import {Select} from '@ngxs/store';
import {UploadState} from '../shared/upload.state';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-innotech-upload-status',
  templateUrl: './upload-status.component.html',
  styleUrls: ['./upload-status.component.scss']
})
export class UploadStatusComponent implements OnInit {

  @Select(UploadState.uploadsInProgress)
  uploadInProgress$: Observable<UploadData[]>
  private sub: Subscription;

  constructor(@Inject(MatBottomSheetRef) private ref: any) { }

  ngOnInit(): void {
    this.sub = this.uploadInProgress$.subscribe(
      uploads => {
        if (!uploads || uploads.length < 1) {
          this.close();
        }
      }
    );
  }

  close() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.ref.dismiss();
  }
}
