import { Component, NgZone, ViewChild, ElementRef  } from '@angular/core';
import { NavController, AlertController, LoadingController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http} from '@angular/http';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import {FormControl} from "@angular/forms";
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public lat: any;
  public lng: any;
  public overlayHidden: boolean = true;

  public options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  public userAddress: any;
  public addressList = []
  public loading: any;
  public className: string = 'no-blur';
  public searchControl: FormControl;

  @ViewChild("search")
    public searchElementRef;
  constructor(private nativeGeocoder: NativeGeocoder, public http: Http, 
              public navCtrl: NavController, private geolocation: Geolocation, 
              private alertCtrl: AlertController, public loadingCtrl: LoadingController,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone ) 
              {
      //create search FormControl
      this.searchControl = new FormControl();
  }
  ionViewDidLoad() {
    this.setCurrentLocation();
    this.searchControl = new FormControl();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
          types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                  return;
              }

              //set latitude, longitude and zoom
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
              // this.zoom = 12;
          });
      });
    });
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
  openSearchContent(){
    this.overlayHidden = false;
    this.className = 'blur'
  }
  hideOverlay(){
    this.overlayHidden = true;
    this.className = 'no-blur'
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
            this.addressList = result
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
      this.addressList = result
      let address = result[0]
      let state = address.administrativeArea
      let city = address.locality
      let district = address.subLocality
      let street = address.thoroughfare
      let number = address.subThoroughfare
      this.userAddress = `${street}, ${number} - ${district} , ${city} - ${state}`
    }).catch((error: any) => console.log(error));
  }
  // getItems(input){
  //   this.nativeGeocoder.forwardGeocode(input, this.options)
  //   .then((coordinates: NativeGeocoderForwardResult[]) => {
  //     // this.alert('', JSON.stringify(coordinates))
  //     for(let coordinate of coordinates){
  //       this.nativeGeocoder.reverseGeocode(parseInt(coordinate.longitude), parseInt(coordinate.longitude), this.options)
  //       .then((result: NativeGeocoderReverseResult[]) => {
  //         // this.alert('',JSON.stringify(result))
  //         this.addressList.push(result)
  //         let address = result[0]
  //         let state = address.administrativeArea
  //         let city = address.locality
  //         let district = address.subLocality
  //         let street = address.thoroughfare
  //         let number = address.subThoroughfare
  //         this.userAddress = `${street}, ${number} - ${district} , ${city} - ${state}`
  //       }).catch((error: any) => console.log(error));
  //     }
  //   }).catch((error: any) => console.log(error));
  // }

}