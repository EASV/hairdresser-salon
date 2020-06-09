import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ProductState} from '../shared/product.state';
import {Product} from '../shared/product';
import {DeleteProduct} from '../shared/product.action';
import {Navigate} from '@ngxs/router-plugin';
import {joinPath, routingConstants} from '../../public/shared/constants';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../public/shared/confirmation-dialog/confirmation-dialog.component';

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
  constructor(private store: Store,
              private dialog: MatDialog) { }

  ngOnInit(): void {}

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

  goToDetails(product: Product) {
    this.store.dispatch(new Navigate([joinPath(routingConstants.products, product.uId)]));
  }

  gotToAdd() {
    this.store.dispatch(new Navigate([joinPath(routingConstants.products, routingConstants.create)]));
  }
}
