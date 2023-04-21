import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Cliente, Pedido, Producto, ProductoPedido } from '../models/models';
import { FireauthService } from './fireauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  pedido$ = new Subject<Pedido>();
  path = 'cart/';
  uid = '';
  client: Cliente;
  cartSubscriber: Subscription;
  clienteSuscriber: Subscription;
  private pedido: Pedido;


  constructor(
    public firebaseauthService: FireauthService,
    public firestoreService: FirestoreService,
    public route: Router
    ) {
    this.initCart();
    this.firebaseauthService.stateAuth().subscribe( res => {
      console.log(res);
      if(res !== null){
        this.uid = res.uid;
        this.loadClient();

      }
    });
  }

  loadCart(){
    const path = 'Clientes/' + this.uid + '/' + 'cart';
    if (this.cartSubscriber) {
      this.cartSubscriber.unsubscribe();
    }
    this.cartSubscriber = this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe( res => {
      // console.log(res);
      if(res){
        this.pedido = res;
        this.pedido$.next(this.pedido);
      }else{
        this.initCart();
      }
    });

  }

  initCart(){
    this.pedido = {
      id: this.uid,
      cliente: this.client,
      productos:[],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
    this.pedido$.next(this.pedido);
  }

  loadClient(){
    const path = 'Clientes';
    this.clienteSuscriber = this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe( res => {
      this.client = res;
      this.loadCart();
      // console.log(this.client);
      this.clienteSuscriber.unsubscribe();
    });

  }

  getCart(): Observable<Pedido>{
    setTimeout( ()=>{
      this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();

  }

  addProduct(producto: Producto){
    console.log('addProducto', this.uid);
    if(this.uid.length){
      // eslint-disable-next-line arrow-body-style
      const item = this.pedido.productos.find(productoPedido => {
        return (productoPedido.producto.id === producto.id);
      });
      if(item !== undefined){
        item.cantidad ++;
      }else{
        const add: ProductoPedido = {
          cantidad: 1,
          producto
        };
        this.pedido.productos.push(add);
      }
    }else{
      this.route.navigate(['/perfil']);
      return;
    }
    this.pedido$.next(this.pedido);
    // console.log('pedido', this.pedido);
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.createDoc(this.pedido, path, this.uid).then( () =>{
        console.log('Agregado con exito!');
    });
  }

  removeProduct(producto: Producto){
    if(this.uid.length){
      let position = 0;
      // eslint-disable-next-line arrow-body-style
      const item = this.pedido.productos.find((productoPedido, index) => {
        position = index;
        return (productoPedido.producto.id === producto.id);
      });
      if(item !== undefined){
        item.cantidad --;
        if(item.cantidad === 0){
          this.pedido.productos.splice(position, 1);
        }
      }
      // console.log('remove pedido', this.pedido);
      const path = 'Clientes/' + this.uid + '/' + this.path;
      this.firestoreService.createDoc(this.pedido, path, this.uid).then( () =>{
        console.log('Removido con exito!');
      });
    }
  }

  realizarPedido(){

  }
  clearCart(){
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.deleteDoc(path, this.uid).then( ()=>{
      this.initCart();
    });
  }
}
