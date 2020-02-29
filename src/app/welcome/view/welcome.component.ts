import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../products/shared/product.service';
import {Observable} from 'rxjs';
import {Product} from '../../products/shared/product';
import {first} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1600)
      ])
    ])
  ]
})
export class WelcomeComponent implements OnInit {
  defaultImage = 'https://www.placecage.com/1000/1000';
  topProducts$: Observable<Product[]>;
  limit = 4;
  cardWidth = 100 / this.limit;
  constructor(private ps: ProductService) { }

  ngOnInit(): void {
    this.topProducts$ =
      this.ps.getTopProducts(this.limit);
  }

  goToDetails(product: Product) {}
}
