import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ProductState} from '../shared/product.state';
import {Product} from '../shared/product';
import {DeleteProduct} from '../shared/product.action';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1600)
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit {
  @Select(ProductState.products)
  products$: Observable<Product[]>;
  limit = 4;
  cardWidth = 100 / this.limit;
  constructor(private store: Store) { }

  ngOnInit(): void {}

  deleteProduct(product: Product) {
    this.store.dispatch(new DeleteProduct(product));
  }

  goToDetails(product: Product) {

  }

  gotToAdd() {
    this.store.dispatch(new Navigate([routingConstants.products + routingConstants.slash + routingConstants.create]));
  }
}
