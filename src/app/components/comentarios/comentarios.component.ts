import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/models';
import { FireauthService } from 'src/app/services/fireauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit, OnDestroy {

  @Input() producto: Producto;

  comentario = '';

  comentarios: Comentario[] = [];

  subscriber: Subscription;
  subscriberUserInfo: Subscription;

  constructor(
    public modalController: ModalController,
    public firestoreService: FirestoreService,
    public firebaseAuthService: FireauthService
  ) { }

  ngOnInit() {
    console.log('producto', this.producto);
    this.loadComentarios();
  }

  ngOnDestroy(): void {
      if(this.subscriber){
        this.subscriber.unsubscribe();
      }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  loadComentarios(){
    let startAt = null;
    if(this.comentarios.length){
      startAt = this.comentarios[this.comentarios.length - 1].fecha;
    }
    const path = 'Productos/' + this.producto.id + '/comentarios';
    this.subscriber = this.firestoreService.getCollectionAllPaginada<Comentario>(path, 2, startAt).subscribe( res => {
      if(res.length){
        res.forEach(comentario =>{
          const exist = this.comentarios.find(commentExist =>{
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            commentExist.id === comentario.id;
          });
          if(exist === undefined){
            this.comentarios.push(comentario);
          }
        });
      }
    });
  }

  comentar(){
    const comentario = this.comentario;
    console.log(comentario);
    const path = 'Productos/' + this.producto.id + '/comentarios';
    const data: Comentario = {
      autor: this.firebaseAuthService.datosCliente.name,
      comentario,
      fecha: new Date(),
      id: this.firestoreService.getId()
    };

    this.firestoreService.createDoc(data, path, data.id).then( ()=>{
      console.log('Comentario enviado');
      this.comentario = '';
    });

  }


}

interface Comentario{
    autor: string;
    comentario: string;
    fecha: any;
    id: string;
}
