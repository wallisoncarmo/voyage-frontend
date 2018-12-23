import { Utils } from './../../utils/utils';
import { Photograph } from './../../models/photograph';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotographProvider } from '../../provider/photograph.provider';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  item: Photograph;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public utils:Utils,
    public photographProvider:PhotographProvider) {}


  ionViewDidEnter() {
    this.loadData();
  }

  private loadData() {    
    if (this.navParams.get('photograph') == null) {
      this.navCtrl.setRoot('HomePage');
    }

    this.item = this.navParams.get('photograph');

    this.photographProvider.findById(this.item.id).subscribe(res => {
      this.item = res;
    }, error => {
      this.navCtrl.setRoot('HomePage');
    });
  }

  changeStatus(active: boolean ){
    this.item.active=active;
  }

  showEdit() {
    this.navCtrl.push('PhotographPage', { photograph: this.item });
  }

  showMap() {
    this.navCtrl.push('MapPage', { photograph: this.item });
  }

  getImage(id:number):String {
    return this.utils.getPhotograph(id);
  } 

}
