import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, AlertController, LoadingController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http} from '@angular/http';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public lat: any;
  public lng: any;

  public options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  public userAddress: any;
  public loading: any;
  constructor(private network: Network, private nativeGeocoder: NativeGeocoder, public http: Http, public navCtrl: NavController, private geolocation: Geolocation, private alertCtrl: AlertController, public loadingCtrl: LoadingController ) {
  }
  presentLoadingDefault(){
    this.loading = this.loadingCtrl.create({
      content: 'Enviando...'
    });
    this.loading.present();
  }
  dismissLoadingDefault(){
    this.loading.dismiss();
  }
  alert(data, data2) {
    let alert = this.alertCtrl.create({
      title: data,
      subTitle: data2,
      buttons: ['Dismiss']
    });
    alert.present();
  }  
  cleanInput(){
    this.userAddress =  ""
  }
  setCurrentLocation(){
    this.presentLoadingDefault();
    setTimeout(() => {
      this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {
        this.lat = resp.coords.latitude
        this.lng = resp.coords.longitude
        //pega endereco por lat e lng
        this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
          .then((result: NativeGeocoderReverseResult[]) => {
            // this.alert('',JSON.stringify(result))
            let address = result[0]
            let state = address.administrativeArea
            let city = address.locality
            let district = address.subLocality
            let street = address.thoroughfare
            let number = address.subThoroughfare
            this.userAddress = `${street}, ${number} - ${district} , ${city} - ${state}`
            this.dismissLoadingDefault();
          }).catch((error: any) => {
            this.alert('Erro ao reverter latlng', error), 
            this.dismissLoadingDefault()
          });
      }).catch((error) => {
      this.alert('Erro ao pegar localização do device', error), 
      this.dismissLoadingDefault()
      });
    }, 2000);
  }
  markerDragEnd($event) {
    // this.alert('',JSON.stringify($event));
    //pega endereco por lat e lng
    this.nativeGeocoder.reverseGeocode($event.coords.lat, $event.coords.lng, this.options)
    .then((result: NativeGeocoderReverseResult[]) => {
      // this.alert('',JSON.stringify(result))
      let address = result[0]
      let state = address.administrativeArea
      let city = address.locality
      let district = address.subLocality
      let street = address.thoroughfare
      let number = address.subThoroughfare
      this.userAddress = `${street}, ${number} - ${district} , ${city} - ${state}`
    }).catch((error: any) => console.log(error));
  }
  ionViewWillLoad() {
    this.setCurrentLocation();
}}