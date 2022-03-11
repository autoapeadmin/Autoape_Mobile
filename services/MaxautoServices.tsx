import React from "react";
import Globals from "../constants/Globals";

export default class extends React.Component {

    //GET LISTED NEW CARS
    static getNewCars = async () => {
        var dataObj;
        fetch(Globals.BASE_URL + "Maxauto/getNewCars")
            .then(response => response.json())
            .then(data => {
                //console.log(data.data);
                return (data.data);
                //setNewCars(data.data);
            });
    }


    static addWashList = async (customer_id, vehicle_id) => {
        var dataObj;
        fetch(Globals.BASE_URL + "Maxauto/addWashList/" + customer_id + "/" + vehicle_id)
            .then(response => response.json())
            .then(data => {
                //console.log(data.data);
                return (data.data);
                //setNewCars(data.data);
            });
    }


    static removeWashList = async (customer_id, vehicle_id) => {
        var dataObj;
        fetch(Globals.BASE_URL + "Maxauto/removeWashList/" + customer_id + "/" + vehicle_id)
            .then(response => response.json())
            .then(data => {
                //console.log(data.data);
                return (data.data);
                //setNewCars(data.data);
            });
    }



}