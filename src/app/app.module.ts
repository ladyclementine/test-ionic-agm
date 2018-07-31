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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://192.168.0.39:3001', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
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
    Camera,
    File,
    FileTransfer,
    ImagePicker

  ]
})
export class AppModule {}
