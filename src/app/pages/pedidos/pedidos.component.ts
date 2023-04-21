import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FireauthService } from '../../services/fireauth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { EstadoPedido, Pedido } from 'src/app/models/models';
import { resolve6 } from 'dns';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit, OnDestroy{

  nuevosSubscriber: Subscription;
  culminadoSubscriber: Subscription;
  pedidos: Pedido[]=[];
  pedidosEntregados: Pedido[]=[];

  nuevos = true;

  estados: EstadoPedido[] = ['camino', 'entregado', 'enviado', 'visto'];

  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService,
    public fireauthService: FireauthService
  ) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }

  ngOnDestroy(){
    if(this.nuevosSubscriber){
      this.nuevosSubscriber.unsubscribe();
    }
    if(this.culminadoSubscriber){
      this.culminadoSubscriber.unsubscribe();
    }
  }

  openMenu(){
    this.menuController.toggle('menuPrincipal');
  }

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev.detail.value);
    const opc = ev.detail.value;
    if(opc === 'nuevos'){
      this.getPedidosNuevos();
      this.nuevos = true;
    }

    if(opc === 'culminados'){
      this.getPedidosCulminados();
      this.nuevos = false;
    }
  }

  async getPedidosNuevos(){
    console.log('getPedidosNuevos');
    const path = 'pedidos';
    let startAt = null;
    if(this.pedidos.length){
      startAt = this.pedidos[this.pedidos.length - 1].fecha;
    }
    this.nuevosSubscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt).subscribe(res =>{
      if(res.length){
        console.log('getPedidosNuevos', res);
        res.forEach(pedido => {
          this.pedidos.push(pedido);
        });
      }
    });
  }

  async getPedidosCulminados(){
    console.log('getPedidosCulminados');
    const path = 'pedidos';
    let startAt = null;
    if(this.pedidosEntregados.length){
      startAt = this.pedidosEntregados[this.pedidosEntregados.length - 1].fecha;
    }
    this.nuevosSubscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt).subscribe(res =>{
      if(res.length){
        console.log('getPedidosCulminados', res);
        res.forEach(pedido => {
          this.pedidosEntregados.push(pedido);
        });
      }
    });
  }

  cargarMas(){
    if(this.nuevos){
      this.getPedidosNuevos();
    }else{
      this.getPedidosCulminados();
    }
  }

  cambiarEstado(pedido: Pedido, estado: EstadoPedido){
    console.log('cambiarEstado()', estado);

    const path = 'Clientes/' + pedido.cliente.uid + '/pedidos/';
    const updateDoc = {estado};
    const uid = pedido.id;
    this.firestoreService.updateDoc(updateDoc, path, uid, ).then( ()=>{
      console.log('actualizado con exito');
    });

  }

}
