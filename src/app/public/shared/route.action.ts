import {NavigationExtras, Route} from '@angular/router';

export class GoToRoute {
  static readonly type = '[Route] GoToRoute';

  constructor(public route: string, public navExtras?: NavigationExtras) {}
}
