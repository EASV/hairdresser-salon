import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../products/shared/product.service';
import {Observable} from 'rxjs';
import {Product} from '../../products/shared/product';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  topProducts$: Observable<Product[]>;
  constructor(private ps: ProductService) { }

  ngOnInit(): void {
    this.topProducts$ = this.ps.getTopProducts(4);
  }

}
