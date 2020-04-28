import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
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
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    url: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.pattern('https?://.+')
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0)
    ])
  });
  stay = true;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  submit() {
    const product = this.createForm.value as Product;
    product.name = undefined;
    this.store.dispatch(new CreateProduct(product, this.stay));
  }

  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }

  GoToOverviewChanged() {
    this.stay = !this.stay;
  }

  get name() { return this.createForm.get('name'); }

  get url() { return this.createForm.get('url'); }

  get price() { return this.createForm.get('price'); }
}
