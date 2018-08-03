import { Storage } from '@ionic/storage';

export class AppStorage {
  private messageStorage: Storage;
  constructor() {
    this.messageStorage = new Storage({name: 'mapbd'});
  }
  public setMsg(msgInfo) {
    return this.messageStorage.set('mapInfo', msgInfo);
  }
  public getMsg() {
    return this.messageStorage.get('mapInfo')
      .then((msgInfo) => { return msgInfo; })
      .catch((err) => err) 
  }
  public clearStorage() {
    return this.messageStorage.clear();
  }
}
