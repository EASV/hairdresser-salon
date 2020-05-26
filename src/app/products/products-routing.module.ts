import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './overview/products.component';
import { ProductCreateComponent } from './create/product-create.component';
import {ProductDetailsComponent} from './details/product-details.component';

const routes: Routes = [
  { path: 'details/:id',
    component: ProductDetailsComponent
  },
  { path: 'create',
    component: ProductCreateComponent
  },
  { path: '',
    component: ProductsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
