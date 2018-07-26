import { IonicModule } from 'ionic-angular'
import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AgmCoreModule } from '@agm/core';
import { IonUploadFileComponent } from './ion-upload-file/ion-upload-file';

@NgModule({
	declarations: [MapComponent,
    IonUploadFileComponent],
	imports: [IonicModule, AgmCoreModule],
	exports: [MapComponent,
    IonUploadFileComponent]
})
export class ComponentsModule {}
