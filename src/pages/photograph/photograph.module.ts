import { Camera } from '@ionic-native/camera';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotographPage } from './photograph';

@NgModule({
  declarations: [
    PhotographPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotographPage),
  ],
  providers:[
    Camera
  ]
})
export class PhotographPageModule {}
