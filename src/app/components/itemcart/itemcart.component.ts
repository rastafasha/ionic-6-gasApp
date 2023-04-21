import { Component, Input, OnInit } from '@angular/core';
import {  ProductoPedido } from 'src/app/models/models';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-itemcart',
  templateUrl: './itemcart.component.html',
  styleUrls: ['./itemcart.component.scss'],
})
export class ItemcartComponent implements OnInit {

  @Input() productoPedido: ProductoPedido;
  @Input() botones = true;

  constructor(
    public cartService: CartService
  ) { }

  ngOnInit() {}

  addToCart(){
    this.cartService.addProduct(this.productoPedido.producto);
  }

  removeCart(){
    this.cartService.removeProduct(this.productoPedido.producto);
  }

}
