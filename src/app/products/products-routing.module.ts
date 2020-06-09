import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './overview/products.component';
import { ProductCreateComponent } from './create/product-create.component';
import {ProductDetailsComponent} from './details/product-details.component';
import {ProductEditComponent} from './edit/product-edit.component';

const routes: Routes = [
  { path: 'create',
    component: ProductCreateComponent
  },
  { path: ':id',
    component: ProductDetailsComponent
  },
  { path: 'edit/:id',
    component: ProductEditComponent
  },
  { path: '',
    component: ProductsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
