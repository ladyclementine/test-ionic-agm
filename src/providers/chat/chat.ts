import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ChatProvider {
  
  private headers: Headers;
  private options: RequestOptions;

  constructor(public http: Http) {
    this.headers = new Headers();
    this.headers.append("Accept", "Application/json");
    this.headers.append("Access-Control-Allow-Origin", "*");
    this.headers.append("Content-Type", "Application/json");
    this.options = new RequestOptions({headers: this.headers});
  }
  public getChat(email){
    let url = `http://ijob-chat.devari.com.br/api/chats?query=${email}`;
    return this.http.get(url, this.options)
    .map((res) => {
      return res.json();
    })
    .catch(this.errorHandler)
    .toPromise();
  }
  public getChatHistory(room_id){
    let url = `http://ijob-chat.devari.com.br/api/chat-history?query=${room_id}`;
    return this.http.get(url, this.options)
    .map((res) => {
      return res.json();
    })
    .catch(this.errorHandler)
    .toPromise();
  }
  public getChatNotification(email){
    let url = `http://ijob-chat.devari.com.br/api/message-alert?query=${email}`;
    return this.http.get(url, this.options)
    .map((res) => {
      return res.json();
    })
    .catch(this.errorHandler)
    .toPromise();
  }
  private errorHandler(error: Response | any) {
      return Observable.throw("Erro ao tentar acessar o servidor.");
  }
}
