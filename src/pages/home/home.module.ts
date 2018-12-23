import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage)],
  providers:[Camera]
})
export class HomePageModule {}
