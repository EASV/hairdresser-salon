import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {PublicModule} from './public/public.module';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsModule} from '@ngxs/store';
import {AuthState} from './auth/shared/auth.state';
import {ProductState} from './products/shared/product.state';
import {FormsModule} from '@angular/forms';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {ErrorState} from './error/shared/error.state';
import {AngularFireStorage, AngularFireStorageModule} from '@angular/fire/storage';
import {UploadState} from './file/shared/upload.state';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PublicModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxsModule.forRoot([
        ErrorState,
        AuthState,
        ProductState,
        UploadState]
      , {developmentMode: !environment.production}),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
        key: [AuthState]
    }),
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
