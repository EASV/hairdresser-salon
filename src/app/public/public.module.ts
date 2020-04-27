import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {PublicRoutingModule} from './public-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {AuthModule} from '../auth/auth.module';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ToolbarComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    PublicRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    AuthModule
  ],
  exports: [
    ToolbarComponent,
    SidenavComponent
  ]
})
export class PublicModule { }
