import { ImageUtilProvide } from './image.ulti.provider';
import { API_CONFIG } from './../config/api.config';
import { Photograph } from './../models/photograph';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class PhotographProvider {

    constructor(public http: HttpClient, public imageUtilProvide: ImageUtilProvide) { }

    findAll(page: number, title: String = "", categories: String = "", linesPerPage: number = 10): Observable<Photograph[]> {
        return this.http.get<Photograph[]>(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/page?page=${page}&linesPerPage=${linesPerPage}&title=${title}&categories=${categories}`);
    }

    findById(id: number): Observable<Photograph> {
        return this.http.get<Photograph>(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/${id}`);
    }

    findByCategory(categories: number, page: number, linesPerPage: number = 10): Observable<Photograph[]> {
        return this.http.get<Photograph[]>(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/page?categories=${categories}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    insert(obj: Photograph) {
        return this.http.post(
            `${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}`,
            obj, {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    update(obj: Photograph) {
        return this.http.put(
            `${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/${obj.id}`,
            obj, {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    delete(id: number) {
        return this.http.delete(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/${id}`);
    }

    uploadPicture(picture, id) {
        let pictureBlob = this.imageUtilProvide.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.put(
            `${API_CONFIG.baseUrl + API_CONFIG.endpoints.photograph}/upload/${id}`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}