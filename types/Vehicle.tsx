import { Make } from "./Make";
import { Model } from "./Model";

export interface Vehicle {
    vehicle_id:number,
    model:Model;
    make:Make;
    year:number;
}