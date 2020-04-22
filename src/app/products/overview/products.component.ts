import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../../auth/shared/auth.state';
import {Observable} from 'rxjs';
import {ProductState} from '../shared/product.state';
import {Product} from '../shared/product';
import {DeleteProduct, GetAllProducts} from '../shared/product.action';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @Select(ProductState.products)
  products$: Observable<Product[]>;
  @Select(ProductState.requestSent)
  requestSent$: Observable<boolean>;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllProducts());
  }

  deleteProduct(product: Product) {
    this.store.dispatch(new DeleteProduct(product));
  }
}
