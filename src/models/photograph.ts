import { Category } from './category';

export interface Photograph {
    id : number;
    title : String;
    description : String;
    category?: Category;
    active:boolean;
    latitude:number;
    longitude:number;
}