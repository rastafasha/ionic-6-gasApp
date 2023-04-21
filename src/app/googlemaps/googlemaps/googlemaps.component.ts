import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
import { GooglemapsService } from '../googlemaps.service';
import { ModalController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

// eslint-disable-next-line no-var
declare var google: any;



@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
  providers: [
    Geolocation
  ]
})
export class GooglemapsComponent implements OnInit {

   // coordenadas cuenca
   @Input() position = {
    lat: -2.898116,
    lng: -78.99958149999999
};

label = {
    titulo:'Ubicación',
    subtitulo: 'Mi ubicación de envío'
};

map: any;
marker: any;
infowindow: any;
positionSet: any;

// eslint-disable-next-line @typescript-eslint/member-ordering
@ViewChild('map') divMap: ElementRef;


constructor(private renderer: Renderer2,
          @Inject(DOCUMENT) private document,
          private googlemapsService: GooglemapsService,
          public modalController: ModalController,
          private geolocation: Geolocation
          ) { }

ngOnInit(): void {
    this.init();

    // console.log('position ->', this.position);
}

async init() {

    this.googlemapsService.init(this.renderer, this.document).then( () => {
          this.initMap();
    }).catch( (err) => {
          console.log(err);
    });

}




initMap() {

    const position = this.position;

    // eslint-disable-next-line prefer-const
    let latLng = new google.maps.LatLng(position.lat, position.lng);

    // eslint-disable-next-line prefer-const
    let mapOptions = {
          center: latLng,
          zoom: 15,
          disableDefaultUI: true,
          clickableIcons: false,
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          draggable: false,
    });
    this.clickHandleEvent();
    this.infowindow = new google.maps.InfoWindow();
    this.addMarker(position);
    this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);

}

clickHandleEvent() {

    this.map.addListener('click', (event: any) => {
          const position = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
          };
          this.addMarker(position);
    });

}



addMarker(position: any): void {

    // eslint-disable-next-line prefer-const
    let latLng = new google.maps.LatLng(position.lat, position.lng);

    this.marker.setPosition(latLng);
    this.map.panTo(position);
    this.positionSet = position;

}


setInfoWindow(marker: any, titulo: string, subtitulo: string) {

    const contentString  =  '<div id="contentInsideMap">' +
                            '<div>' +
                            '</div>' +
                            '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
                            '<div id="bodyContent">' +
                            '<p class"normal m-0">'
                            + subtitulo + '</p>' +
                            '</div>' +
                            '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);

}

async mylocation() {

  console.log('mylocation() click');

  this.geolocation.getCurrentPosition().then((res) => {

      console.log('mylocation() -> get ', res);

      const position = {
            lat: res.coords.latitude,
            lng: res.coords.longitude,
      };
      this.addMarker(position);

  });

}

aceptar() {
    console.log('click aceptar -> ', this.positionSet);
    this.modalController.dismiss({pos: this.positionSet});
}

}
