import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateProduct} from '../shared/product.action';
import {Product} from '../shared/product';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {UploadCompleteRegistered, UploadFile} from '../../file/shared/upload.actions';
import {ProductService} from '../shared/product.service';
import {Observable, Subscription} from 'rxjs';
import {UploadState} from '../../file/shared/upload.state';
import {UploadData} from '../../file/shared/upload-data';

@Component({
  selector: 'app-innotech-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  uid: string;
  createForm: FormGroup;
  stay = true;
  constructor(private store: Store,
              private productService: ProductService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      url: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern('https?://.+')
      ]]
    });
  }

  ngOnInit(): void {
    this.uid = this.productService.getUniqueProductId();
  }

  submit() {
    const product = this.createForm.value as Product;
    product.uId = this.uid;
    this.store.dispatch(new CreateProduct(product, this.stay));
  }

  goToOverviewChanged() {
    this.stay = !this.stay;
  }

  get name() { return this.createForm.get('name'); }

  get price() { return this.createForm.get('price'); }

  imageUploaded(url: string) {
    this.createForm.patchValue({url});
  }
}
