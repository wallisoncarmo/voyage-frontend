import { GoogleMapProvider } from './../../provider/google-map/google-map-provider';
import { CategoryProvider } from './../../provider/category.provider';
import { PhotographProvider } from './../../provider/photograph.provider';
import { Photograph } from './../../models/photograph';
import { Category } from './../../models/category';
import { Utils } from './../../utils/utils';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, AlertController, LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-photograph',
  templateUrl: 'photograph.html',
})
export class PhotographPage {

  @ViewChild('fab') fab: FabContainer;

  photograph: Photograph;
  imageBlank = 'assets/imgs/blank.jpg';
  photographImage: String = "";
  cameraOn: boolean = false;
  picture: String;
  categories: Category[] = [];
  formGroup: FormGroup;
  locale: LatLng;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public utils: Utils,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public categoryProvider: CategoryProvider,
    public photographProvider: PhotographProvider,
    public googleMapProvider: GoogleMapProvider,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController
  ) {
    this.createFormGroup();
  }

  ionViewDidEnter() {
    this.getCategories();
    this.getValueParams();

    if (!this.formGroup.value.id)
      this.getLocale();
  }

  private getLocale() {
    let loading;
    loading = this.presentLoading();
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.formGroup.controls.latitude.setValue(resp.coords.latitude);
        this.formGroup.controls.longitude.setValue(resp.coords.longitude);
        loading.dismiss();
      })
      .catch(error => {
        console.log("Error getting location", error);
        loading.dismiss();
      });

  }

  public getCameraPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 800,
      targetHeight: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photographImage = this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });

    this.fab.close();
  }

  public getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 800,
      targetHeight: 800,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photographImage = this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });

    this.fab.close();
  }

  public sendPicture() {
    console.log(this.formGroup.value);

    if (this.formGroup.value.id) {
      this.updatePhotograph();
    } else {
      this.insertPhotograph();
    }
    this.fab.close();
  }

  private updatePhotograph() {
    this.photographProvider.update(this.formGroup.value).subscribe(response => {
      if (!this.picture)
        return this.showInsertOk();
      this.uploadImage(this.formGroup.value.id);
    }, error => { });
  }

  private insertPhotograph() {
    this.photographProvider.insert(this.formGroup.value).subscribe(response => {
      let id = this.getIdInsert(response);
      if (!this.picture)
        return this.showInsertOk();
      this.uploadImage(id);
    }, error => { });
  }

  private getIdInsert(response) {
    let location = response.headers.get('Location');
    let id = location.replace(/^.*\//g, '');
    return id;
  }

  private uploadImage(id: string) {
    this.photographProvider.uploadPicture(this.picture, id)
      .subscribe(res => {
        this.showInsertOk();
      }, error => { });
  }

  public cancel() {
    this.photographImage = this.picture = null;
    this.fab.close();
  }

  public getPhotograph() {
    return this.photographImage ? this.photographImage : this.imageBlank;
  }

  private getCategories() {
    this.categoryProvider.findAll().subscribe(res => {
      this.categories = res;
    }, error => {
      this.navCtrl.setRoot('HomePage');
    });
  }

  private createFormGroup() {
    this.formGroup = this.formBuilder.group({
      id: [null, []],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(240)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(999)]],
      category: [null, [Validators.required]],
      active: [true, [Validators.required]],
      latitude: [null, []],
      longitude: [null, []]
    });
  }

  private getValueParams() {
    if (this.navParams.get('photograph')) {
      this.photograph = this.navParams.get('photograph');
      this.photographImage = this.utils.getPhotograph(this.photograph.id);
      this.setFormGroup();
    }
    if (this.navParams.get('picture')) {
      this.photographImage = this.picture =  this.navParams.get('picture');
    }
  }

  private setFormGroup() {
    this.formGroup.controls.id.setValue(this.photograph.id);
    this.formGroup.controls.title.setValue(this.photograph.title);
    this.formGroup.controls.description.setValue(this.photograph.description);
    this.formGroup.controls.category.setValue(this.photograph.category);
    this.formGroup.controls.latitude.setValue(this.photograph.latitude ? this.photograph.latitude : -15.7997654);
    this.formGroup.controls.longitude.setValue(this.photograph.longitude ? this.photograph.latitude : -47.8644715);
  }

  private showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso',
      message: 'Salvo com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        },
      ]
    });
    alert.present();
  }

  private presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Pegando sua localização aguarde..."
    });
    loader.present();
    return loader;
  }

}
