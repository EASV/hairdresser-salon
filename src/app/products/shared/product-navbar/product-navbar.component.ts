import {Component, Input, OnInit} from '@angular/core';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../../public/shared/constants';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-innotech-product-navbar',
  templateUrl: './product-navbar.component.html',
  styleUrls: ['./product-navbar.component.scss']
})
export class ProductNavbarComponent implements OnInit {
  @Input()
  title: string;
  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }
}
