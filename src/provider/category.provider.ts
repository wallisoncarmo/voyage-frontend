import { Category } from './../models/category';
import { API_CONFIG } from './../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CategoryProvider {

    constructor(public http: HttpClient) { }

    findAll(): Observable<Category[]> {
        return this.http.get<Category[]>(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.category}`);
    }

    findById(id: number): Observable<Category> {
        return this.http.get<Category>(`${API_CONFIG.baseUrl + API_CONFIG.endpoints.category}/${id}`);
    }

}