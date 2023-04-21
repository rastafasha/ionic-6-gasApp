import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { PerfilComponent } from './perfil/perfil.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { CartComponent } from './cart/cart.component';
import { MispedidosComponent } from './mispedidos/mispedidos.component';
import { PedidosComponent } from './pedidos/pedidos.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    CartComponent,
    MispedidosComponent,
    PedidosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AppRoutingModule,
    FormsModule,
    ComponentsModule
  ]
})
export class PagesModule { }
