import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/models';
import { CartService } from 'src/app/services/cart.service';
import { FireauthService } from 'src/app/services/fireauth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy{

  pedido: Pedido;
  cartSubscriber: Subscription;
  total: number;
  cantidad: number;

  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService,
    public cartService: CartService,
    public fAuthService: FireauthService,
    ) {
      this.initCart();
      this.loadPedido();
     }

  ngOnInit() {}

  ngOnDestroy(){
    if(this.cartSubscriber){
      this.cartSubscriber.unsubscribe();
    }
  }

  openMenu(){
    this.menuController.toggle('menuPrincipal');
  }

  loadPedido(){
    this.cartSubscriber = this.cartService.getCart().subscribe(res =>{
      this.pedido = res;
      this.getTotal();
      this.getCantidad();
    });
  }

  initCart(){
    this.pedido = {
      id: '',
      cliente: null,
      productos:[],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }

  getTotal(){
    this.total = 0;
    this.pedido.productos.forEach(producto => {
      this.total = (producto.producto.reducePrice) * producto.cantidad + this.total;
    });
  }

  getCantidad(){
    this.cantidad = 0;
    this.pedido.productos.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });

  }

  async pedir(){

    if(!this.pedido.productos.length){
      console.log('Agraga items al carrito');
      return;
    }
    this.pedido.fecha = new Date();
    this.pedido.precioTotal = this.total;
    this.pedido.id = this.firestoreService.getId();
    const uid = await this.fAuthService.getUid();
    const path = 'Clientes/' + uid +  '/pedidos/';
    this.firestoreService.createDoc(this.pedido, path, this.pedido.id).then( ()=>{
      console.log('Guardado con exito');
      this.cartService.clearCart();
    });

    console.log('pedido', this.pedido, uid, path);
  }

}
