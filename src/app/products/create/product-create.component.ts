import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateProduct} from '../shared/product.action';
import {Product} from '../shared/product';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';

@Component({
  selector: 'app-innotech-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  createForm = new FormGroup({
    name: new FormControl(''),
    url: new FormControl(''),
    price: new FormControl('')
  });

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  submit() {
    const product = this.createForm.value as Product;
    this.store.dispatch(new CreateProduct(product));
  }

  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }
}
