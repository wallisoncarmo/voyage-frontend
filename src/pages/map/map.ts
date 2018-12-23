import { GoogleMapProvider } from './../../provider/google-map/google-map-provider';
import { Photograph } from './../../models/photograph';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LatLng } from '@ionic-native/google-maps';
import { PhotographProvider } from '../../provider/photograph.provider';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  item: Photograph;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleMapProvider: GoogleMapProvider,
    public photographProvider: PhotographProvider) { }

  ionViewDidLoad() {
    this.loadData();
    let current = new LatLng(this.item.latitude, this.item.longitude);
    this.googleMapProvider.loadMap("map_canvas", current);
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

}