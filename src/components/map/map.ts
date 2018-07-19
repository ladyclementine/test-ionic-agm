import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange  } from '@angular/core';
import { AlertController, LoadingController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnChanges{
  public userAddress: any;
  public addressList = []
  public lat: any;
  public lng: any;
  public loading: any;
  public options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  @Input() lt: number;
  @Input() lg : number;
  @Input() address : string;
  @Output() ionClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();
  ngOnChanges(changes: SimpleChanges) {
    this.userAddress = changes.address.currentValue;
    this.lat = changes.lt.currentValue;
    this.lng = changes.lg.currentValue;
    // this.alert('', JSON.stringify(changes))
  }
  constructor(private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, 
    private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    console.log(this.lt, this.lg)
    //create search FormControl
    this.setCurrentLocation()
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
  getChoosenAddress(userAddress){
    this.notify.emit(userAddress);
  }
  openSearchContent(){
    this.ionClick.emit();
  }
  setCurrentLocation(){
    this.presentLoadingDefault();
    setTimeout(() => {
      this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {
        this.lat = resp.coords.latitude
        this.lng = resp.coords.longitude
        // pega endereco por lat e lng
        this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
          .then((result: NativeGeocoderReverseResult[]) => {
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
}
