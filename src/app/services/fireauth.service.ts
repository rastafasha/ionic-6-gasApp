import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Cliente } from '../models/models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FireauthService {

  datosCliente: Cliente;

  constructor(
    public auth: AngularFireAuth,
    private firestoreService: FirestoreService
    ) {

      this.stateUser();
     }

  stateUser(){
    this.stateAuth().subscribe( res=>{
      // console.log(res);
      if(res !== null){
        this.getInfoUser();
      }
    });
  }

  login(email: string, password: string) {
    // this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  register(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if( user === null){
      return null;
    }else{
      return user.uid;
    }
  }

  stateAuth(){
    return this.auth.authState;
  }

  async getInfoUser(){
    const uid = await this.getUid();
    const path = 'Clientes';
    this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res =>{
      if(res !== undefined){
        this.datosCliente = res;
      }
    });
  }
}
