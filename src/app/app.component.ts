import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ChatProvider } from '../providers/chat/chat'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public chatProvider: ChatProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    // this.checkNewMessages()
  }
  // checkNewMessages(){
  //   this.chatProvider.getChatNotification("Lucas").then((data) => {
  //      if(data.has_message){
  //        console.log('ei, tem mensagem nova querido.')
  //      } else {
  //       console.log('Não tem mensagem nova querido.')
  //      }
  //   })
  //   setTimeout(() => {
  //     this.checkNewMessages()
  //   }, 10000);
  // }
}

