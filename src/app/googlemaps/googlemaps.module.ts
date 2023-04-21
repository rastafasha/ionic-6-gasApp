import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglemapsComponent } from './googlemaps/googlemaps.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    GooglemapsComponent
  ],
  exports: [
    GooglemapsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers:[
    Geolocation,
  ]
})
export class GooglemapsModule { }
