import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './overview/products.component';
import {CreateProductComponent} from './create/create-product.component';

const routes: Routes = [
  { path: 'create',
    component: CreateProductComponent
  },
  { path: '',
    component: ProductsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
