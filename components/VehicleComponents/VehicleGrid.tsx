import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import CachedImage from "react-native-expo-cached-image";
import maxAuto from "../../api/maxAuto";
import MaStyles from "../../assets/styles/MaStyles";
import Globals from "../../constants/Globals";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const VehicleGrid = (props: any) => {
  const [item, setVehicleDesc] = useState(props.vehicleDesc);
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(props.opacity);
  const [scale, setScale] = useState(props.scale);
  const [customerID, setCustomerId] = useState(null);
  

  useEffect(() => {
    constructor(props);
  }, [props]);


  const constructor  = (props) =>{
    const idCustomer = await AsyncStorage.getItem('customer_id');
    setCustomerId(idCustomer);
  }

  const getDetails = (id: string) => {
    navigation.navigate("CarDetails", { carId: id });
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const addVeh = (item: string, index) => {
    maxAuto.addWashList(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_added = 1;
    console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
    //maxAuto.addWashList(customerID, id)
  };

  const reVeh = (item: string, index) => {
    console.log(item.vehicule_id + " - " + customerID);
    maxAuto.removeWashList(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_added = 0;
    //console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
  };

  return (
    <View
      style={{
        width: width / 2 - 20,
        margin: 8,
        borderRadius: 5,
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity onPress={() => getDetails(item.vehicule_id)}>
        {item.is_added == 0 && (
          <TouchableOpacity
            onPress={() => addVeh(item, index)}
            style={{
              position: "absolute",
              zIndex: 2,
              right: 0,
              backgroundColor: "#0000008a",
              borderRadius: 40,
              height: 30,
              width: 30,
              margin: 5,
            }}
          >
            <AntDesign
              name="staro"
              size={20}
              color="white"
              style={{ textAlign: "center", marginTop: 5 }}
            />
          </TouchableOpacity>
        )}

        {item.is_added == 1 && (
          <TouchableOpacity
            onPress={() => reVeh(item, index)}
            style={{
              position: "absolute",
              zIndex: 2,
              right: 0,
              backgroundColor: "#0000008a",
              borderRadius: 40,
              height: 30,
              width: 30,
              margin: 5,
            }}
          >
            <AntDesign
              name="star"
              size={18}
              color="#ffbf00"
              style={{ textAlign: "center", marginTop: 5 }}
            />
          </TouchableOpacity>
        )}

        <CachedImage
          source={{ uri: Globals.S3_THUMB_URL + item.pic_url }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 100,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
        <View style={{ margin: 8, marginBottom: 15 }}>
          <Grid>
            <Col>
              <Text style={MaStyles.subTextCardVehicle}>
                ${format(item.vehicule_price)}
              </Text>
            </Col>
            <Col></Col>
          </Grid>

          <Text style={MaStyles.TextCardVehicle}>
            {item.vehicule_year} {item.make_description} {item.model_desc}
          </Text>
        </View>
        {item.rec_img_base64 != "" && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              borderBottomEndRadius: 5,
              borderBottomStartRadius: 5,
            }}
          >
            <Image
              style={{
                width: width / 2 - 20,
                height: 50,
                zIndex: 20000,
                borderBottomEndRadius: 5,
                borderBottomStartRadius: 5,
              }}
              source={{
                uri: Globals.DEALERSHIP_LOGO + item.rec_img_base64,
              }}
              resizeMode="stretch"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VehicleGrid;
