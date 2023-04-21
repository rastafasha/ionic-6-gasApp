import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FireauthService } from './fireauth.service';
import { FirestoreService } from './firestore.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';



import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  LocalNotificationActionPerformed} from '@capacitor/core';


// eslint-disable-next-line @typescript-eslint/naming-convention
const { PushNotifications } = Plugins;
// eslint-disable-next-line @typescript-eslint/naming-convention
const { LocalNotifications } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public platform: Platform,
    public firebaseauthService: FireauthService,
    public firestoreService: FirestoreService,
    private router: Router,
    private http: HttpClient) {

          this.stateUser();
          this.inicializar();
     }


  stateUser() {
    this.firebaseauthService.stateAuth().subscribe( res => {
      console.log(res);
      if (res !== null) {
        this.inicializar();
      }
    });

  }


  inicializar() {

    if (this.platform.is('capacitor')) {

         PushNotifications.requestPermission().then( result => {
             console.log('PushNotifications.requestPermission()');
             if (result.granted) {
               console.log('permisos concedidos');
               // Register with Apple / Google to receive push via APNS/FCM
               PushNotifications.register();
               this.addListeners();
             } else {
               // Show some error
             }
         });

    } else {
      console.log('PushNotifications.requestPermission() -> no es movil');
    }
 }

 addListeners() {

  LocalNotifications.schedule({
    notifications: [
      {
        title: 'notificacion local',
        body: 'notification.body',
        id: 1,
      }
    ]
  });

  PushNotifications.addListener('registration',
    (token: PushNotificationToken) => {
      console.log('The token is:', token);
      // this.guadarToken(token.value);
    }
  );

  PushNotifications.addListener('registrationError',
    (error: any) => {
      console.log('Error on registration', error);
    }
  );

  /// primer plano
  PushNotifications.addListener('pushNotificationReceived',
    (notification: PushNotification) => {
      console.log('Push received en 1er plano: ', notification);

          LocalNotifications.schedule({
            notifications: [
              {
                title: 'notificacion local',
                body: notification.body,
                id: 1,
                extra: {
                  data: notification.data
                }
              }
            ]
          });
    }
  );

  PushNotifications.addListener('pushNotificationActionPerformed',
    (notification: PushNotificationActionPerformed) => {
      console.log('Push action performed en segundo plano -> ', notification);

      this.router.navigate([notification.notification.data.enlace]);
    }
  );

  LocalNotifications.addListener('localNotificationActionPerformed',
  (notification: LocalNotificationActionPerformed) => {
     console.log('Push action performed en primer plano: ', notification);
     this.router.navigate([notification.notification.extra.data.enlace]);
  });
}


// async guadarToken(token: any) {

//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   const Uid = await this.firebaseauthService.getUid();

//   if (Uid) {
//       console.log('guardar Token Firebase ->', Uid);
//       const path = '/Clientes/';
//       const userUpdate = {
//         token,
//       };
//       this.firestoreService.updateDoc(userUpdate, path, Uid);
//       console.log('guardar TokenFirebase()->', userUpdate, path, Uid);
//   }
// }

// newNotication() {

//   const receptor = 'CHpQBloQ36ZRsLoGz9RmUwBAstR2';
//   const path = 'Clientes/';
//   this.firestoreService.getDoc<any>(path, receptor).subscribe( res => {
//         if (res) {
//             const token = res.token;
//             const dataNotification = {
//               enlace: '/mis-pedidos',
//             };
//             const notification = {
//               title: 'Mensaje enviado manuelmente',
//               body: 'Adios'
//             };
//             const msg: INotification = {
//                   data: dataNotification,
//                   tokens: [token],
//                   notification,
//             };
//             const url = 'https://us-central1-gasdomi.cloudfunctions.net/newNotification';
//             return this.http.post<Res>(url, {msg}).subscribe( res => {
//                   console.log('respuesta newNotication() -> ', res);
//             });
//         }

//   });


// }


}

interface INotification {
  data: any;
  tokens: string[];
  notification: any;
}


interface Res {
  respuesta: string;
}
