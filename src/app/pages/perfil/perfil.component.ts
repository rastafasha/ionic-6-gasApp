import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ToastController, ModalController } from '@ionic/angular';
import {  Subscription } from 'rxjs';
import { Cliente } from '../../models/models';
import { FireauthService } from '../../services/fireauth.service';
import { FirestorageService } from '../../services/firestorage.service';
import { FirestoreService } from '../../services/firestore.service';
import { GooglemapsComponent } from '../../googlemaps/googlemaps/googlemaps.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  client: Cliente = {
    uid: '',
    email: '',
    name: '',
    movil: '',
    photo: '',
    referencia: '',
    ubicacion: null
  };

  newFile: any;
  uid = '';
  subscribeUserInfo: Subscription;
  ingresarEnable = false;


  constructor(
    public menuController: MenuController,
    public fAuthService: FireauthService,
    public firestoreService: FirestoreService,
    public storageFirestore: FirestorageService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private modalController: ModalController
    ) {
      this.fAuthService.stateAuth().subscribe( res=>{
        console.log(res);
        if(res !== null){
          this.uid = res.uid;
          this.getUserInfo(this.uid);
        } else{
          this.initClient();

        }
      });
    }

  async ngOnInit() {
    const uid = await this.fAuthService.getUid();
    console.log(uid);
  }

  initClient(){
    this.uid = '';
    this.client = {
      uid: '',
      email: '',
      name: '',
      movil: '',
      photo: '',
      referencia: '',
      ubicacion: null
    };
  }

  openMenu(){
    this.menuController.toggle('menuPrincipal');
  }


  async newImageLoad(event: any){

    if(event.target.files && event.target.files[0]){

      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.client.photo = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }


  }


  async registarse(){
    const credenciales = {
      email: this.client.email,
      password: this.client.movil
    };
    const res = await this.fAuthService.register(credenciales.email, credenciales.password).catch(err =>{
      console.log('error', err);
    });
    const uid = await this.fAuthService.getUid();
    this.client.uid = uid;
    this.guardarUsuario();

  }

  async guardarUsuario(){

    const path = 'Clientes';
    const name =  this.client.name;

    if(this.newFile !== undefined){
      const res = await this.storageFirestore.uploadImage(this.newFile, path, name);
      this.client.photo = res;
    }

    this.firestoreService.createDoc(this.client, path, this.client.uid).then(
      res =>{
        this.presentToast('Guardado con exito!');
      }).catch(error =>{
        console.log(error);
        this.presentToast('Hubo un error!');
      });
  }

  salir(){
    this.fAuthService.logout();
    this.subscribeUserInfo.unsubscribe();
  }

  getUserInfo(uid: string){
    const path = 'Clientes';
    this.subscribeUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
      if (res !== undefined) {
        this.client = res;
      }
      console.log(this.client);
    });
  }

  ingresar(){
    const credenciales = {
      email: this.client.email,
      password: this.client.movil
    };
    this.fAuthService.login(credenciales.email, credenciales.password).then(
      res =>{
        this.presentToast('Ingreso con exito!');
       });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000
    });
    toast.present();
  }

  async addDirection() {

    const ubicacion = this.client.ubicacion;
    // eslint-disable-next-line prefer-const
    let positionInput = {
      lat: 0,
      lng: 0,
    };
    // if (ubicacion !== null) {
    //   positionInput = ubicacion;
    // }

    const modalAdd  = await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: {position: positionInput}
    });
    await modalAdd.present();

    const {data} = await modalAdd.onWillDismiss();
    if (data) {
      console.log('data -> ', data);
      this.client.ubicacion = data.pos;
      console.log('this.cliente -> ', this.client);
    }
  }




}
