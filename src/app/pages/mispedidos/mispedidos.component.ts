import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FireauthService } from '../../services/fireauth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Pedido } from 'src/app/models/models';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit, OnDestroy {

  nuevosSubscriber: Subscription;
  culminadoSubscriber: Subscription;
  pedidos: Pedido[]=[];


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
    }

    if(opc === 'culminados'){
      this.getPedidosCulminados();
    }
  }

  async getPedidosNuevos(){
    console.log('getPedidosNuevos');
    const uid = await this.fireauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevosSubscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe(res =>{
      if(res.length){
        this.pedidos = res;
        console.log('getPedidosNuevos', res);
      }
    });
  }

  async getPedidosCulminados(){
    console.log('getPedidosCulminados');
    const uid = await this.fireauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.culminadoSubscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe(res =>{
      if(res.length){
        this.pedidos = res;
        console.log('getPedidosCulminados', res);
      }
    });
  }

}
