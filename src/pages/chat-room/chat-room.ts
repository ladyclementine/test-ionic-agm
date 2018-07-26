import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
 
@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
  clients: any  = [];
  constructor(private navCtrl: NavController, private navParams: NavParams, 
              private socket: Socket, private toastCtrl: ToastController, 
              public viewCtrl: ViewController) {
    this.getMessages().subscribe(message => {
      console.log('mensages', message)
      this.messages.push(message);
    });
    console.log(this.navParams.data)
  }
 
  sendMessage() {
    this.socket.emit('add-message', { text: this.message, room_info: this.navParams.data });
    this.message = '';
  }
 
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
  closeChat(){
    this.socket.disconnect();
    this.viewCtrl.dismiss();
  }
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}