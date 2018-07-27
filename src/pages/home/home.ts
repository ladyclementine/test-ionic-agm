import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nickname = ''
  employer = ''
  employers = [];
  conversas: any = []
  conversas_chamei: any = []
  messages = [];
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private socket: Socket) {
    this.employers = [
      {name: 'Rayane'},
      {name: 'Lucas'},
      {name: 'José'},
      {name: 'Bruno'},
    ];
    //recebe mensagens            
    this.getMessages().subscribe(message => {
      this.messages.push(message);
      console.log('escutando da home', message)
    });
    this.getChats().subscribe(data => {
      if(this.conversas.includes(data)){
        console.log('ja iniciou um room com ele')
      } else {
        console.log(data)
        // this.conversas.push(data);
      }
    });
    this.listenToJoin().subscribe(data => {
      if(data['user_room'] == this.nickname){
        console.log('eu' + data['user_room'] + 'fui convidado pelo:' +data['user_host_room'])
        // console.log(data)
        // this.socket.connect();
        // this.socket.emit('Enterroom', data['user_room']);
        this.conversas.push(data)
      } else  {
        this.conversas_chamei.push(data)
      }

    });
   }
   getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
   setNickname(nickname){
    this.nickname = nickname
   }
   //convida um usuario para um room
   toInvite(user_room){
    console.log(this.nickname + 'convidou' + user_room)
    this.socket.connect();
    this.employer = user_room
    this.socket.emit('room', {user_room: user_room, user_host_room: this.nickname});
    // let profileModal = this.modalCtrl.create('ChatRoomPage');
    // profileModal.present();
   }
   //escuta quando alguem me convida para um room
   listenToJoin() {
    let observable = new Observable(observer => {
      this.socket.on('callSpecificUser', function(data) {
        observer.next(data);
      });
    })
    return observable;
  }
  goChat(chat){
    console.log(chat)
    this.socket.connect();
    this.socket.emit('Enterroom', chat.user_room);
    let profileModal = this.modalCtrl.create('ChatRoomPage', {chat:chat, current_user:this.nickname});
    profileModal.present();
  }
   getChats() {
    let observable = new Observable(observer => {
      this.socket.on('getConections', function(data) {
        observer.next(data);
      });
    })
    return observable;
  }
  joinChat(room) {
    this.socket.connect();
    this.socket.emit('room', room);
    this.socket.emit('set-nickname', this.nickname);
    let profileModal = this.modalCtrl.create('ChatRoomPage', { nickname: this.nickname });
    profileModal.present();
    // profileModal.onDidDismiss(data => {
    //   console.log(data)
    // });
  }
}