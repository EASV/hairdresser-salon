import {Component, Inject, OnInit} from '@angular/core';
import {TimedError} from '../shared/timed-error';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetConfig, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-innotech-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error: TimedError;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
              @Inject(MatBottomSheetRef) private ref: any) { }

  ngOnInit(): void {
    this.error = this.data.error;
  }

  close() {
    this.ref.dismiss();
  }

}
