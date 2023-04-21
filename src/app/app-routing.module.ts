import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductsComponent } from './backend/set-products/set-products.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { MispedidosComponent } from './pages/mispedidos/mispedidos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';

import { AngularFireAuthGuard, canActivate } from '@angular/fire/compat/auth-guard';
import { map } from 'rxjs/operators';


const isAdmin = (next: any) => map((user: any) => !!user && 'xKwJWnBla1SyLUlxUvmHOab3pKE3' === user.uid);

//admin: admin@gmail.com
// user: mercadocreativo@gmail.com
// pass: 1234567890

const routes: Routes = [

  {path: 'home',component:HomeComponent},
  {path: 'config-products',component:SetProductsComponent, ...canActivate(isAdmin)},
  {path: 'pedidos',component: PedidosComponent, ...canActivate(isAdmin)},
  {path: 'perfil',component:PerfilComponent},
  {path: 'cart',component: CartComponent},
  {path: 'mis-pedidos',component: MispedidosComponent},
  {path: '', component:HomeComponent },
  {path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
