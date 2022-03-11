import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TextAnimator from "../../utils/TextAnimator";
import {StackScreenProps} from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Animated,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
} from "react-native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import {Col, Grid, Row} from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import {ModalSelectList} from "react-native-modal-select-list";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import {Card} from "react-native-shadow-cards";
import {RootStackParamList} from "../../types";
import {useEffect, useState} from "react";
import Globals from "../../constants/Globals";
import VehicleListGrid from "../../components/VehicleComponents/VehicleListGrid";
import maxAuto from "../../api/maxAuto";
import {findDaysDiffrent} from "../../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../components/CustomMarker";
import {SliderBox} from "react-native-image-slider-box";
import {SharedElement} from "react-navigation-shared-element";
import MapView from "react-native-map-clustering";
import {AnimatedRegion, Marker} from "react-native-maps";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function EvChargerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [listEVCharger, setListEvCharger] = useState([]);
  const [listRegion, setRegionList] = useState([]);
  const [nameCh, setNameCh] = useState("");
  const [latCh, setLatCh] = useState("");
  const [longCh, setLongCh] = useState("");
  const [conectorCh, setconectorCh] = useState("");
  const [priceCh, setPriceCh] = useState("");
  const [statusCh, setStatusCh] = useState("");
  const [statusColor, setStatusColor] = useState("gray");

  const [kw, setKw] = useState("");
  const [lat, setLat] = useState(0.0);
  const [lon, setLong] = useState(0.0);

  const [widthMap, setWidthMap] = useState("100%");

  const [connectors1, setConnectors1] = useState("");
  const [connectors2, setConnectors2] = useState("");

  useEffect(() => {
    setupPage();
  }, []);

  // Modal con filtro
  let modalRef;

  const openModal = () => {
    modalRef.show();
  };

  const saveModalRef = (ref) => (modalRef = ref);
  const onSelectedOption = (value) => {
    let res = value.split("|");
  };

  const setupPage = async () => {
    const latitud = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    setLat(parseFloat(latitud));
    setLong(parseFloat(longitude));

    const listtmp = [];
    for (let index = 1; index < 8; index++) {
      //8
      fetch(
        "https://evroam.azure-api.net/consumer/api/ChargingStation?resultPage=" +
          index,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "91f3fe76819f4e80a1adc767f9379c12",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          data.chargingStations.forEach((element) => {
            if (
              element.installationStatus == "Commissioned" &&
              !element.providerDeleted
            ) {
              listtmp.push(element);
            }
            if (element.location.lat == "-36.7466454") {
              console.log(element);
            }

            if (index == 7) {
              setLoading(false);
              setListEvCharger(listtmp);
            }
          });
        });
    }
  };

  const openModalContact = (targetId, lat, lon) => {
    let evObj = listEVCharger[targetId];
    console.log(evObj);
    let connectStr = "";

    evObj.connectors.forEach((element, index) => {
      connectStr =
        element.connectorType;

      if (index == 0) {
        setConnectors1(connectStr);
      }

      if (index == 1) {
        setConnectors2(connectStr);
      }
    });

    if (evObj.hasChargingCost) {
      setPriceCh("Charging costs apply");
    } else {
      setPriceCh("No charging cost");
    }

    if(evObj.availabilityStatus =="Available"){
setStatusColor("green");
    } if(evObj.availabilityStatus =="Occupied"){
      setStatusColor("blue");
    }
    if(evObj.availabilityStatus =="Unknown"){
      setStatusColor("gray");
    }

    setKw(evObj.kwRated + " kW");
    setStatusCh(evObj.availabilityStatus);
    setNameCh(evObj.operator);
    setLat(lat);
    setLong(lon);
    setModalVisible(true);
    setWidthMap("70%");
  };

  function getSMSDivider(): string {
    return Platform.OS === "ios" ? "&" : "?";
  }

  const createStaticModalOptions = () => {
    const options = [];
    for (let i = 1; i < listRegion.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listRegion[i].region_name,
        value: listRegion[i].region_id + "|" + listRegion[i].region_name,
      });
    }
    return options;
  };

  const modalOptionsProvider = ({page, pageSize, customFilterKey}) => {
    let options = [];
    for (let i = 0; i < listRegion.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listRegion[i].region_name,
        value: listRegion[i].region_id + "|" + listRegion[i].region_name,
      });
    }
    //console.log(customFilterKey);
    if (!!customFilterKey) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions = createStaticModalOptions();

  const getDirections = () => {
    var scheme = Platform.OS === "ios" ? "maps:0,0?q=" : "geo:0,0?q=";
    var url = scheme + `${lat},${lon}`;
    Linking.openURL(url);
  };

  let total = 0; // 658 false= 221 true 437
  const renderMarker = (marker, index) => {
    if (marker.availabilityStatus == "Available") {
      return (
        <Marker
          key={index}
          onPress={() =>
            openModalContact(index, marker.location.lat, marker.location.lon)
          }
          coordinate={{
            latitude: marker.location.lat,
            longitude: marker.location.lon,
          }}
          /*  title={marker.operator}
          description={"Status: " + marker.availabilityStatus} */
        >
          <View
            style={{borderColor: "white", borderWidth: 2, borderRadius: 25}}
          >
            <Image
              source={require("../../assets/images/icons/free.png")}
              style={{
                width: 50,
                height: 50,
              }}
              resizeMode="contain"
            />
          </View>
        </Marker>
      );
    }

    if (marker.availabilityStatus == "Occupied") {
      return (
        <Marker
          key={index}
          onPress={() =>
            openModalContact(index, marker.location.lat, marker.location.lon)
          }
          coordinate={{
            latitude: marker.location.lat,
            longitude: marker.location.lon,
          }}
          /*  title={marker.operator}
          description={"Status: " + marker.availabilityStatus} */
        >
          <View
            style={{borderColor: "white", borderWidth: 2, borderRadius: 25}}
          >
            <Image
              source={require("../../assets/images/icons/used.png")}
              style={{
                width: 50,
                height: 50,
              }}
              resizeMode="contain"
            />
          </View>
        </Marker>
      );
    }

    if (marker.availabilityStatus == "Unknown") {
      return (
        <Marker
          key={index}
          onPress={() =>
            openModalContact(index, marker.location.lat, marker.location.lon)
          }
          coordinate={{
            latitude: marker.location.lat,
            longitude: marker.location.lon,
          }}
          /*  title={marker.operator}
          description={"Status: " + marker.availabilityStatus} */
        >
          <View
            style={{borderColor: "white", borderWidth: 2, borderRadius: 25}}
          >
            <Image
              source={require("../../assets/images/icons/unknown.png")}
              style={{
                width: 50,
                height: 50,
              }}
              resizeMode="contain"
            />
          </View>
        </Marker>
      );
    }
  };

  return (
    <View
      style={[
        MaStyles.container2,
        {marginHorizontal: 0, paddingHorizontal: 0, backgroundColor: "white"},
      ]}
    >
      <Grid>
        <Row style={{paddingHorizontal: 10, height: 40}}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{marginTop: 5}}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={10}>
              <Text style={MaStyles.textHeaderScreenM}>EV Charger Stations</Text>
            </Col>
          </Grid>
        </Row>
        <Row size={14}>
          {!isLoading ? (
            <MapView
              clusterColor={"#0e4e95"}
              followsUserLocation={false}
              showsUserLocation={true}
              initialRegion={{
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={{width: "100%", height: widthMap,marginTop:20}}
            >
              {listEVCharger.map((marker, index) =>
                renderMarker(marker, index)
              )}
            </MapView>
          ) : (
            <Image
              style={{
                width: "80%",
                height: 300,
                alignSelf: "center",
                marginTop: "-60%",
                marginStart: "10%",
                alignContent: "center",
              }}
              source={require("../../assets/lottie/charging2.gif")}
            />
          )}
        </Row>
      </Grid>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0}
        coverScreen={false}
        hasBackdrop={false}
        deviceHeight={height}
        onModalWillHide={() => setWidthMap("100%")}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
           
            backgroundColor: "white",
           
            marginHorizontal: 0,
            paddingHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
            ...Platform.select({
              ios:{
                maxHeight: 350,
                marginTop: height - 350,
              },
              android:{
                maxHeight: 300,
                marginTop: height - 300,
              }
            })
          },
        ]}
      >
        <Grid style={{width: "100%"}}>
          {nameCh == "ChargeNet NZ" && (
            <Image
              style={{
                width: "100%",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                maxHeight: 91,
              }}
              source={require("../../assets/images/chargenet.png")}
            ></Image>
          )}
          {nameCh == "Vector" && (
            <Image
              style={{
                width: "100%",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                maxHeight: 91,
              }}
              source={require("../../assets/images/vector.png")}
            ></Image>
          )}

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: "absolute",
              zIndex: 2,
              right: 0,
              backgroundColor: "#0000008a",
              borderRadius: 40,
              height: 30,
              width: 30,
              margin: 5,
              marginEnd: 15,
            }}
          >
            <AntDesign
              style={{
                marginTop: 4,
                position: "absolute",
                right: 0,
                marginEnd: 4,
              }}
              name="close"
              size={22}
              color="white"
            />
          </TouchableOpacity>

          <Grid
            style={{
              marginTop: 110,
              position: "absolute",
              paddingHorizontal: 15,
              width: "100%",
              minHeight: 300,
            }}
          >
            <Row style={{height: 25}}>
              <Col>
                <Text style={[MaStyles.TextCardListView, {fontSize: 20}]}>
                  {nameCh}
                </Text>
              </Col>
              <Col>
                <Text
                  style={[
                    MaStyles.menuTitleBox,
                    {
                      fontSize: 15,
                      marginTop: 5,
                      textAlign: "right",
                      width: "100%",
                      height: 20,
                      color:statusColor
                    },
                  ]}
                >
                  Status: {statusCh}
                </Text>
              </Col>
            </Row>

            <Row style={{height: 0.4}}>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "gray",
                  height: 0.4,
                  marginTop: 8,
                }}
              ></View>
            </Row>

            <Row style={{marginTop: 10, height: 15}}>
              <View style={{width:"100%"}}>
                {connectors1 != "" && (
                  <Row style={{height: 33, marginTop: 0}}>
                    <Text   
                      style={[MaStyles.menuTitleBox, {marginTop: 10}]}
                    >
                      <FontAwesome name="plug" size={12} color="black" />{" "}
                      {connectors1}
                    </Text>
                  </Row>
                )}
                {connectors2 != "" && (
                  <Row style={{height: 15, marginTop: 10}}>
                    <Text
                      numberOfLines={1}
                      style={[MaStyles.menuTitleBox, {marginTop: -10}]}
                    >
                      <FontAwesome name="plug" size={12} color="black" />{" "}
                      {connectors2}
                    </Text>
                  </Row>
                )}
                <Row style={{height: 16, marginTop: 0}}>
                  <Text
                    style={[
                      MaStyles.menuTitleBox,
                      {marginTop: 0, marginStart: 2},
                    ]}
                  >
                    <FontAwesome5 name="dollar-sign" size={12} color="black" />
                    {"  "}
                    {priceCh}
                  </Text>
                </Row>
                <Row style={{marginTop: 10, height: 12}}>
                  <Image
                    style={{width: 13, height: 13}}
                    source={require("../../assets/images/icons/flash.png")}
                  />
                  <Text
                    style={[
                      MaStyles.menuTitleBox,
                      {marginTop: -3, marginStart: 2},
                    ]}
                  >
                    {kw}
                  </Text>
                </Row>
              </View>
            </Row>

          </Grid> 
        </Grid>
        <Row style={{marginHorizontal:15}}>
              <TouchableOpacity
                onPress={() => getDirections()}
                
                style={{
                  zIndex: 2,
                  bottom: 0,
                  position: "absolute",
                  backgroundColor: "#0e4e92",
                  borderRadius: 40,
                  height: 45,
                  width: "100%",
                  margin: 5,
                  alignContent: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  ...Platform.select({
                    ios:{
                      marginBottom:40
                    },
                    android:{
                      marginBottom:-5
                    }
                  })
                 }
                }
              >
                <Text
                  style={[
                    MaStyles.menuTitleBox,
                    {
                      fontSize: 15,
                      marginTop: 0,
                      color: "white",
                      width: "100%",
                      textAlign: "center",
                      height: 30
                    },
                  ]}
                >
                  <FontAwesome5
                    style={{
                      marginTop: 10,
                      right: 0,
                    }}
                    name="directions"
                    size={24}
                    color="white"
                  />
                  {"   "} Get Directions
                </Text>
              </TouchableOpacity>
            </Row>
         
      </Modal>

      <Modal
        deviceHeight={height}
        animationIn={"zoomInDown"}
        animationOut={"zoomOutUp"}
        isVisible={isLoading}
        style={[
          MaStyles.container,
          {
            marginTop: 0,
            maxHeight: height,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 0,
            borderTopEndRadius: 0,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0e4e92",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextAnimator
            content="🔍 Searching Ev stations around you...️️️"
            duration={1000}
            textStyle={MaStyles.textHeaderLoading}
          />
          <Image
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
              marginTop: -30,
            }}
            source={require("../../assets/lottie/charging.gif")}
          />
        </View>
      </Modal>
    </View>
  );
}
