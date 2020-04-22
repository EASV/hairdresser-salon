import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {Product} from './product';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {ProductConstants} from './product.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fs: AngularFirestore) { }
  createProduct(product: Product): Observable<Product> {
    return from(
      this.fs
        .collection(ProductConstants.Products)
        .add(product)
    ).pipe(
      map(() => {
        return product;
      })
    );
  }
  deleteProduct(product: Product): Observable<Product> {
    return from(
      this.fs
      .doc(ProductConstants.Products + '/' + product.id)
      .delete()
    ).pipe(
      map(() => {
        return product;
      })
    );
  }
  getProducts(): Observable<Product[]> {
    return this.fs
      .collection<Product>(ProductConstants.Products)
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
          }
        )
      );
  }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.fs
      .collection<Product>(ProductConstants.TopProducts,
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
