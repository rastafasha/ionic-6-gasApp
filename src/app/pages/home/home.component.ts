import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models/models';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  products: Producto[] = [];

  private path = 'Productos/';

  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService
    ) {
      this.loadProducts();
    }

  openMenu(){
    this.menuController.toggle('menuPrincipal');
  }

  ngOnInit() {}

  loadProducts(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res =>{
      console.log(res);
      this.products = res;
    });
  }

}
