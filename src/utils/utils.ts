import { API_CONFIG } from './../config/api.config';

export class Utils {

    baseImage=API_CONFIG.baseImageUrl;

    getPhotograph(id:number):String {
        var image = new Image();
    
        image.src = `${this.baseImage}${id}.jpg`;
    
        if (!image.complete) {
            return "assets/imgs/travel.jpg";
        }
        else if (image.height === 0) {
            return "assets/imgs/travel.jpg";
        }
        return image.src; 
      } 
}