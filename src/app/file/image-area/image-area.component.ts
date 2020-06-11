import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {dataURItoBlob} from '../shared/file-util';
import {UploadState} from '../shared/upload.state';
import {Observable, Subscription} from 'rxjs';
import {UploadData} from '../shared/upload-data';
import {Store} from '@ngxs/store';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {UploadCompleteRegistered, UploadFile} from '../shared/upload.actions';
import {catchError} from 'rxjs/operators';
import {ErrorOccoured} from '../../error/shared/error.action';

@Component({
  selector: 'app-innotech-image-area',
  templateUrl: './image-area.component.html',
  styleUrls: ['./image-area.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1600)
      ])
    ])
  ]
})
export class ImageAreaComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input()
  name: string;
  @Input()
  imageUrl: string;
  @Output()
  newImageUploaded = new EventEmitter<string>();
  imageBeingChanged: boolean;
  imageChangedEvent: any = '';
  uploadsComplete$: Observable<UploadData>;
  completeSub: Subscription;
  originalFile: File;
  loaded: boolean;
  error: boolean;
  private base64: string;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.uploadsComplete$ = this.store.select(UploadState.uploadsCompleteById(this.name));
    this.completeSub = this.uploadsComplete$.pipe()
      .subscribe(uploadComplete => {
        if (uploadComplete) {
          this.error = false;
          this.loaded = false;
          this.store.dispatch(new UploadCompleteRegistered(this.name));
          this.base64 = this.originalFile = undefined;
          this.imageUrl = uploadComplete.url;
          this.imageBeingChanged = false;
          this.newImageUploaded.emit(uploadComplete.url);
        }
      });
  }

  changeImage() {
    this.fileInput.nativeElement.click();
  }

  newImageSelected(event) {
    this.imageBeingChanged = true;
    this.imageChangedEvent = event;
    this.loaded = false;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.originalFile = fileList[0];
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.base64 = event.base64;
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  cancelImageChange() {
    this.base64 = this.originalFile = undefined;
    this.imageBeingChanged = false;
    this.loaded = false;
  }

  saveImage() {
    if (this.originalFile && this.name) {
      this.store.dispatch(new UploadFile(this.name, this.base64));
    }
  }

  ngOnDestroy(): void {
    if (this.completeSub) {
      this.completeSub.unsubscribe();
    }
  }
}
