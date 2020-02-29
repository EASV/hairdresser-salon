import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './view/welcome.component';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {MatDividerModule} from '@angular/material/divider';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    MatCardModule,
    MatListModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FlexLayoutModule,
    LazyLoadImageModule
  ]
})
export class WelcomeModule { }
