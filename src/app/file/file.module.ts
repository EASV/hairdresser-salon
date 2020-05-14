import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { UploadStatusComponent } from './upload-status/upload-status.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [UploadStatusComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class FileModule { }
