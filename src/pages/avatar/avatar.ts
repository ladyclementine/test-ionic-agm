import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-avatar',
  templateUrl: 'avatar.html',
})
export class AvatarPage {
  private headers: Headers;
  private options: RequestOptions;
  public imageSrc: any;
  public imageURI:any;
  public imageFileName:any;
  public errorTransfer:any;
  public errorSend:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera, 
              public alertCtrl: AlertController,
              private http: Http,
              private transfer: FileTransfer, private file: File) {
                this.headers = new Headers();   
                this.headers.append("Accept", 'application/json');
                this.headers.append('Content-Type', 'application/json');
                this.options = new RequestOptions({headers: this.headers});
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvatarPage');
  }
  getImage() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile()
    }, (err) => {
      console.log(err);
    });
  }
  uploadFile(){
    // let loader = this.loadingCtrl.create({
    //   content: "Uploading..."
    // });
    // loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }
    // this.alert('', this.imageURI);
    fileTransfer.upload(this.imageURI, 'http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar/', options)
      .then((data) => {
      this.alert('data', JSON.stringify(data));
      let employer: any = {}
      employer.employer = "visitante@devari.com.br"
      employer.photo = data
      this.alert('', JSON.stringify(employer));
      this.send(employer).then((data) => {
        this.alert('data sent', JSON.stringify(data));
      }).catch((error) => this.alert('Erro sent', this.errorSend = error))
      // loader.dismiss();
      // this.presentToast("Image uploaded successfully");
    }).catch((error) => this.alert('erro transfer', this.errorTransfer = error))
      // loader.dismiss();
      // this.presentToast(err);
  }
  send(employer){
    let url = "http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar/";
    return this.http.post(url, employer, this.options)
    .map((res) => {
      return res.json();
    }).toPromise()
  }

  // public requestSignUp(employer){
  //   let url = 'http://ijob-dev.devari.com.br/api/employer/usuario/';
  //   return this.http.post(url , employer, this.options)
  //   .map((res) => {
  //     return res.json();

  //   })
  //   .catch(this.errorHandler)
  //   .toPromise();
  // }
  // private errorHandler(error: Response | any) {
  //   return Observable.throw(error);
  // }
  alert(data, data2) {
    let alert = this.alertCtrl.create({
      title: data,
      subTitle: data2,
      buttons: ['Dismiss']
    });
    alert.present();
  } 
  // private uploadPhoto(imageFileUri: any): void {
  //   // this.error = null;
  //   // this.loading = this.loadingCtrl.create({
  //   //   content: 'Uploading...'
  //   // });

  //   // this.loading.present();
  //   this.alert('dentro da requisicao', '')
  //   this.file.resolveLocalFilesystemUrl(imageFileUri)
  //     .then(entry => (<any>entry).file(file => this.readFile(file)))
  //     .catch(err => this.alert('',err));
  // }
  // private readFile(file: any) {
  //   this.alert('dentro da requisicao', '')
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const formData = new FormData();
  //     const imgBlob = new Blob([reader.result], {type: file.type});
  //     formData.append('file', imgBlob, file.name);
  //     let employer: any = {}
  //     employer.employer = "rayane12@gmail.com"
  //     employer.photo =  formData

  //     this.alert('', JSON.stringify(formData))
  //     let url = "http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar";
  //     return this.http.put(url, employer, this.options)
  //     .map((res) => {
  //       this.alert('dentro da requisicao', '')
  //       return res.json();
  //     }).catch(this.errorHandler).toPromise();
  //   };
  //   reader.readAsArrayBuffer(file);
  // }
  // openLibrary(){
  //     this.camera.getPicture({
  //       sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //       destinationType: this.camera.DestinationType.FILE_URI,
  //       quality: 100,
  //       encodingType: this.camera.EncodingType.PNG,
  //     }).then(imageData => {
  //       this.imageSrc = imageData;
  //       this.uploadPhoto(imageData);
  //     }, error => {JSON.stringify(error);
  //     });
  // }
  // open(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  //   this.camera.getPicture(options).then((imageData) => {
  //     let employer: any = {}
  //     // let imageName = imageData;
  //     let base64Image = 'data:image/jpeg;base64,' + imageData;
  //     let  formData = new FormData();
  //     const reader = new FileReader();
  //     const imgBlob = new Blob([reader.result], {type: imageData.type});
  //     formData.append('file', imgBlob,  imageData.name);
  //     // body.append('photo', imageData)
  //     // body.append('photo', imageData.name);
  //     formData.append('username', 'Chris');
  //     formData.append('userpic', imageData, 'chris.jpg');
  //     this.alert('', JSON.stringify(formData))
  //     employer.employer = "rayanesantos-131@hotmail.com"
  //     employer.photo =  formData

  //     // this.alert('', imageData)
  //     let url = "http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar";
  //     return this.http.put(url, employer, this.options)
  //     .map((res) => {
  //       return res.json();
  //     }).catch(this.errorHandler).toPromise();
  //   });
  // }
  
}
