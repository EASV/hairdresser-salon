import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ProductState} from '../shared/product.state';
import {Observable, Subscription} from 'rxjs';
import {Product} from '../shared/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {tap} from 'rxjs/operators';
import {UpdateProduct} from '../shared/product.action';
import {MatSnackBar} from '@angular/material/snack-bar';
import {compare} from '../../public/shared/util';

@Component({
  selector: 'app-innotech-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  @Select(ProductState.productDetail)
  productDetails$: Observable<Product>;
  @Select(ProductState.updateInProgress)
  updateInProgress$: Observable<Product>;
  editForm: FormGroup;
  originalProduct: Product;
  private unSubscribeDetails: Subscription;
  constructor(private route: ActivatedRoute,
              private store: Store,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
    this.editForm = this.fb.group({
      uId: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.unSubscribeDetails = this.productDetails$.pipe(
      tap(product => {
        if (product) {
          this.originalProduct = {
            uId: product.uId,
            name: product.name,
            price: product.price,
            url: product.url};
          if (!this.editForm.value.uId) {
            this.editForm.patchValue(this.originalProduct);
          } else {
            // Always update URL
            this.editForm.patchValue({
              url: this.originalProduct.url
            });
          }
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.unSubscribeDetails) {
      this.unSubscribeDetails.unsubscribe();
    }
  }

  get name() { return this.editForm.get('name'); }

  get price() { return this.editForm.get('price'); }

  submit() {
    if (!this.sameAsOriginal()) {
      const product = this.editForm.value as Product;
      this.store.dispatch(new UpdateProduct(product));
    }
  }

  patchFromOriginal(field: string) {
    switch (field) {
      case 'name' : {
        this.editForm.patchValue({
          name: this.originalProduct.name
        });
        break;
      }
      case 'price' : {
        this.editForm.patchValue({
          price: this.originalProduct.price
        });
        break;
      }
    }
  }

  imageUrlChanged(url: string) {
    this.editForm.patchValue({url});
    this.originalProduct.url = url;
    this.store.dispatch(new UpdateProduct(this.originalProduct));
  }

  sameAsOriginal() {
    const product = this.editForm.value as Product;
    return compare<Product>(product, this.originalProduct);
  }
}
