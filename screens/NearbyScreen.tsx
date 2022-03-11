import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  AsyncStorage,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ImageBackground,
} from "react-native";

import MaStyles from "../assets/styles/MaStyles";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";

import { RootStackParamList } from "../types";
import Globals from "../constants/Globals";
import { Card } from "native-base";
import maxAuto from "../api/maxAuto";

import LottieView from "lottie-react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { SharedElement } from "react-navigation-shared-element";

import * as Location from "expo-location";
import Carousel, {Pagination} from "react-native-snap-carousel";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const ratio = width / 200;

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [loading, setLoading] = useState(true);

  const [radius, setRadius] = useState("8");
  const [urlCall, setUrlCall] = useState("");
  const [carFlag, setCarFlag] = useState(true);
  const [dealerFlag, setDealerFlag] = useState(false);
  const [salesFlag, setSalesFlag] = useState(false);
  const [checked, idChecked] = useState("8");
  const [isModalVisible, setModalVisible] = useState(false);
  const [customerID, setCustomerId] = useState(0);
  const [page, setPage] = useState(1);
  const [listCar, setListCar] = useState([]);
  const [listDealer, setListDealer] = useState([]);
  const [listSales, setListSales] = useState([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [refresh, setRefresh] = useState(true);

  let exampleItems = [
    {
      title: "Car",
    },
    {
      title: "Motorcycle",
    },
  ];

  useEffect(() => {
    buscaLocation(radius,true);
  }, []);

  const refresh1 = () => {
    setLoading(true);
    setRadius("8");
    idChecked("8");
    buscaLocation(radius);
  };

  const buscaLocation = async (radio: string, isRadius: boolean = false) => {
    setPage(1);
    const id = await AsyncStorage.getItem("customer_id");
    setCustomerId(id);
    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("No tenemos los permisos necesarios!");
    } else {
      if (isRadius) {
        let locationObj;
        getNearbyList(locationObj, radio, isRadius);
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

        if (location != null) {
          getNearbyList(location, radio);
        }
      }
    }
  };

  const loadMore = () => {
    let ind = page + 1;
    console.log("**************************************** Page :" + ind);
    //console.log(ind);
    //console.log(paginate(showingList, 10, ind));
    // let array = paginate(showingList, 10, ind);
    // setListCar(listCar.concat(array));
    setPage(ind);

    // setPage(page + 1)

    let datas = urlCall + "/" + ind;
    console.log(datas);

    fetch(datas)
      .then((response) => response.json())
      .then((data) => {
        data.data.forEach((element) => {
          if (element.vehicles.length > 0) {
            element.vehicles.forEach((element2) => {
              console.log(element2);
              listCar.push(element2);
            });
          }
        });
      });
  };

  const getNearbyList = async (
    location,
    radio: string,
    isRadius: boolean = false
  ) => {
    const latitud = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    let stringUrl = "";

    if (isRadius) {
      stringUrl =
        Globals.BASE_URL +
        "Maxauto/getNearby/" +
        latitud +
        "/" +
        longitude +
        "/" +
        radio;
    } else {
      stringUrl =
        Globals.BASE_URL +
        "Maxauto/getNearby/" +
        location.coords.latitude +
        "/" +
        location.coords.longitude +
        "/" +
        radio;
    }

    console.log(stringUrl);

    setUrlCall(stringUrl);

    fetch(stringUrl)
      .then((response) => response.json())
      .then((data) => {
        //setListCar(data.data);
        let listAgent = [];
        let listDealer = [];
        let listVehicle = [];

        data.data.forEach((element) => {
          if (element.agents.length > 0) {
            element.agents.forEach((element3) => {
              element3.forEach((element4) => {
                //console.log(element4);
                listAgent.push(element4);
              });
            });
          }

          if (element.vehicles.length > 0) {
            element.vehicles.forEach((element2) => {
              listVehicle.push(element2);
            });
          }

          listDealer.push(element.dealership);
        });

        setListDealer(data.data[0].dealership);
        setListSales(listAgent);

        setLoading(false);
        setListCar(listVehicle);
        //setRefresh(!refresh);
      });
  };

  //select car
  const vehicleB = () => {
    if (carFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  //select car
  const dealerB = () => {
    if (dealerFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  //select car
  const salesB = () => {
    if (salesFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  const changeTab = (id: number) => {
    if (id == 1) {
      setCarFlag(true);
      setDealerFlag(false);
      setSalesFlag(false);
    }
    if (id == 2) {
      setCarFlag(false);
      setDealerFlag(true);
      setSalesFlag(false);
    }
    if (id == 3) {
      setCarFlag(false);
      setDealerFlag(false);
      setSalesFlag(true);
    }
  };

  //select car
  const vehicleLayer = () => {
    if (carFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  //select car
  const dealerLayer = () => {
    if (dealerFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  //select car
  const salesLayer = () => {
    if (salesFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  //select car
  const vehicleIcon = () => {
    if (carFlag) {
      return MaStyles.iconN;
    } else {
      return MaStyles.iconNW;
    }
  };

  //select car
  const dealerIcon = () => {
    if (dealerFlag) {
      return MaStyles.iconN;
    } else {
      return MaStyles.iconNW;
    }
  };

  //select car
  const salesIcon = () => {
    if (salesFlag) {
      return MaStyles.iconN;
    } else {
      return MaStyles.iconNW;
    }
  };

  const styleBox = (id: string) => {
    if (checked == id) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  const textStyle = (id: string) => {
    if (checked == id) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
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
    maxAuto.removeWashList(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_added = 0;
    console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  //select motorbike
  const motoButton = () => {
    if (!carFlag) {
      return MaStyles.buttonView;
    } else {
      return MaStyles.buttonViewWhite2;
    }
  };

  //select car
  const motoLayer = () => {
    if (!carFlag) {
      return MaStyles.buttonText;
    } else {
      return MaStyles.buttonTextWhite;
    }
  };

  const getDetails = (id: string) => {
    navigation.navigate("VehicleDetails", {
      carId: id,
    });
    //
  };
  let startAncestor;
  let startNode;

  const searchRadius = (radio: string) => {
    setModalVisible(false);
    idChecked(radio);
    setRadius(radio);
    console.log(radius);
    setLoading(true);
    buscaLocation(radio, true);
  };

  const renderImage = (url) => {
    console.log(url);
    return (
      <CachedImage
        style={{
          width: width / 2 - 5,
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

  const getDetailsDealership = (id: string, distance: string) => {
    navigation.navigate("DealershipDetails", { carId: id, dist: distance });
  };

  let cRef;
  const carouselRef = (ref) => (cRef = ref);

  const getDetailsAgent = (
    id: string,
    dealerIdo: string,
    distance1: string
  ) => {
    navigation.navigate("AgentDetails", {
      agentId: id,
      dealerId: dealerIdo,
      distance: distance1,
    });
  };

  const renderItem = ({item, index}) => {
  
    if (item.title=="Car"){
      return (
          (listCar.length > 0 ? (
            <FlatList
              style={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
              data={listCar}
              
              numColumns={2}
              onEndReached={loadMore}
              extraData={refresh}
              keyExtractor={(item) => item.vehicule_id}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: width / 2 - 4 ,
                    margin: 8,
                    marginStart:0,
                    borderRadius: 5,marginBottom:0,
                    backgroundColor: "white",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => getDetails(item.vehicule_id)}
                  >
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
                    <View style={{ margin: 8, marginBottom: 15 }}>
                   

                      <Text style={MaStyles.titleListingM}>
                        {item.vehicule_year} {item.make_description}{" "}
                        {item.model_desc}
                      </Text>
                      <Grid style={{marginTop:5}}>
                        <Col size={2}>
                          <Text style={MaStyles.subTitleListingM}>
                            ${format(item.vehicule_price)} 
                          </Text>
                        </Col>
                        <Col size={4}>
                          <Text style={MaStyles.smallTitleListingM}>
                            {(item.distance + " km away")}
                          </Text>
                        </Col>
                      </Grid>
                    </View>
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
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <TouchableOpacity style={{width:"100%",marginTop:"20%",paddingHorizontal:15}} onPress={()=>setModalVisible(true)}>
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
            <Text style={MaStyles.lottieTitle}>No Vehicles close you!</Text>
            <Text
            
              style={MaStyles.lottieSub}
            >
              Click here to increase the radius >
            </Text>
          </TouchableOpacity>
          ))
      );
  }else{
    return (
      (listDealer.length > 0 ? (
        <FlatList
          style={{ paddingBottom: 30,paddingHorizontal:15 }}
          showsVerticalScrollIndicator={false}
          extraData={refresh}
          data={listDealer}
          numColumns={2}
          keyExtractor={(item) => item.dealership_id}
          renderItem={({ item, index }) => (
            <Card
              style={{
                width: width / 2 - 18,
                margin: 8,
                borderRadius: 5,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  getDetailsDealership(item.dealership_id, item.distance)
                }
              >
                <View
                  style={{
                    backgroundColor: "#b1c1db",
                    height: 72,
                    borderTopStartRadius: 5,
                    borderTopEndRadius: 5,
                  }}
                ></View>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "#0000",
                  }}
                >
                  <SharedElement id="image">
                    <View
                      style={{
                        elevation: 4,
                        backgroundColor: "white",
                        marginTop: -40,
                        width: 80,
                        height: 80,
                        alignSelf: "center",
                        borderColor: "white",
                        borderWidth: 1,
                        borderRadius: 40,
                      }}
                    >
                      <CachedImage
                        source={{
                          uri: Globals.DEALERSHIP_LOGO + item.img_base64,
                        }}
                        resizeMode="cover"
                        style={{
                          width: 78,
                          height: 78,
                          alignSelf: "center",
                        }}
                      />
                    </View>
                  </SharedElement>
                </View>
                <View
                  style={{
                    margin: 8,
                    marginBottom: 15,
                    alignItems: "center",
                    minHeight: 52,
                    borderBottomEndRadius: 5,
                    borderBottomStartRadius: 5,
                  }}
                >
                  <Text numberOfLines={1} style={MaStyles.TextCardN}>
                    {item.dealership_name}
                  </Text>
                  <Text
                    style={[MaStyles.subTextNearby, { marginTop: 2 }]}
                  >
                    Vehicle Dealership
                  </Text>
                  <Text style={MaStyles.subTextCardN}>
                    <MaterialIcons
                      name="gps-fixed"
                      size={9}
                      color="black"
                    />{" "}
                    {item.distance} Km
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          )}
        />
         ):(  
          <TouchableOpacity style={{width:"100%",marginTop:"20%",paddingHorizontal:15}} onPress={()=>setModalVisible(true)}>
          <LottieView
            autoPlay={true}
            loop={true}
            style={{
              marginTop: 0,
              alignSelf: "center",
              width: width - 150,
              height: width - 150,
            }}
            source={require("../assets/lottie/car.json")}
            // OR find more Lottie files @ https://lottiefiles.com/featured
            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
          />
          <Text style={MaStyles.lottieTitle}>No Dealerships close you!</Text>
          <Text
          
            style={MaStyles.lottieSub}
          >
            Click here to increase the radius >
          </Text>
        </TouchableOpacity>   
        ))
    );
  }
    //Pigments
  };


  return (
    <View style={[MaStyles.container, { marginHorizontal: 0,paddingHorizontal:0,backgroundColor:"white" }]}>
      <Grid>
        <Row style={{ height: 40, width: "100%",paddingHorizontal:20 }}>
          <Col size={10}>
            <Text style={MaStyles.textHeaderScreenM}>Discover Nearby</Text>
          </Col>

          <Col
            size={2}
            onPress={() => setModalVisible(true)}
          style={{alignSelf:"flex-end",marginStart:100}}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: "#e5e6eb",
                borderRadius: 30,
                width: 33,
                height: 33,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="location-pin" size={23} color="black" />
            </TouchableOpacity>
          </Col>

          <Col size={2} onPress={() => refresh1()}    style={{alignSelf:"flex-start",marginStart:5}}> 
            <TouchableOpacity
              onPress={() => refresh1()}
              style={{
                backgroundColor: "#e5e6eb",
                borderRadius: 30,
                width: 33,
                height: 33,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <FontAwesome name="refresh" size={20} color="black" />
            </TouchableOpacity>
          </Col>

        </Row>

        
        <Row style={{ marginTop: -5,paddingHorizontal:15 }} size={2}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
          >
            <TouchableOpacity onPress={() =>{cRef.snapToItem(0);}} style={vehicleB()}>
              <Text style={vehicleLayer()}>Vehicles</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() =>{cRef.snapToItem(1);}} style={dealerB()}>
              <Text style={dealerLayer()}>Dealerships</Text>
            </TouchableOpacity>

       {/*      <TouchableOpacity onPress={() => changeTab(3)} style={salesB()}>
              <Text style={salesLayer()}>Consultants</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </Row>

        {!loading && (
          <Row style={{ marginBottom: 40 }} size={15}>

          <Carousel
          activeSlideOffset={0}
                    ref={carouselRef}
                    layout={'default'}
                      data={exampleItems}
                      renderItem={renderItem}
                      containerCustomStyle={{marginTop: 0}}
                      sliderWidth={width}
                      itemWidth={width}
                      onSnapToItem={(index: number) =>{if(index===0){changeTab(1)}else{changeTab(2)}}}
                    // scrollInterpolator={scrollInterpolators.scrollInterpolator2}
                      //slideInterpolatedStyle={animatedStyles.animatedStyles2}
                  
                    />

{/*             {carFlag &&
              (listCar.length > 0 ? (
                <FlatList
                  style={{ paddingBottom: 30 }}
                  showsVerticalScrollIndicator={false}
                  data={listCar}
                  
                  numColumns={2}
                  onEndReached={loadMore}
                  extraData={refresh}
                  keyExtractor={(item) => item.vehicule_id}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: width / 2 - 4 ,
                        margin: 8,
                        marginStart:0,
                        borderRadius: 5,marginBottom:0,
                        backgroundColor: "white",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => getDetails(item.vehicule_id)}
                      >
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
                        <View style={{ margin: 8, marginBottom: 15 }}>
                       

                          <Text style={MaStyles.titleListingM}>
                            {item.vehicule_year} {item.make_description}{" "}
                            {item.model_desc}
                          </Text>
                          <Grid style={{marginTop:5}}>
                            <Col size={2}>
                              <Text style={MaStyles.subTitleListingM}>
                                ${format(item.vehicule_price)} 
                              </Text>
                            </Col>
                            <Col size={4}>
                              <Text style={MaStyles.smallTitleListingM}>
                                {(item.distance + " km away")}
                              </Text>
                            </Col>
                          </Grid>
                        </View>
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
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <TouchableOpacity style={{width:"100%",marginTop:"20%",paddingHorizontal:15}} onPress={()=>setModalVisible(true)}>
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
                <Text style={MaStyles.lottieTitle}>No Vehicles close you!</Text>
                <Text
                
                  style={MaStyles.lottieSub}
                >
                  Click here to increase the radius >
                </Text>
              </TouchableOpacity>
              ))}

            {dealerFlag && (
               (listDealer.length > 0 ? (
              <FlatList
                style={{ paddingBottom: 30,paddingHorizontal:15 }}
                showsVerticalScrollIndicator={false}
                extraData={refresh}
                data={listDealer}
                numColumns={2}
                keyExtractor={(item) => item.dealership_id}
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      width: width / 2 - 18,
                      margin: 8,
                      borderRadius: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        getDetailsDealership(item.dealership_id, item.distance)
                      }
                    >
                      <View
                        style={{
                          backgroundColor: "#b1c1db",
                          height: 72,
                          borderTopStartRadius: 5,
                          borderTopEndRadius: 5,
                        }}
                      ></View>
                      <View
                        style={{
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          backgroundColor: "#0000",
                        }}
                      >
                        <SharedElement id="image">
                          <View
                            style={{
                              elevation: 4,
                              backgroundColor: "white",
                              marginTop: -40,
                              width: 80,
                              height: 80,
                              alignSelf: "center",
                              borderColor: "white",
                              borderWidth: 1,
                              borderRadius: 40,
                            }}
                          >
                            <CachedImage
                              source={{
                                uri: Globals.DEALERSHIP_LOGO + item.img_base64,
                              }}
                              resizeMode="cover"
                              style={{
                                width: 78,
                                height: 78,
                                alignSelf: "center",
                              }}
                            />
                          </View>
                        </SharedElement>
                      </View>
                      <View
                        style={{
                          margin: 8,
                          marginBottom: 15,
                          alignItems: "center",
                          minHeight: 52,
                          borderBottomEndRadius: 5,
                          borderBottomStartRadius: 5,
                        }}
                      >
                        <Text numberOfLines={1} style={MaStyles.TextCardN}>
                          {item.dealership_name}
                        </Text>
                        <Text
                          style={[MaStyles.subTextNearby, { marginTop: 2 }]}
                        >
                          Vehicle Dealership
                        </Text>
                        <Text style={MaStyles.subTextCardN}>
                          <MaterialIcons
                            name="gps-fixed"
                            size={9}
                            color="black"
                          />{" "}
                          {item.distance} Km
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )}
              />
               ):(  
                <TouchableOpacity style={{width:"100%",marginTop:"20%",paddingHorizontal:15}} onPress={()=>setModalVisible(true)}>
                <LottieView
                  autoPlay={true}
                  loop={true}
                  style={{
                    marginTop: 0,
                    alignSelf: "center",
                    width: width - 150,
                    height: width - 150,
                  }}
                  source={require("../assets/lottie/car.json")}
                  // OR find more Lottie files @ https://lottiefiles.com/featured
                  // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                />
                <Text style={MaStyles.lottieTitle}>No Dealerships close you!</Text>
                <Text
                
                  style={MaStyles.lottieSub}
                >
                  Click here to increase the radius >
                </Text>
              </TouchableOpacity>   
              )))}

            {salesFlag && (
              <FlatList
                style={{ paddingBottom: 30 ,paddingHorizontal:15}}
                showsVerticalScrollIndicator={false}
                extraData={refresh}
                data={listSales}
                numColumns={2}
                keyExtractor={(item) => item.id_consultant}
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      width: width / 2 - 18,
                      margin: 8,
                      borderRadius: 5,
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => getDetails(item.vehicule_id)}
                      onPress={() =>
                        getDetailsAgent(
                          item.id_consultant,
                          item.fk_dealership_id,
                          item.distance.replace("000", ".") + "KM"
                        )
                      }
                    >
                      <View
                        style={{
                          backgroundColor: "#b1c1db",
                          height: 62,
                          borderTopStartRadius: 5,
                          borderTopEndRadius: 5,
                        }}
                      ></View>
                      {item.base64_img != "" && (
                        <View
                          style={{
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            backgroundColor: "#0000",
                            elevation: 5,
                          }}
                        >
                          <CachedImage
                            source={{
                              uri: Globals.DEALERSHIP_LOGO + item.base64_img,
                            }}
                            resizeMode="cover"
                            style={{
                              width: 92,
                              height: 92,
                              marginTop: -48,
                              alignSelf: "center",
                              borderColor: "white",
                              borderWidth: 1,
                              borderRadius: 92,
                            }}
                          />
                        </View>
                      )}

                      {item.base64_img == "" && (
                        <View
                          style={{
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            backgroundColor: "#0000",
                            elevation: 5,
                          }}
                        >
                          <Image
                            source={require("../assets/images/placeholderuser.png")}
                            resizeMode="cover"
                            style={{
                              width: 92,
                              height: 92,
                              marginTop: -48,
                              alignSelf: "center",
                              borderColor: "white",
                              borderWidth: 1,
                              borderRadius: 92,
                            }}
                          />
                        </View>
                      )}

                      <View
                        style={{
                          margin: 6,
                          marginTop: 12,
                          marginBottom: 25,
                          alignItems: "center",
                          height: 52,
                        }}
                      >
                        <Text numberOfLines={1} style={MaStyles.TextCardN}>
                          {item.consultant_first_name}{" "}
                          {item.consultant_last_name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[
                            MaStyles.subTextNearby,
                            {
                              marginTop: 2,
                              textAlign: "center",
                              paddingHorizontal: 7,
                            },
                          ]}
                        >
                          {item.sales_consultant_title} at {item.dealername}{" "}
                        </Text>
                        <Text style={MaStyles.subTextCardN}>
                          <MaterialIcons
                            name="gps-fixed"
                            size={9}
                            color="gray"
                          />{" "}
                          {item.distance.replace("000", ".")} Km
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
                              uri:
                                Globals.DEALERSHIP_LOGO + item.rec_img_base64,
                            }}
                            resizeMode="stretch"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Card>
                )}
              />
            )} */}
          </Row>
        )}

        {loading && (
          <Row size={15}>
            <View>
              <LottieView
                autoPlay={true}
                loop={true}
                style={{
                  marginTop: 30,
                  width: width - 40,
                  height: width - 40,
                }}
                source={require("../assets/lottie/radar.json")}
                // OR find more Lottie files @ https://lottiefiles.com/featured
                // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
              />
            </View>
          </Row>
        )}
      </Grid>

      <Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.containerPopup,
          {
            maxHeight: 270,
            marginTop: height - 270,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",paddingBottom:10
          },
        ]}
      >
        <Grid style={{ width: "100%" }}>
          <Row style={{ marginTop: 0, marginStart: 10, height: 25 }}>
            <Text style={MaStyles.textHeaderModalM}>Select distance away</Text>
          </Row>

          <Row style={{ marginTop: 0, height: 60,width:"100%" }}>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
          >
          <TouchableOpacity
                onPress={() => searchRadius("5")}
                style={styleBox("5")}
              >
                <Text onPress={() => searchRadius("5")} style={textStyle("5")}>
                 {" "} 5km  {" "}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => searchRadius("8")}
                style={styleBox("8")}
              >
                <Text onPress={() => searchRadius("8")} style={textStyle("8")}>
                {" "} 8km {" "}
                </Text>
              </TouchableOpacity>

  

            <TouchableOpacity
                onPress={() => searchRadius("15")}
                style={styleBox("15")}
              >
                <Text
                  onPress={() => searchRadius("15")}
                  style={textStyle("15")}
                >
                   {" "} 15km {" "}
                </Text>
              </TouchableOpacity>

          </ScrollView> 
         </Row>
         <Row>
         <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
          >
          <TouchableOpacity
                onPress={() => searchRadius("20")}
                style={styleBox("20")}
              >
                <Text onPress={() => searchRadius("20")} style={textStyle("20")}>
                {" "}   20km   {" "}
                </Text>
              </TouchableOpacity>


          </ScrollView>

         </Row>
          <Row>
          <TouchableOpacity
 onPress={() =>{ }}
  style={{ flex: 1, paddingHorizontal: 20 }}
>

<ImageBackground
             source={require('../assets/images/gradiantbg.png')}  
           style={{width:"100%",height:50, alignItems: "center",}} imageStyle={{borderRadius:200}}
              >
                <Text style={[MaStyles.buttonTextM]}>Apply</Text>
              </ImageBackground>

</TouchableOpacity>
          </Row>
        </Grid>
      </Modal>
    </View>
  );
}
