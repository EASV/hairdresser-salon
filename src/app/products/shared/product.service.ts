import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from './product';
import {AngularFirestore} from '@angular/fire/firestore';
import {first, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fs: AngularFirestore) { }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.fs
      .collection<Product>('top-products',
        ref => ref.limit(limit))
      .snapshotChanges()
      .pipe(
        map(docStuff => {
          const newArray: Product[] = [];
          docStuff.forEach(doc => {
            const prod = doc.payload.doc.data();
            newArray.push({
              name: prod.name,
              price: prod.price,
              id: doc.payload.doc.id,
              url: prod.url
            });
          });
          return newArray;
          /*products.map(p => {
            const prod: Product = {
              name: p.name,
              price: p.price,
              id: p.id
            };
            return prod;
          })*/
          }
        )
      );
  }
}
