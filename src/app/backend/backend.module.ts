import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetProductsComponent } from './set-products/set-products.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SetProductsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
