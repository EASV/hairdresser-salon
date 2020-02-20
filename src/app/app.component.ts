import { Component } from '@angular/core';

@Component({
  selector: 'app-innotech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  toggleState: boolean;
  toggleNav() {
    this.toggleState = !this.toggleState;
  }
}
