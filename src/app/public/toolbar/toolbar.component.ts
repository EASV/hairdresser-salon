import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SidenavComponent} from '../sidenav/sidenav.component';

@Component({
  selector: 'app-innotech-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output()
  toggleClicked = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  toggleNav() {
    this.toggleClicked.emit();
  }
}
