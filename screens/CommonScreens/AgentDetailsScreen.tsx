import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  EvilIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import { RootStackParamList } from "../../types";
import { useEffect, useState } from "react";
import Globals from "../../constants/Globals";
import { findDaysDiffrent } from "../../utils/DateFunctions";
import { SliderBox } from "react-native-image-slider-box";
import ImageView from "react-native-image-view";
import { ImageBrowser } from "expo-image-picker-multiple";
import { Button, Card } from "native-base";
import MapView, { Marker } from "react-native-maps";
import maxAuto from "../../api/maxAuto";
import { ModalSelectList } from "react-native-modal-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function AgentDetailsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [customerID, setCustomerId] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [agentDetails, setAgentDetails] = useState([]);
  const [carContact, setCarContact] = useState([]);
  const [carPhotos, setPhotos] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesFull, setImagesFull] = useState([]);
  const [desc, setDesc] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState(true);
  const [localImage, setLocalImage] = useState([]);
  const [multipleUrl, setMultipleUrl] = useState([]);

  const [imageVisible, setImageVisible] = useState(false); //could b
  const [page, setPage] = useState(1);
  const [locationLabel, setLocationLabel] = useState("Location");
  const [urlCall, setUrlCall] = useState("");
  const [subModel, setSubModel] = useState("");
  const [phone, setPhone] = useState("");
  const [odometer, setOdometer] = useState("");
  const [checked, idChecked] = useState("0");
  const [srcImg, setSrcImg] = useState("LOGO-ALL");
  const [name, setName] = useState("All Makes");

  const [loading, setLoading] = useState(true);
  const [viewPhotos, setViewPhotos] = useState(false);

  const [currentPhoto, setCurrentPhotos] = useState(0);

  const [tab, setTab] = useState(0);

  const [listSales, setListSales] = useState([]);
  const [listCar, setListCar] = useState([]);

  const [refresh, setRefresh] = useState(true);

  const [makeL, setMakeL] = useState("Select Make");
  const [isModalVisible2, setModalVisible2] = useState(false);

  const [renderMake, setRenderMake] = useState(true);
  const [textFilter, setTextFilter] = useState("");
  const [listMake, setListMake] = useState([]);
  const [modelId, setModelId] = useState("0");
  const [modelLabel, setModelLabel] = useState("Select Model");
  const [listModel, setListModel] = useState([]);
  const [agentId, setAgentId] = useState("0");
  const [dealerDetails, setDealerDetails] = useState([]);
  const [languageList, setLanguages] = useState([]);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setupPage();
  }, []);

  const filterMakes = (search_text: String) => {
    setTextFilter(search_text);
    setRenderMake(renderMake!);
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
        data.data.vehicles.forEach((element2) => {
          console.log(element2);
          listCar.push(element2);
        });
        //listCar.push(data.data.vehicles);
      });
  };

  const setupPage = async () => {
    const id = await AsyncStorage.getItem("customer_id");
    setCustomerId(id);
    setAgentId(route.params.agentId);
    setUrlCall(
      Globals.BASE_URL +
        "Maxauto/findSalesConsultantById/" +
        route.params.agentId
    );

    fetch(
      Globals.BASE_URL +
        "Maxauto/findSalesConsultantById/" +
        route.params.agentId
    )
      .then((response) => response.json())
      .then((data) => {
        setAgentDetails(data.data.agent[0]);
        setDealerDetails(data.data.details);
        setListSales(data.data.agents);
        setLanguages(data.data.lagent);
        console.log(data.data.lagent);
        setLoading(false);
      });
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const tabS1 = () => {
    if (tab == 0) {
      return MaStyles.tabViewSelectS;
    } else {
      return MaStyles.tabViewS;
    }
  };

  const tabT1 = () => {
    if (tab == 0) {
      return MaStyles.tabTextSelect;
    } else {
      return MaStyles.tabText;
    }
  };

  const tabS2 = () => {
    if (tab == 1) {
      return MaStyles.tabViewSelect;
    } else {
      return MaStyles.tabView;
    }
  };

  const tabT2 = () => {
    if (tab == 1) {
      return MaStyles.tabTextSelect;
    } else {
      return MaStyles.tabText;
    }
  };

  const tabS3 = () => {
    if (tab == 2) {
      return MaStyles.tabViewSelectS;
    } else {
      return MaStyles.tabViewS;
    }
  };

  const tabT3 = () => {
    if (tab == 2) {
      return MaStyles.tabTextSelect;
    } else {
      return MaStyles.tabText;
    }
  };

  const addVeh = (item: string, index) => {
    if (customerID != 0) {
      maxAuto.addWashList(customerID, item.vehicule_id);
      let targetItem = listCar[index];
      targetItem.is_added = 1;
      console.log(targetItem);
      listCar[index] = targetItem;
      setRefresh(!refresh);
      //setListCar(listCar);
      //maxAuto.addWashList(customerID, id)
    }
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

  const openMap = (address: string) => {
    Linking.openURL(
      "https://www.google.com/maps/search/?api=1&query=" + address
    );
  };


  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToright = 20;
    return (
      layoutMeasurement.width + contentOffset.x >=
      contentSize.width - paddingToright
    );
  };


  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      style={{ backgroundColor: "white" }}
    >
      <View>
        {agentDetails.cover_base64_img != "" && (
          <CachedImage
            source={{ uri: agentDetails.cover_base64_img }}
            resizeMode={"cover"}
            style={{ width: "100%", height: 300 }}
          ></CachedImage>
        )}
        {agentDetails.cover_base64_img == "" && (
          <CachedImage
            source={{ uri: Globals.BASE_URL + "assets/img/salesbg.png" }}
            resizeMode={"cover"}
            style={{ width: "100%", height: 300 }}
          ></CachedImage>
        )}
        <View style={{ marginHorizontal: 15 }}>
          <View style={{ marginTop: -66 }}>
            <Row style={{ marginTop: 12 }}>
              <Col size={5}>
                {agentDetails.base64_img != "" && (
                  <CachedImage
                    source={{
                      uri: Globals.DEALERSHIP_LOGO + agentDetails.base64_img,
                    }}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 100,
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 50,
                    }}
                  />
                )}

                {agentDetails.base64_img == "" && (
                  <CachedImage
                    source={{
                      uri: Globals.BASE_URL + "assets/img/salesbg.png",
                    }}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 100,
                      borderColor: "white",
                      borderWidth: 1,
                      borderRadius: 50,
                    }}
                  />
                )}
              </Col>

              <Col
                style={{ marginTop: 5, marginEnd: 40, alignItems: "center" }}
              >
                {dealerDetails.rec_img_base64 != "" && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 0,
                    }}
                  >
                    <Image
                      style={{
                        width: width / 2 - 60,
                        height: 40,
                        zIndex: 20000,
                      }}
                      source={{
                        uri:
                          Globals.DEALERSHIP_LOGO +
                          dealerDetails.rec_img_base64,
                      }}
                      resizeMode="stretch"
                    />
                  </View>
                )}
              </Col>
            </Row>
            <Row style={{marginEnd:2}}>
              <Col size={2}>
                <Text numberOfLines={1} style={MaStyles.textHeaderDealer}>
                  {agentDetails.consultant_first_name}{" "}
                  {agentDetails.consultant_last_name}
                </Text>
                <Text style={MaStyles.subTextDealer}>
                  {agentDetails.sales_consultant_title}
                </Text>
              </Col>
              <Col>
                <Text style={MaStyles.subTextCardDistance}>
                  <MaterialIcons name="gps-fixed" size={11} color="gray" />{" "}
                  {route.params.distance}
                </Text>
              {languageList.map(language => (
                <Row style={{marginTop:13}}>
                  <Col size={1}><Image
                      style={{
                        width: 12,
                        height: 12,
                        alignSelf:"flex-end"
                      }}
                      source={{
                        uri:
                          Globals.BASE_URL + "assets/img/flags/" +  language.language_desc + ".png"
                      }}
                    /></Col>
                  <Col size={1}><Text style={MaStyles.subTextCardL}>{language.language_desc}</Text></Col>
                </Row>
              ))}
              </Col>
            </Row>
          </View>
          <Row style={{ marginTop: 0 }}>
            <Col>
              <Text style={MaStyles.textHeaderDealer2}>
                {agentDetails.consultant_email}
              </Text>
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col style={{ marginEnd: 4 }} size={8}>
              <Button
                onPress={() => setModalVisible(true)}
                style={MaStyles.buttonViewDealer}
              >
                <Text style={MaStyles.buttonTextDealer}>
                <Feather style={{ alignSelf: "flex-end" }} name="phone"  size={13}   color="white" />
                  {"  "}
                  Contact
                </Text>
              </Button>
            </Col>
            <Col style={{ marginHorizontal: 4 }} size={4}>
              <Button style={MaStyles.buttonViewDealerWhite}>
                <Text style={MaStyles.buttonTextDealerWhite}>
                  <AntDesign
                    style={{ alignSelf: "flex-end" }}
                    name="mail"
                    size={15}
                    color="#67686c"
                  />{"  "}
                  Email
                </Text>
              </Button>
            </Col>
          </Row>

          <Row style={{ marginTop: 30, height: 40 }}>
            <Col style={tabS1()}>
              <Text onPress={() => setTab(0)} style={tabT1()}>
                About me
              </Text>
            </Col>
            <Col style={tabS2()}>
              <Text onPress={() => setTab(1)} style={tabT2()}>
                Vehicles
              </Text>
            </Col>
            <Col style={tabS3()}>
              <Text onPress={() => setTab(2)} style={tabT3()}>
                Location
              </Text>
            </Col>
          </Row>
        </View>

        <View
          style={{
            backgroundColor: "white",
            width: width,
            height: 10,
          }}
        ></View>

        {tab == 0 && (
          <View>
  
            <Row style={{ marginTop: 15, marginHorizontal: 15 }}>
          
              <Col>
                <Text style={MaStyles.subTextDealer}>{agentDetails.consultant_description}</Text>
              </Col>
            </Row>
          </View>
        )}

        {tab == 1 && (
          <View>
            <Row style={{ backgroundColor: "white", marginTop: -5 }}>
              <Col style={{ marginHorizontal: 15 }}>
                <Text style={{ marginTop: 10 }}>Vehicles</Text>
                <FlatList
                  style={{ paddingBottom: 30, marginTop: 5 }}
                  showsVerticalScrollIndicator={false}
                  extraData={refresh}
                  data={listCar}
                  onEndReached={loadMore}
                  numColumns={2}
                  keyExtractor={(item) => item.vehicule_id}
                  renderItem={({ item, index }) => (
                    <Card
                      style={{
                        width: width / 2 - 15,
                        margin: 8,
                        borderRadius: 5,
                      }}
                    >
                      <TouchableOpacity
                      // onPress={() => getDetails(item.vehicule_id)}
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
                            <FontAwesome
                              name="bookmark-o"
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
                            <FontAwesome
                              name="bookmark"
                              size={20}
                              color="white"
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
                          <Text style={MaStyles.TextCard}>
                            {item.vehicule_year} {item.make_description}{" "}
                            {item.model_desc}
                          </Text>
                          <Text style={MaStyles.subTextCard}>
                            ${format(item.vehicule_price)}
                          </Text>
                          <Text style={MaStyles.subTextCard}>
                            {item.distance} Km
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Card>
                  )}
                />
              </Col>
            </Row>
          </View>
        )}

        {tab == 2 && (
          <View>
  <Row style={{ marginTop: 15, marginHorizontal: 15,paddingBottom:5 }}>
              <Col size={1}>
              <EvilIcons style={{marginTop:2.5}} name="location" size={16} color="black" />
              </Col>
              <Col size={20}>
                <Text>{dealerDetails.address}</Text>
              </Col>
            </Row>

            <Row
              style={{ backgroundColor: "white", marginTop: -5, zIndex: 1000 }}
            >
              <Col style={{ marginHorizontal: 0 }}>
                <MapView
                  scrollEnabled={false}
                  style={{
                    width: "100%",
                    height: 150,
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                  region={{
                    latitude: dealerDetails.lat
                      ? Number(dealerDetails.lat)
                      : 37,
                    longitude: dealerDetails.long
                      ? Number(dealerDetails.long)
                      : 37,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  onPress={() => {
                    openMap(dealerDetails.address);
                  }}
                >
                  <Marker
                    onPress={() => {
                      openMap(dealerDetails.address);
                    }}
                    coordinate={{
                      latitude: dealerDetails.lat
                        ? Number(dealerDetails.lat)
                        : 37,
                      longitude: dealerDetails.long
                        ? Number(dealerDetails.long)
                        : 37,
                    }}
                  />
                </MapView>
              </Col>
            </Row>

            

          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textPrimary: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "600",
    color: "gray",
  },
  textSecundary: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "400",
    color: "gray",
  },
  textSecundaryDistance: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "400",
    color: "gray",
  },
});
