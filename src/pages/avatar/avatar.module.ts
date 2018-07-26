import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvatarPage } from './avatar';
import { ComponentsModule } from '../../components/components.module'
@NgModule({
  declarations: [
    AvatarPage,
  ],
  imports: [
    IonicPageModule.forChild(AvatarPage),
    ComponentsModule
  ],
})
export class AvatarPageModule {}
