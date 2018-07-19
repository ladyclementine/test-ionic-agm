import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvatarUploadPage } from './avatar-upload';

@NgModule({
  declarations: [
    AvatarUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(AvatarUploadPage),
  ],
})
export class AvatarUploadPageModule {}
