import { ImageUtilProvide } from './../provider/image.ulti.provider';
import { CategoryProvider } from './../provider/category.provider';
import { Utils } from './../utils/utils';
import { ErrorInterceptorProvider } from './../interceptors/error-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { PhotographProvider } from '../provider/photograph.provider';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from "@ionic-native/google-maps";
import { GoogleMapProvider } from '../provider/google-map/google-map-provider';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ErrorInterceptorProvider,
    Utils,
    PhotographProvider,
    CategoryProvider,
    ImageUtilProvide,
    Geolocation,
    GoogleMaps,
    GoogleMapProvider,
    LocationAccuracy,
    Diagnostic
  ]
})
export class AppModule {}
