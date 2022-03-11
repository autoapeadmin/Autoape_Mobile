import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Modal from "react-native-modal";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions
} from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { BaseButton, ScrollView } from "react-native-gesture-handler";
import MaStyles from "../assets/styles/MaStyles";
import Globals from "../constants/Globals";
import CachedImage from "react-native-expo-cached-image";

import { RootStackParamList } from "../types";

import { Card } from "react-native-shadow-cards";
import maxAuto from "../api/maxAuto";
import { findDaysDiffrent } from "../utils/DateFunctions";
import { SharedElement } from "react-navigation-shared-element";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [listCar, setListCar] = useState([]);
  const [customerID, setCustomerId] = useState(null);
  const [logg, setLogg] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isModalVisible, setModal] = useState(true);
  

  useEffect(() => {
    getCar();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getCar();
    }, [])
  );

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const getCar = async () => {

    const logged = await AsyncStorage.getItem('logged');
    const idCustomer = await AsyncStorage.getItem('customer_id');
    setCustomerId(idCustomer);
    console.log(logged);
    setLogg(logged);
    if(logged == "false"){

    }else{
      maxAuto.getWashlist().then((result) => setListCar(result));
    }
        
  };

  const renderImage = (url) => {
    console.log(url);
    return (
      <CachedImage
        style={{
          width: width / 2 - 30,
          height: 50,
          zIndex: 20000,
          borderBottomEndRadius: 5,
          borderBottomStartRadius: 5,
        }}
        source={{
          uri: Globals.DEALERSHIP_LOGO + url,
        }}
        resizeMode="stretch"
      />
    );
  };


  const openSearch = async (flag: string) => {
    //console.log("flag");
    await AsyncStorage.setItem("flag", flag);
    navigation.navigate("Search");
  };

  const getDetails = (id: string) => {
    navigation.navigate("VehicleDetails", {
      carId: id,
    });
    //
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
    console.log(item.vehicule_id + ' - ' + customerID);
    maxAuto.removeWashList(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_added = 0;
    //console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
  };

  return (
    // <View style={MaStyles.containerFullScreen}>
    <ScrollView>


<Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={false}
        style={[
          MaStyles.container,
          {
            marginTop:-20,
            maxHeight: height + 20,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >

      </Modal>

      <Image
        style={{ width: "100%", height: 280 }}
        source={require("../assets/images/bghome.jpg")}
      />

      <Row
        style={{
          marginHorizontal: 20,
          height: 30,
          transform: [
            {
              translateY: -220,
            },
          ],
        }}
      >
        <Col>
          <Image
            style={{
              width: 180,
              height: 50,
            }}
            source={require("../assets/images/logo.png")}
          />
        </Col>
        <Col>
          <Feather
            name="bell"
            size={24}
            color="white"
            style={{ alignSelf: "flex-end", marginTop: 5 }}
          />
        </Col>
      </Row>

      <Row
        style={{
          height: 10,
          transform: [
            {
              translateY: -77,
            },
          ],
          zIndex: 1000,
        }}
      >
        <Col style={{ marginHorizontal: 15 }}>
          <BaseButton
            style={MaStyles.buttonViewHomeScreen}
            onPress={() => openSearch("0")}
          >
            <Text style={MaStyles.buttonTextHome}>
              <AntDesign
                size={15}
                style={{ alignSelf: "center" }}
                name="search1"
                color="white"
              /> 
              {"  "} Vehicle Search
            </Text>
          </BaseButton>
        </Col>
      </Row>

{logg=="false" &&
      <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
      <LottieView
        autoPlay={true}
        loop={true}
        style={{
          marginTop: 0,
          alignSelf: "center",
          width: width - 100,
          height: width - 100,
        }}
        source={require("../assets/lottie/car.json")}
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
      />
      <Text style={MaStyles.lottieTitle}>Lorem ipsum</Text>
      <Text
        style={MaStyles.lottieSub}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor >
      </Text>
    </TouchableOpacity>
}
{logg=="true" &&
<View>
<View style={{ marginHorizontal: 20, marginTop: 14 }}>
        <Row>
          <Col>
            <Text style={MaStyles.textHeader}>Watchlist</Text>
          </Col>
          <Col>
            <FontAwesome5
              style={{ marginTop: 9, alignSelf: "flex-end" }}
              name="sort-amount-down"
              size={17}
              color="#0e4e92"
            />
          </Col>
        </Row>
      </View>


{listCar.length != 0 &&
      <FlatList
        ListFooterComponent={<View style={{ margin: 0 }} />}
        style={{ paddingBottom: 30, marginStart: 0, marginTop: 16 }}
        showsVerticalScrollIndicator={false}
        extraData={refresh}
        data={listCar}
        numColumns={2}
        //onEndReached={loadMore}
        //extraData={refresh}
        keyExtractor={(item) => item.pic_url}
        renderItem={({ item, index }) => (
          <View style={{
            width: width / 2 - 4 ,
            margin: 8,
            marginStart:0,
            borderRadius: 5,marginBottom:0,
            backgroundColor: "white" }}>
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
<SharedElement id="vehicleImage">
{item.pic_url ?
 <CachedImage
 source={{ uri: Globals.S3_THUMB_GRID + item.pic_url }}
 resizeMode="cover"
 style={{
   width: "100%",
   height: 140,
   marginTop: 0,
   borderTopLeftRadius: 0,
   borderTopRightRadius: 0,
 }}
/>
:
<Image
source={require('../assets/images/placecar.png') }
resizeMode="cover"
style={{
  width: "100%",
  height: 140,
  marginTop: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
}}
/>
}
              </SharedElement>
              <View style={{ margin: 8, marginBottom: 15 }}>
                
              <Text style={MaStyles.TextCardListView}>
                  {item.vehicule_year} {item.make_description} {item.model_desc}
                </Text>
                
                <Grid>
                  <Col><Text style={MaStyles.subTextCardVehicle}>
                  ${format(item.vehicule_price)}
                </Text></Col>
                  <Col>
                  <Text style={MaStyles.TextCardVehicleDate}>{findDaysDiffrent(item.post_at)}</Text>
                  </Col>
                </Grid>
            
              </View>

{item.is_customer == 1  
?
<View>
  
</View>
:
<View>
{item.rec_img_base64 ? (
                          <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 0,
                              borderBottomEndRadius: 5,
                              borderBottomStartRadius: 5,
                            }}
                          >
                            {renderImage(item.rec_img_base64)}
                           
                          </View>
                        ):
                        <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 0,
                              borderBottomEndRadius: 5,
                              borderBottomStartRadius: 5,
                            }}
                          >
                            <Image
        style={{
          width: width / 2 - 30,
          height: 0,
          zIndex: 20000,
          borderBottomEndRadius: 5,
          borderBottomStartRadius: 5,
        }}
        source={require('../assets/images/placebanner.png') }
        resizeMode="stretch"
      />
                          </View>
                        }
</View>
}
            </TouchableOpacity>
          </View>
       )}
      />
    }

{listCar.length == 0 &&
  <TouchableOpacity onPress={()=> navigation.navigate('Search')}>
      <LottieView
        autoPlay={true}
        loop={true}
        style={{
          marginTop: 0,
          alignSelf: "center",
          width: width - 100,
          height: width - 100,
        }}
        source={require("../assets/lottie/car.json")}
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
      />
      <Text style={MaStyles.lottieTitle}>Watchlist Empty!</Text>
      <Text
      
        style={MaStyles.lottieSub}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor >
      </Text>
    </TouchableOpacity>
}

</View>
 }    
    </ScrollView>
  );
}

//function

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
