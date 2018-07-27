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
    this.listenToJoin().subscribe(data => {
      if(data['user_room'] == this.nickname){
        console.log('eu' + data['user_room'] + 'fui convidado pelo:' +data['user_host_room'])
        this.socket.connect();
        this.socket.emit('Enterroom', data['room_id']);
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
    this.employer = user_room
    this.socket.emit('room', {user_room: user_room, user_host_room: this.nickname});
    this.socket.connect();
    // this.socket.emit('Enterroom', this.nickname);
    // let chat = {user_room: user_room, user_host_room:this.nickname, room_id:12131243134234}
    // let profileModal = this.modalCtrl.create('ChatRoomPage', {chat:chat, current_user:this.nickname});
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
    console.log(chat.user_host_room)
    this.socket.connect();
    this.socket.emit('Enterroom', chat.room_id);
    let profileModal = this.modalCtrl.create('ChatRoomPage', {chat:chat, current_user:this.nickname});
    profileModal.present();
  }
}