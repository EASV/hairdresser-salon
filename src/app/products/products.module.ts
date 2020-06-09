import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './overview/products.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductCreateComponent } from './create/product-create.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import { ProductDetailsComponent } from './details/product-details.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FileModule} from '../file/file.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ImageCropperModule} from 'ngx-image-cropper';
import { ProductEditComponent } from './edit/product-edit.component';
import { ProductNavbarComponent } from './shared/product-navbar/product-navbar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductCreateComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    ProductNavbarComponent
  ],
  imports: [
    CommonModule,
    FileModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class ProductsModule { }
