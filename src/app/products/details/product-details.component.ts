import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {DeleteProduct} from '../shared/product.action';
import {ProductState} from '../shared/product.state';
import {Observable} from 'rxjs';
import {Product} from '../shared/product';
import {ConfirmationDialogComponent} from '../../public/shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';

@Component({
  selector: 'app-innotech-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
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
export class ProductDetailsComponent implements OnInit {
  @Select(ProductState.productDetail)
  productDetails$: Observable<Product>;
  constructor(private route: ActivatedRoute,
              private store: Store,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    /*this.route.paramMap.pipe(
      first(),
      tap(params => {
        this.store.dispatch(new GetProductById(params.get('id')));
      })
    ).subscribe();*/
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you wanna delete this Product?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteProduct(product));
      }
    });
  }

  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }

  editProduct(product: Product) {
    this.store.dispatch(new Navigate([routingConstants.products, routingConstants.edit, product.uId]));
  }
}
