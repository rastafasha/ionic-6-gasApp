import { Component, OnInit } from '@angular/core';
import { request } from 'http';
import { FireauthService } from './services/fireauth.service';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  admin = false;

  constructor(
    private fAuthService: FireauthService,
    // private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
      this.getUid();
  }

  getUid(){
    this.fAuthService.stateAuth().subscribe(res => {
      if(res !== null){
        if(res.uid === 'xKwJWnBla1SyLUlxUvmHOab3pKE3'){
          this.admin = true;
        }else{
          this.admin = false;
        }
      }else{
        this.admin = false;
      }
    });
  }
}

//regla en firebase para el admin
// match /Productos/{documents=**} {
//   allow read;
//   allow write: if request.auth.uid == 'zs271pFblmabVMzNDIV8ZPlNPc33'
// }

// match /Clientes/{userId} {
//   allow read: if request.auth.uid == userId
//   allow write: if request.auth.uid == userId
// }

// match /Clientes/{userId}/pedidos/{documents=**} {
//   allow read: if request.auth.uid == userId
//   allow write: if request.auth.uid == userId
// }

// match /Clientes/{userId}/cart/{documents=**} {
//   allow read: if request.auth.uid == userId
//   allow write: if request.auth.uid == userId
// }


// match /{path=**}/pedidos/{pedidoId} {
//   allow read: if request.auth.uid == 'xKwJWnBla1SyLUlxUvmHOab3pKE3';
//   allow write: if request.auth.uid == 'xKwJWnBla1SyLUlxUvmHOab3pKE3';
// }



