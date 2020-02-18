import {Component, OnDestroy, OnInit} from '@angular/core';
import {observable, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  sub: Subscription;
  constructor() { }

  ngOnInit(): void {
    const cheese = new Observable(obs => {
      for (let i = 1; i < 10; i++) {
        obs.next(i);
      }
      // obs.error('ups');
      obs.complete();
    });


    this.sub = cheese.subscribe(
      value => {
        console.log(value);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('complete');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
