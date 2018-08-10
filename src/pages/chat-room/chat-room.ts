import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { AppStorage } from '../../providers/storage/appstorage'
import { ChatProvider } from '../../providers/chat/chat'

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
              public viewCtrl: ViewController, public storage: AppStorage,
              public chatProvider: ChatProvider) {
    //recebe mensagens            
    this.getMessages().subscribe(message => {
      // console.log('menssagem', message)
      if(this.messages.includes(message)){
        console.log('ja tem')
      } else {
        this.messages.push(message);
        console.log(this.message)
      }
    });
    // this.getHistory().subscribe(data => {
    //   console.log('data do redinho', data)
    //   this.messages = data
    // })
  }
  getHistory() {
    let observable = new Observable(observer => {
      this.socket.on('message-history', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  getChatHistory(){
    setTimeout(() => {
      this.chatProvider.getChatHistory(this.current_chat_info.room_id).then((messages) =>{
        console.log(messages.list)
        this.messages = messages.list
      })
    }, 1000);

  }
  ionViewWillEnter(){
    this.current_chat_info = this.navParams.data.chat
    this.current_user = this.navParams.data.current_user
    console.log('current_user:', this.current_user)
    if(this.current_chat_info.user_room !== this.current_user){
      this.chatting_with = this.current_chat_info.user_room
    } else {
      this.chatting_with = this.current_chat_info.user_host_room
    }
    console.log(this.navParams.data)
    this.getChatHistory()
  }
  sendMessage() {
    let emailMatch = this.message.replace(/ /g,"").match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
    if(emailMatch){
      console.log('nao pode dizer email')
      let alert = {created: Date.now(), from: 'ijob', text: "Não envie informações de contato. Com o Ijob voce ficará mais seguro para negociar."}
      this.messages.push(alert)
      this.message = '';
    } else {
      this.socket.emit('add-message', { text: this.message, room_info: this.navParams.data.chat, current_user: this.current_user });
      this.message = '';
    }
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