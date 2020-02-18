import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes =
  [
    { path: 'products',
      loadChildren: () =>
        import('./products/products.module')
          .then(m => m.ProductsModule) },
    {path: 'welcome',
      loadChildren: () =>
        import('./welcome/welcome.module')
          .then(m => m.WelcomeModule) },
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
export class AppRoutingModule { }
