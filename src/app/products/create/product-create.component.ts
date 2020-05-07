import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateProduct} from '../shared/product.action';
import {Product} from '../shared/product';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {UploadCompleteRegistered, UploadFile} from '../../file/shared/upload.actions';
import {ProductService} from '../shared/product.service';
import {Observable} from 'rxjs';
import {UploadState} from '../../file/shared/upload.state';
import {UploadBehaviour} from '../../file/shared/upload-behaviour';
import {UploadData} from '../../file/shared/upload-data';

@Component({
  selector: 'app-innotech-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  @Select(UploadState.uploadsComplete)
  uploadsComplete$: Observable<UploadData[]>;
  uid: string;
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

  constructor(private store: Store,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.uid = this.productService.getUniqueProductId();
    this.uploadsComplete$.pipe()
      .subscribe(allUploads => {
        const uploadCompleteList = allUploads.filter(upload => upload.uid === this.uid);
        if (uploadCompleteList.length === 1) {
          this.createForm.patchValue({url: uploadCompleteList[0].url});
          this.store.dispatch(new UploadCompleteRegistered(this.uid));
        }
      });
  }

  submit() {
    const product = this.createForm.value as Product;
    product.uId = this.uid;
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

  newImageSelected(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.store.dispatch(new UploadFile(this.uid, file));
    }
  }

  openFile(fileInput: HTMLInputElement) {
    debugger
    fileInput.click();
  }
}
