import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { AppStorage } from '../../providers/storage/appstorage'

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  messages: any  =[];
  message = '';
  current_chat_info: any;
  chatting_with: any;
  current_user: any;
  constructor(private navCtrl: NavController, private navParams: NavParams, 
              private socket: Socket, private toastCtrl: ToastController, 
              public viewCtrl: ViewController, public storage: AppStorage) {
    //recebe mensagens            
    this.getMessages().subscribe(message => {
      console.log('menssagem', message)
      if(this.messages.includes(message)){
        console.log('ja tem')
      } else {
        this.messages.push(message);
        console.log(this.message)
      }
    });
    this.getHistory().subscribe(data => {
      console.log('data do redinho', data)
      this.messages = data
    })
  }
  getHistory() {
    let observable = new Observable(observer => {
      this.socket.on('message-history', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  getMessagesFromStorage(){
    setTimeout(() => {
      // this.storage.getMsg().then((msgs) => {
      //   console.log('tem mensagens', msgs)
      //   if(msgs !== null){
      //     // this.messages.push(msgs)
      //     this.messages = msgs
      //   }
      // })
      this.socket.emit('get-message-history', this.current_chat_info.room_id)
    }, 1000);

  }
  ionViewWillEnter(){
    this.getMessagesFromStorage()
    this.current_chat_info = this.navParams.data.chat
    this.current_user = this.navParams.data.current_user
    console.log('current_user:', this.current_user)
    if(this.current_chat_info.user_room !== this.current_user){
      this.chatting_with = this.current_chat_info.user_room
    } else {
      this.chatting_with = this.current_chat_info.user_host_room
    }
    console.log(this.navParams.data)
  }
  sendMessage() {
    this.socket.emit('add-message', { text: this.message, room_info: this.navParams.data.chat, current_user: this.current_user });
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