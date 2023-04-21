import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController,ToastController, AlertController } from '@ionic/angular';
import { Producto } from '../../models/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from '../../services/firestore.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-set-products',
  templateUrl: './set-products.component.html',
  styleUrls: ['./set-products.component.scss'],
})
export class SetProductsComponent implements OnInit {

  products: Producto[]=[];

  newProduct: Producto;
  enableNewProduct = false;
  loading: any;
  newImage = '';
  newFile = '';

  private path = 'Productos/';



  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private storageFirestore: FirestorageService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  openMenu(){
    this.menuController.toggle('menuPrincipal');
  }

  async guardarProducto(){
    this.presentLoading();

    const path = 'Productos';
    const name = this.newProduct.name;
    if (this.newFile !== undefined) {
      const res  = await this.storageFirestore.uploadImage(this.newFile, path, name);
      this.newProduct.photo = res;
    }


    this.firestoreService.createDoc(this.newProduct, this.path, this.newProduct.id).then( resp => {
        this.loading.dismiss();
        this.presentToast('Guardado con exito!');
      }).catch(error =>{
        this.presentToast('Hubo un error!');
      });
  }

  getProducts(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(
      res => {
        this.products = res;
      });
  }

 async delete(product: Producto){
    // this.databaseFirestoreServ.deleteDoc(this.path, product.id);
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea <strong>eliminar</strong> este producto',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'normal',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, product.id).then(
              res =>{
                this.presentToast('Eliminado con exito!');
                this.alertController.dismiss();
              }).catch(error =>{
                this.presentToast('No se pudo eliminar');
                console.log(error);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  new(){
    this.enableNewProduct = true;
    this.newProduct = {
      name: '',
      price: null,
      reducePrice: null,
      photo: '',
      id: this.firestoreService.getId(),
      createAt: new Date()
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...'
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

  async newImageLoad(event: any){

    if(event.target.files && event.target.files[0]){

      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.newProduct.photo = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }


  }


}
