import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto/producto.component';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItemcartComponent } from './itemcart/itemcart.component';
import { ComentariosComponent } from './comentarios/comentarios.component';



@NgModule({
  declarations: [
    ProductoComponent,
    ItemcartComponent,
    ComentariosComponent
  ],
  exports: [
    ProductoComponent,
    ItemcartComponent,
    ComentariosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class ComponentsModule { }
