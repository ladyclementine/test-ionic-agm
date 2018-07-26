import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
declare var cordova: any;
import { ImagePicker } from '@ionic-native/image-picker';

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
              private transfer: FileTransfer, private file: File,
              private imagePicker: ImagePicker)
               {
                this.headers = new Headers();   
                this.headers.append("Accept", 'application/json');
                this.headers.append('Content-Type', 'application/json');
                this.options = new RequestOptions({headers: this.headers});
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvatarPage');
  }
  chooseMultiple(){
      const options = {
          quality: 50,
          width: 1366,
          height: 768,
          maximumImagesCount: 5,
          outputType:1
      }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.alert('Image URI: ',  results[i]);
      }
    }).catch((error) => console.log('ss'));
  }
  action(employer, photo){
    let url = "http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar/";
    let params ={
      employer:employer,
      photo:photo
    }
    return this.http.post(url, params, this.options)
    .map((res) => {
      return res.json();
    }).toPromise()
  }
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
    }
  
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = "data:image/png;base64," + imageData;
      this.imageSrc = base64Image
      this.errorSend = base64Image
      this.alert('', base64Image)
      this.sendImage(imageData);
      // this.uploadFile(base64Image)
    }, (err) => {
      console.log(err);
    });
  }
  sendImage(base64Image){
    let employer = 'rayanesantos-131@hotmail.com'
    this.action(employer, base64Image).then((data) => {
      this.alert('', data)
    }).catch((error) => this.alert('',error))
  }
  openCamera(selection) {
    var options = this.takePic();

    this.camera.getPicture(options).then((imageData) => {
      // let base64Image = "data:image/png;base64," + imageData;
      // this.errorSend = base64Image
      this.alert('', imageData)
      // this.sendImage(imageData);
      // this.uploadFile(base64Image)
    }, (err) => {
      console.log(err);
    });
}
  takePic(){
    let options: CameraOptions = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,  //Corrects Android orientation quirks,
      saveToPhotoAlbum: false,
      //popoverOptions: this.cameraPopoverOptions
    }
    return options
  }
  // uploadFile(base64Image){
  //   // let loader = this.loadingCtrl.create({
  //   //   content: "Uploading..."
  //   // });
  //   // loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   // File name only
  //   // let options: FileUploadOptions = {
  //   //   fileKey: 'ionicfile',
  //   //   fileName: 'ionicfile',
  //   //   chunkedMode: false,
  //   //   mimeType: "image/jpeg",
  //   //   headers: {}
  //   // }
  //   var options = {
  //     fileKey: "file",
  //     fileName: "name.jpg",
  //     chunkedMode: false,
  //     mimeType: "image/jpg",
  //     headers: {},
  //     // params : {'directory':'upload', 'fileName':fileName} // directory represents remote directory,  fileName represents final remote file name
  //   };

  //   // this.alert('', this.imageURI);
  //   // fileTransfer.upload(`${this.imageURI}`, 'http://localhost:8000/file/upload/', options)
  //   //   .then((data) => {
  //     // this.imageFileName = "http://localhost:8000/media/name.jpg"
  //     // this.alert('data', JSON.stringify(data));
  //     let employer: any = {}
  //     let params = {
  //       remark: "teste",
  //       file:"teste.jpg"
  //     }
  //     // employer.remark = "visitante@devari.com.br"
  //     // employer.photo = 'data.jpg'

  //     let postData = new FormData();
  //     postData.append('file', base64Image)
  //     this.alert('', JSON.stringify(postData));
  //     this.send(base64Image).then((data) => {
  //       this.alert('data sent', JSON.stringify(data));
  //     }).catch((error) => this.alert('Erro sent', this.errorSend = error))
  //     // loader.dismiss();
  //     // this.presentToast("Image uploaded successfully");
  //   // }).catch((error) => this.alert('erro transfer', this.errorTransfer = error))
  //     // loader.dismiss();
  //     // this.presentToast(err);
  // }
  send(base64Image){
    let url = "http://localhost:8000/file/upload/";
    return this.http.post(url, base64Image, this.options)
    .map((res) => {
      return res.json();
    }).toPromise()
  }
  alert(data, data2) {
    let alert = this.alertCtrl.create({
      title: data,
      subTitle: data2,
      buttons: ['Dismiss']
    });
    alert.present();
  } 
}
