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
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private socket: Socket) {
    this.employers = [
      {name: 'Rayane'},
      {name: 'Lucas'},
      {name: 'José'},
      {name: 'Bruno'},
    ];
    this.getChats().subscribe(data => {
      if(this.conversas.includes(data)){
        console.log('ja iniciou um room com ele')
      } else {
        console.log(data)
        // this.conversas.push(data);
      }
    });
    this.listenToJoin().subscribe(data => {
      console.log(data['user_room'])
      console.log(this.nickname)

      if(data['user_room'] == this.nickname){
        console.log("me chamaram")
        this.conversas.push(data)
        // this.socket.emit('enterRoom', data['room_id']);
      } else {
        this.conversas_chamei.push(data)
      }

    });
   }
   setNickname(nickname){
    this.nickname = nickname
   }
   //convida um usuario para um room
   toInvite(user_room){
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
    this.socket.connect();
    this.socket.emit('Enterroom', chat.user_room);
    let profileModal = this.modalCtrl.create('ChatRoomPage', chat);
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