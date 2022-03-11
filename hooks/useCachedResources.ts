import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from "expo-location";
import * as React from 'react';
import { AsyncStorage,Platform } from 'react-native';
import Globals from '../constants/Globals';
import { StripeProvider } from '@stripe/stripe-react-native';
import maxAuto from '../api/maxAuto';
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  //Login Silencioso

  const getAppConfig = async () =>{
    maxAuto.getPrices().then(async (result) => {
      //////console.log(result);

      await AsyncStorage.setItem(
        "priceCar",
        result[0].price_car
      );

      await AsyncStorage.setItem(
        "priceMoto",
        result[0].price_moto
      );

      await AsyncStorage.setItem(
        "priceCarDisc",
        result[0].price_discount_car
      );

      await AsyncStorage.setItem(
        "priceMotoDisc",
        result[0].price_discount_moto
      );


    });
    
  }



  const silentLogin = async () => {

    //triggerLocalNotificationHandler();

    Permissions.getAsync(Permissions.NOTIFICATIONS)
    .then(statusObj => {
      // Check if we already have permission
      if (statusObj.status !== "granted") {
        // If permission is not there, ask for the same
        return Permissions.askAsync(Permissions.NOTIFICATIONS)
      }
      return statusObj
    })
    .then(statusObj => {
      // If permission is still not given throw error
      if (statusObj.status !== "granted") {
        throw new Error("Permission not granted")
      }
    })
    .catch(err => {
      return null
    })

    const id_customer = await AsyncStorage.getItem('customer_id');
    const is_token = await AsyncStorage.getItem('is_token');
    const logged = await AsyncStorage.getItem('logged');

    if (logged == "true") {
      fetch(Globals.BASE_URL + "Maxauto/silentLogin?id_customer=" + id_customer + "&token_id=" + is_token)
        .then(response => response.json())
        .then(data => {
          if (data.data = "false") {
            
          } else {
            //Logged
          }
        });
    } else {

    }

    //get Location and save to nearby
    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
    } else {
      let location = await Location.getCurrentPositionAsync({
          accuracy:
            Platform.OS == "android"
              ? Location.Accuracy.Lowest
              : Location.Accuracy.Lowest,
        });

        await AsyncStorage.setItem(
          "latitude",
          location.coords.latitude.toString()
        );
        await AsyncStorage.setItem(
          "longitude",
          location.coords.longitude.toString()
        );

        //////console.log("obteniendo location")
        //////console.log(location);

      }

      maxAuto.getMyVehicles().then(async (result) => {
        //////console.log(result.data);
        if(result.data.data == false){
          
          await AsyncStorage.setItem(
            "hasVehicle",
            "false"
          );
    
        }else{
          await AsyncStorage.setItem(
            "hasVehicle",
            "true"
          );


          //////console.log(result.data);
          await AsyncStorage.setItem('myVehicles', JSON.stringify(result.data));    
        }
      });
    }


  

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        silentLogin();
        getAppConfig();
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/AirbnbCerealBook.ttf'),
          'cereal_black': require('../assets/fonts/cereal/AirbnbCerealBlack.ttf'),
          'cereal_bold': require('../assets/fonts/cereal/AirbnbCerealBold.ttf'),
          'cereal_regular': require('../assets/fonts/cereal/AirbnbCerealBook.ttf'),
          'cereal_extrabold': require('../assets/fonts/cereal/AirbnbCerealExtraBold.ttf'),
          'cereal_light': require('../assets/fonts/cereal/AirbnbCerealLight.ttf'),
          'cereal_medium': require('../assets/fonts/cereal/AirbnbCerealMedium.ttf'),

        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        //console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
