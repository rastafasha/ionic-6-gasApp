import { Component,Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models/models';
import { CartService } from 'src/app/services/cart.service';
import { ComentariosComponent } from '../comentarios/comentarios.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor(
    public cartService: CartService,
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  addToCart(){
    this.cartService.addProduct(this.producto);
  }

  async openModal(){
    console.log(this.producto);
    const modal = await this.modalController.create({
      component: ComentariosComponent,
      componentProps: {producto: this.producto}
    });
    return await modal.present();

  }

}
