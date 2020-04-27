import { ProductService } from './product.service';
import {of} from 'rxjs';
import {Product} from './product';
import {AngularFirestore} from '@angular/fire/firestore';
import {TestBed} from '@angular/core/testing';
import {first} from 'rxjs/operators';

const products: Product[] = [
  {
    uId: 'FWtINWPUt5RZA3QVdVhh',
    name: 'Black Hair Dye',
    price: 30,
    url: ''
  },
  {
    uId: 'RkZyGpUQ54XGIJZYgWXX',
    name: 'Extensions',
    price: 20,
    url: ''
  },
  {
    uId: 'UBhQTgXac67nDi4Lcths',
    name: 'Shave',
    price: 10,
    url: ''
  },
  {
    uId: 'FWtINWPUt5RZA3QVdVhh',
    name: 'Haircut',
    price: 22,
    url: ''
  }
];

const data = of(products);

const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data)
};

const angularFirestoreStub = {
  path: null,
  ref: null,
  collection: jasmine.createSpy('collection')
    .and.callFake((path, queryFn) => {
      angularFirestoreStub.path = path;
      angularFirestoreStub.ref = jasmine.createSpyObj('ref', ['limit']);
      queryFn(angularFirestoreStub.ref);
      return collectionStub;
    })
};

describe('ProductService', () => {
  let service: ProductService;
  let spy: AngularFirestore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        {provide: AngularFirestore, useValue: angularFirestoreStub}
      ]
    });
    service = TestBed.inject(ProductService);
    spy = TestBed.inject(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain 4 products', done => {
    const limit = 4;
    service.getTopProducts(limit)
      .pipe(
        first()
      )
      .subscribe(prods => {
        expect(prods).toEqual(products);
        expect(angularFirestoreStub.path).toBe('top-products');
        expect(angularFirestoreStub.ref.limit).toHaveBeenCalledWith(limit);
        expect(collectionStub.valueChanges).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
