import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
export class UploadStatusComponent implements OnDestroy {

  @Select(UploadState.uploadsInProgress)
  uploadInProgress$: Observable<UploadData[]>;

  constructor(@Inject(MatBottomSheetRef) private ref: any) { }

  ngOnDestroy(): void {
    this.ref.dismiss();
  }
}
