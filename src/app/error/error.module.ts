import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './dialog/error.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ErrorModule { }
