import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {Product} from './product';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {firestoreConstants, routingConstants} from '../../public/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fs: AngularFirestore) { }
  getUniqueProductId(): string {
    return this.fs.createId();
  }
  createProduct(product: Product): Observable<Product> {
    return from(
      this.fs
        .collection(firestoreConstants.products)
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
      .doc(firestoreConstants.products + routingConstants.slash + product.uId)
      .delete()
    ).pipe(
      map(() => {
        return product;
      })
    );
  }
  getProducts(): Observable<Product[]> {
    return this.fs
      .collection<Product>(firestoreConstants.products)
      .snapshotChanges()
      .pipe(
        map(documentsChangeActions => {
            return this.mapDocChangeAction(documentsChangeActions);
          }
        )
      );
  }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.fs
      .collection<Product>(firestoreConstants.topProducts,
        ref => ref.limit(limit))
      .snapshotChanges()
      .pipe(
        map(documentsChangeActions => {
          return this.mapDocChangeAction(documentsChangeActions);
        })
      );
  }

  private mapDocChangeAction(documentsChangeActions: DocumentChangeAction<Product>[]): Product[] {
    return documentsChangeActions.map(docAction => {
      const data = docAction.payload.doc.data();
      const prod: Product = {
        name: data.name,
        price: data.price,
        url: data.url,
        uId: docAction.payload.doc.id
      };
      return prod;
    });
  }
}
