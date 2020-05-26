import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {switchMap, tap} from 'rxjs/operators';
import {GetProductById} from '../shared/product.action';

@Component({
  selector: 'app-innotech-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private store: Store) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        this.store.dispatch(new GetProductById(params.get('id')));
      })
    );
  }

}
