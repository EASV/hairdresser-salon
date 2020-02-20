import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {PublicRoutingModule} from './public-routing.module';

@NgModule({
  declarations: [
    ToolbarComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    PublicRoutingModule
  ],
  exports: [
    ToolbarComponent,
    SidenavComponent
  ]
})
export class PublicModule { }
