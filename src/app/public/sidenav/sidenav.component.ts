import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-innotech-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input()
  toggleOpen: boolean;
  @Output()
  toggleOpenChange = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
}
