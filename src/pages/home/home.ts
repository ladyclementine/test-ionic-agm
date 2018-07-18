import { Component, NgZone, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http} from '@angular/http';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public lat: number;
  public lng: number;
  public address: string;
  public overlayHidden: boolean = true;
  public className: string = 'no-blur';
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef;
  constructor(public http: Http, public navCtrl: NavController, 
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone ) 
  {
    //create search FormControl
    this.searchControl = new FormControl();
  }
  getAddress($event){
    console.log($event)
  }
  openOverlay($event){
    this.overlayHidden = false;
    this.className = 'blur'
  }
  ionViewDidLoad() {
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
              console.log(nativeHomeInputBox.value)
              if(nativeHomeInputBox.value){
               //set latitude, longitude
                this.address = nativeHomeInputBox.value
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.hideOverlay();
              }
          });
      });
    });
  }
  test(){
    let input = document.getElementsByClassName("pac-container")[0]
    // input.style.css
    console.log(input)
  }
  hideOverlay(){
    this.overlayHidden = true;
    this.className = 'no-blur'
  }
}