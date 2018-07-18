import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { NativeGeocoder} from '@ionic-native/native-geocoder';
//custom imports
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http'
import { AgmCoreModule } from '@agm/core';
import { ComponentsModule } from '../components/components.module'

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB9OpY9ajfxP2vRgyXaVb1Ul39D5EVNrQ0',
      libraries: ["places"]
    }),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    Geolocation,
    NativeGeocoder,

  ]
})
export class AppModule {}
