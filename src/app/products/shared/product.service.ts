import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from './product';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fs: AngularFirestore) { }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.fs
      .collection<Product>('top-products',
        ref => ref.limit(limit))
      .valueChanges();
  }
}
