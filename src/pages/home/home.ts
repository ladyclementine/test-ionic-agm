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
  pet = "kittens"
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
    //escuta msgs
    this.listenToJoin().subscribe(data => {
      if(data['user_room'] == this.nickname){
        console.log('eu' + data['user_room'] + 'fui convidado pelo:' + data['user_host_room'])
        this.socket.connect();
        this.socket.emit('Enterroom', data['room_id']);
        this.conversas.push(data)
        this.pet = "kittens"
      } 
      else if(data['user_room'] == this.employer && data['user_host_room'] == this.nickname) {
        this.conversas_chamei.push(data)
        this.pet = "kittens"
      }
    });
   }
   // recebe msgs
   getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  //simboliza o nome dos dois participantes da conversa, podendo viar a ser o email cadastrado
   setNickname(nickname){
    this.nickname = nickname
   }

   //convida um usuario para um room
   toInvite(user_room){
    console.log(this.nickname + 'convidou' + user_room)
    // user_room seria o employer, ou seja, ao jober inicia a conversa com a solicitacao escolhida
    this.employer = user_room
    // só quem pode iniciar uma conversa é o jober.
    this.socket.connect();
    // let room_id = this.socket.connect().id 
    // console.log(room_id)
    this.socket.emit('room', {user_room: user_room, user_host_room: this.nickname});
    // this.socket.emit('Enterroom', room_id);
    // let chat = { user_room: user_room, user_host_room: this.nickname, room_id}
    // let profileModal = this.modalCtrl.create('ChatRoomPage', {chat:chat, current_user: this.nickname});
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
    console.log('room_id', chat.room_id)
    this.socket.emit('Enterroom', chat.room_id);
    let profileModal = this.modalCtrl.create('ChatRoomPage', {chat:chat, current_user:this.nickname});
    profileModal.present();
  }
}