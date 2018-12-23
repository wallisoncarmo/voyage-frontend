import { Coordinate } from './../../models/coordinate';
import {
    GoogleMaps,
    GoogleMap,
    LatLng,
    GoogleMapsEvent
} from "@ionic-native/google-maps";
import { Injectable } from "@angular/core";
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

/*
  Generated class for the GoogleMapProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapProvider {
    map: GoogleMap;
    constructor(
        public locationAccuracy: LocationAccuracy,
        public diagnostic: Diagnostic
    ) { }

    public loadMap(name_mapa, position: LatLng) {

        this.map = GoogleMaps.create(name_mapa, {
            controls: {
                compass: true,
                myLocationButton: true,
                indoorPicker: true,
                zoom: true
            },
            camera: {
                target: position,
                tilt: 3,
                zoom: 15
            }
        });

        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            this.map.setCameraZoom(18);
            this.map.setCameraTarget(position);
        });

        this.addMarker(position, "Você está aqui");
    }

    private addMarker(coordinate: Coordinate, titulo: string) {
        this.map
            .addMarker({
                position: coordinate,
                draggable: false,
                disableAutoPan: true,
                icon: {
                    size: {
                        width: 32,
                        height: 32
                    },
                    //url: "./assets/imgs/marker-1.png"
                }
            });
    }

    public clearMap() {
        this.map.clear();
    }

    public validGPS(): Promise<any> {
        return this.diagnostic
            .isGpsLocationEnabled()
            .then(state => {
                this.ativarGPS();
                return state;
            })
            .catch(e => console.error(e));
    }

    public ativarGPS() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                this.locationAccuracy
                    .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                    .then(
                        () => console.log("Request successful"),
                        error => {
                            console.log("Error requesting location permissions", error);
                            this.ativarGPS();
                        }
                    );
            }
        });
    }
}