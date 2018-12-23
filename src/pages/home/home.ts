import { CategoryProvider } from './../../provider/category.provider';
import { Category } from './../../models/category';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Utils } from './../../utils/utils';
import { Photograph } from './../../models/photograph';
import { API_CONFIG } from './../../config/api.config';
import { Component } from '@angular/core';
import { NavController, LoadingController, IonicPage, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotographProvider } from '../../provider/photograph.provider';
import { GoogleMapProvider } from '../../provider/google-map/google-map-provider';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Photograph[] = [];
  page: number = 0;
  baseImage = API_CONFIG.baseImageUrl;
  cameraOn: boolean = false;
  picture: String;
  search: String = "";
  title: String = "";
  checkboxOpen = false;
  categoriesSelected: String="";
  categories: Category[] = [];


  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public utils: Utils,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public photographProvider: PhotographProvider,
    public categoryProvider: CategoryProvider,
    public alertCtrl: AlertController,
    public googleMapProvider: GoogleMapProvider
  ) {
  }

  ionViewDidEnter() {
    this.getCategories();
    this.initList();
    this.googleMapProvider.validGPS();
  }

  public loadData(load: boolean = true) {
    let loading;
    if (load)
      loading = this.presentLoading();

    this.photographProvider.findAll(this.page, this.title,this.categoriesSelected).subscribe(res => {

      this.items = this.items.concat(res['content']);
      if (load)
        loading.dismiss();

    }, error => {
      this.items = [];
      if (load)
        loading.dismiss();

    });
  };

  public showEdit(photograph: Photograph) {
    this.navCtrl.push('PhotographPage', { photograph: photograph });
  }

  public showDetail(photograph: Photograph) {
    this.navCtrl.push('DetailPage', { photograph: photograph });
  }

  public confirmDelete(photograph: Photograph) {
    this.presentConfirm(photograph);
  }

  public showPhotograph() {
    this.cameraOn = true;
    const options: CameraOptions = this.getConfigCamera();
    this.getPicture(options);
  }

  public presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Carregando os registros aguarde..."
    });
    loader.present();
    return loader;
  }

  public doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  public doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

  public getImage(id: number): String {
    return this.utils.getPhotograph(id);
  }

  public updateList(ev) {
    if (ev.target.value.length > 3) {
      this.title = ev.target.value;
      this.initList(false);
    } else if (ev.target.value.length == 0) {
      this.title = "";
      this.initList(false);
    }
  }

  private initList(load: boolean = true) {
    this.items = [];
    this.loadData(load);
  }


  private presentConfirm(item: Photograph) {
    let alert = this.alertCtrl.create({
      title: 'Excluir foto',
      message: 'Você realmente deseja excluir a foto ' + item.title,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('modal foi cancelado');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.photographProvider.delete(item.id).subscribe(res => {
              this.showInsertOk();
              this.initList();
            }, error => { });
          }
        }
      ]
    });
    alert.present();
  }

  private getPicture(options: CameraOptions) {
    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
      this.navCtrl.push('PhotographPage', { picture: this.picture });
    }, (err) => {
      this.cameraOn = false;
    });
  }

  private getConfigCamera(): CameraOptions {
    return {
      quality: 100,
      targetWidth: 800,
      targetHeight: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    };
  }

  private showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Registro foi excluido',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { }
        },
      ]
    });
    alert.present();
  }


  doCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Informe as categorias que deseja filtar');

    this.categories.forEach((obj) => {
      alert.addInput({
        type: 'checkbox',
        label: obj.name,
        value: obj.id.toString(),
        checked: false
      });
    })

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Aplicar',
      handler: (data: any) => {
        this.items=[];
        this.checkboxOpen = false;
        this.categoriesSelected = data.toString();
        this.loadData();
      }
    });

    alert.present();
  }
  private getCategories() {
    this.categoryProvider.findAll().subscribe(res => {
      this.categories = res;
    }, error => {
      this.navCtrl.setRoot('HomePage');
    });
  }
}
