import { async } from "asyncawait";
import React from "react";
import { AsyncStorage } from "react-native";
import Globals from "../constants/Globals";
import * as Notifications from "expo-notifications";
import { Vehicle } from "../types/Vehicle";

export default class extends React.Component {
  //GET LISTED NEW CARS
  static getNewCars = async () => {
    try {
      fetch(Globals.BASE_URL + "Maxauto/getNewCars")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {}
  };

  static addLike = async (customer_id: string, vehicle_id: string) => {
    fetch(
      Globals.BASE_URL + "Maxauto/addLike/" + customer_id + "/" + vehicle_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static removeLike = async (customer_id: string, vehicle_id: string) => {
    fetch(
      Globals.BASE_URL + "Maxauto/removeLike/" + customer_id + "/" + vehicle_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static deleteMyVehicle = async (vehicle_id: string) => {
    fetch(Globals.BASE_URL + "Maxauto/deleteMyVehicle/" + vehicle_id)
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static addWashList = async (customer_id: string, vehicle_id: string) => {
    fetch(
      Globals.BASE_URL + "Maxauto/addWashList/" + customer_id + "/" + vehicle_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static removeWashList = async (customer_id: string, vehicle_id: string) => {
    fetch(
      Globals.BASE_URL +
        "Maxauto/removeWashList/" +
        customer_id +
        "/" +
        vehicle_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static addWashListDealer = async (customer_id: string, dealer_id: string) => {
    fetch(
      Globals.BASE_URL +
        "Maxauto/addWashListDealer/" +
        customer_id +
        "/" +
        dealer_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static removeWashListDealer = async (
    customer_id: string,
    dealer_id: string
  ) => {
    fetch(
      Globals.BASE_URL +
        "Maxauto/removeWashListDealer/" +
        customer_id +
        "/" +
        dealer_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static getAllMakeMoto = async () => {
    fetch(Globals.BASE_URL + "Maxauto/getAllMakeMoto")
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static getAllMakeSearch = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getAllMakeSearch")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getAllMakeMotoSearch = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getAllMakeMotoSearch")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static allPlacesList = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/allPlacesList")
        .then((response) => response.json())
        .then((data) => {
          return data.data.region_list;
        });
    } catch (error) {
      return error;
    }
  };

  static allPlacesListCameras = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/allPlacesListCameras")
        .then((response) => response.json())
        .then((data) => {
          return data.data.region_list;
        });
    } catch (error) {
      return error;
    }
  };

  static getModels = async (id: string) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getModels/" + id)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getWashlist = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getWashlist")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getMyVehicles = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getMyVehicles")
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static getMyVehicles2 = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getMyVehicles")
        .then((response) => response.json())
        .then((data: Vehicle) => {
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static getNews = async (page) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/findNews/" + page)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static activateNoti = async (vehicle_id) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/addNotiVehicle/" + vehicle_id)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static desactivateNoti = async (vehicle_id) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/removeNotiVehicle/" + vehicle_id)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getContactList = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getListcontact")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getPrices = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getPrices")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getBanners = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getBanners")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getMyListings = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getListingCustomer")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getMyDocuments = async (customerId) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getMyDocuments/" + customerId)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getDashboardNumber = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getDashboardNumber/")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static deleteDocument = async (id) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/deleteDocument/" + id)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getSessionStripe = async (price) => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/stripeGetsession/" + price)
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getMotoChekDetails = async (rego, fn) => {
    try {
      return fetch(
        Globals.BASE_URL + "Maxauto/callMotochekApi/" + rego + "/" + fn
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static getReportPDF = async (rego: string, customer_id: string) => {
    return fetch(
      Globals.BASE_URL +
        "Maxauto/generateVehicleReport/" +
        rego +
        "/" +
        customer_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static getReportPDFPPSR = async (rego: string, customer_id: string) => {
    return fetch(
      Globals.BASE_URL +
        "Maxauto/generatePPSRReport/" +
        rego +
        "/" +
        customer_id
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
  };

  static getOwnerCheck = async (rego, firstName, lastName, licence, date) => {
    try {
      return fetch(
        Globals.BASE_URL +
          "Maxauto/callOwnerCheck/" +
          rego +
          "/" +
          date +
          "/" +
          licence +
          "/" +
          firstName +
          "/" +
          lastName
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static getWantedList = async (page, region) => {
    console.log(region);
    try {
      return fetch(
        Globals.BASE_URL + "Maxauto/getWantedList/" + page + "/" + region
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  static getCameras = async () => {
    try {
      return fetch(Globals.BASE_URL + "Maxauto/getCamera")
        .then((response) => response.json())
        .then((data) => {
          return data.data;
        });
    } catch (error) {
      return error;
    }
  };

  //Login Silencioso
  static silentLogin = async () => {
    const id_customer = await AsyncStorage.getItem("customer_id");
    const is_token = await AsyncStorage.getItem("is_token");
    const logged = await AsyncStorage.getItem("logged");

    if (logged == "true") {
      fetch(
        Globals.BASE_URL +
          "Maxauto/silentLogin?id_customer=" +
          id_customer +
          "&token_id=" +
          is_token
      )
        .then((response) => response.json())
        .then((data) => {
          if ((data.data = "false")) {
            console.log(
              "************************************************************************** Login silencioso ****************************************************************************************************************"
            );
            console.log(is_token);
            console.log(data);
            console.log(
              "************************************************************************** Login silencioso ****************************************************************************************************************"
            );
          } else {
            //Logged
          }
        });
    } else {
    }
  };

  static cancelNotification = async (id) => {
    await Notifications.cancelScheduledNotificationAsync("w1" + id);
    await Notifications.cancelScheduledNotificationAsync("r1" + id);

    await Notifications.cancelScheduledNotificationAsync("w2" + id);
    await Notifications.cancelScheduledNotificationAsync("r2" + id);

    await Notifications.cancelScheduledNotificationAsync("w3" + id);
    await Notifications.cancelScheduledNotificationAsync("r3" + id);
  };

  static ownerCompany = async (rego: string, companyName: string) => {
    try {
      return fetch(
        Globals.BASE_URL +
          "Maxauto/callOwnerCompany/" +
          rego +
          "/" +
          companyName
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static ownerLicense = async (rego: string, license: string) => {
    try {
      return fetch(
        Globals.BASE_URL + "Maxauto/callOwnerLicence/" + rego + "/" + license
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      return error;
    }
  };

  static ownerName = async (
    rego: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      return fetch(
        Globals.BASE_URL +
          "Maxauto/callOwnerName/" +
          rego +
          "/" +
          firstName +
          "/" +
          lastName
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      return error;
    }
  };
}

// Vehicle subjet ruc no or yes
