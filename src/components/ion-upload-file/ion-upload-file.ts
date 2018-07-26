import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ion-upload-file',
  templateUrl: 'ion-upload-file.html'
})
export class IonUploadFileComponent {
  private headers: Headers;
  private options: RequestOptions;
  text: string;

  constructor(private http: Http, private camera: Camera,) {
      this.headers = new Headers();   
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json');
      this.options = new RequestOptions({headers: this.headers});
  }
  send(employer, photo){
    let url = "http://ijob-dev.devari.com.br/api/employer/usuario/enviar_avatar/";
    let params ={
      employer:employer,
      photo:photo
    }
    return this.http.post(url, params, this.options)
    .map((res) => {
      return res.json();
    })
    .catch(this.errorHandler)
    .toPromise()
  }
  private errorHandler(error: Response | any) {
    return Observable.throw(error);
  }
  chooseImg(){
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
      this.uploadToServer(imageData);
    }, (err) => {
      console.log(err);
    });
  }
  uploadToServer(base64Image){
    let employer = 'rayanesantos-131@hotmail.com'
    this.send(employer, base64Image).then((data) => {
    }).catch((error) => console.log('', error))
  }
}
