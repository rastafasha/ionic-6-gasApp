/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public databaseFirebase: AngularFirestore
  ) { }

  createDoc(data: any, path: string, id: string){
    const collection = this.databaseFirebase.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string){
    const collection = this.databaseFirebase.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.databaseFirebase.collection(path);
    return collection.doc(id).update(data);
  }

  deleteDoc(path: string, id: string){
    const collection = this.databaseFirebase.collection(path);
    return collection.doc(id).delete();
  }

  getId(){
    return this.databaseFirebase.createId();
  }

  getCollection<tipo>(path: string,){
    const collection = this.databaseFirebase.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string){
    const collection = this.databaseFirebase.collection<tipo>(path, ref => ref.where(parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getCollectionAll<tipo>(path, parametro: string, condicion: any, busqueda: string, startAt: any){
    if(startAt == null){
      startAt = new Date();
    }
    const collection = this.databaseFirebase.collectionGroup<tipo>(path,
      ref => ref.where(parametro, condicion, busqueda)
      .limit(2)
      .orderBy('fecha', 'desc')
      .startAfter(startAt)
      );
    return collection.valueChanges();

  }

  getCollectionAllPaginada<tipo>(path, limit: number,  startAt: any){
    if(startAt == null){
      startAt = new Date();
    }
    const collection = this.databaseFirebase.collection<tipo>(path,
      ref => ref.orderBy('fecha', 'desc')
        .limit(limit)
        .startAfter(startAt)
      );
    return collection.valueChanges();

  }

}
