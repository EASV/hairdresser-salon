import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateProduct} from '../shared/product.action';
import {Product} from '../shared/product';

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
}
