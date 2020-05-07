import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../auth/guard/auth.guard';
import {routingConstants} from './shared/constants';
import {AdminGuard} from '../auth/guard/admin.guard';

const routes: Routes =
  [
    { path: routingConstants.products,
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('../products/products.module')
          .then(m => m.ProductsModule) },
    {path: routingConstants.welcome,
      loadChildren: () =>
        import('../welcome/welcome.module')
          .then(m => m.WelcomeModule) },
    {path: routingConstants.auth,
      loadChildren: () =>
        import('../auth/auth.module')
          .then(m => m.AuthModule) },
    { path: '',
      redirectTo: '/welcome',
      pathMatch: 'full' },
    { path: '**',
      redirectTo: '/welcome',
      pathMatch: 'full'  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
