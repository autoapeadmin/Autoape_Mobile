import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Animated,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
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
import { Col, Grid, Row } from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import { ModalSelectList } from "react-native-modal-select-list";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import { Card } from "react-native-shadow-cards";
import { RootStackParamList } from "../../types";
import { useEffect, useState } from "react";
import Globals from "../../constants/Globals";
import VehicleListGrid from "../../components/VehicleComponents/VehicleListGrid";
import maxAuto from "../../api/maxAuto";
import { findDaysDiffrent } from "../../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../components/CustomMarker";
import { SliderBox } from "react-native-image-slider-box";
import { SharedElement } from "react-navigation-shared-element";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import ImageView from "react-native-image-view";
import MultiSelect from "react-native-multiple-select";
import Loader from "../../components/Loader";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function WantedListScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [imagesFull, setImagesFull] = useState([]);
  const [listCar, setListCar] = useState([]);
  const [listName, setListName] = useState([]);
  const [allCameras, setAllCameras] = useState([]);
  const [page, setPage] = useState(1);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleStreet, setModalVisibleStreet] = useState(false);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [targetImg, setTargetImg] = useState("");

  const [fromRealSale, setFromRealSale] = useState("0");

  const [customerID, setCustomerId] = useState("");
  const [logged, setLogged] = useState("false");
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(true);

  const [viewPhotos, setViewPhotos] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [camarasSelected, setCamerasSelected] = useState([]);
  const [locationLabel, setLocationLabel] = useState("Auckland");
  const [lat, setLat] = useState(0.0);
  const [lon, setLong] = useState(0.0);
  const [images, setImages] = useState([]);

  const [mapView, setMapView] = useState(false);

  const [widthMap, setWidthMap] = useState("100%");

  const [listEVCharger, setListEvCharger] = useState([]);

  const onRefresh = React.useCallback(async () => {
    setPage(1);
    setRefreshing(true);
    setupPage();
    setRefreshing(false);
  }, [refreshing]);

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
    regionSelected(res[0], res[1]);
  };

  const regionSelected = async (idRegion: string, nameRegion: string) => {
    //console.log(nameRegion)
    //setModalVisible(false);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
    setPage(1);
    setCamerasSelected([]);
    setIsAllSelected(true);

    var obj = [];
    var obj2 = [];
    allCameras.forEach((element) => {
      if (element.region == nameRegion) {
        obj.push(element);
        obj2.push({
          name: element.name,
          id: element.id,
          imageUrl: element.imageUrl,
          description: element.description,
        });
      }
    });

    await AsyncStorage.setItem("regionTraffic", nameRegion);

    console.log(obj2);
    setListName(obj2);
    setListCar(obj);
    setRefresh(!refresh);
    setLoading(false);
    setModalVisibleStreet(true);
  };

  const setupPage = async () => {
    setPage(1);

    let region_default = await AsyncStorage.getItem("regionTraffic");
    let region_id = await AsyncStorage.getItem("region_default_id");
    const latitud = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    console.log(latitud);
    console.log(longitude);

    if (latitud != null || longitude != null) {
      setLat(parseFloat(latitud));
      setLong(parseFloat(longitude));
    } else {
      setLat(parseFloat("37.4219983"));
      setLong(parseFloat("-122.084"));
    }

    setLocationLabel(region_default != null ? region_default : "Auckland");

    setRegionId(region_id != null ? region_id : "0");

    if (region_default === "Auckland") {
      region_default = "Auckland";
      setLocationLabel("Auckland");
    }

    if (region_default === null) {
      region_default = "Auckland";
    }

    maxAuto.getCameras().then((result) => {
      //console.log(result);
      //console.log(result);
      setAllCameras(result.camera);
      var obj = [];
      var obj2 = [];
      var obj4 = [];

      result.camera.forEach((element) => {
        //(element.region);
        console.log(region_default);
        if (element.region == region_default) {
          obj.push(element);
          obj2.push(element.name);
          obj4.push({
            name: element.name,
            id: element.id,
            imageUrl: element.imageUrl,
            description: element.description,
          });
        }
      });

      setListName(obj4);
      setListCar(obj);
      setLoading(false);
    });

    fetch(Globals.BASE_URL + "Maxauto/allPlacesListCameras")
      .then((response) => response.json())
      .then((data) => {
        setRegionList(data.data.region_list);
      });

    try {
      const myArray = await AsyncStorage.getItem("@MySuperStore:key");
      const regionLabel = await AsyncStorage.getItem("regionTraffic");
      if (myArray !== null) {
        // We have data!!
        const Arrayss = JSON.parse(myArray);
        setCamerasSelected(Arrayss);
        setIsAllSelected(false);
        setLocationLabel(regionLabel);
      } else {
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const createList = () => {
    if (logged) {
      navigation.navigate("WantedCreate");
    } else {
      navigation.navigate("Login");
    }
  };

  const loadMore = () => {
    let ind = page + 1;
    console.log("**************************************** Page :" + ind);
    setPage(ind);
    maxAuto.getWantedList(ind, regionId).then((result) => {
      let array = result;
      array.forEach((element) => {
        // console.log(element.vehicule_price);
        listCar.push(element);
      });
      setLoading(false);
      setRefresh(!refresh);
    });
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  function numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const openModalContact = (phone, img) => {
    setTargetImg(img);
    let urlIF = [];
    //setModalVisible(true);
    //setImagesFull([]);
    urlIF.push({
      source: { uri: img },
      title: "Traffic",
      width: width
    });

    setImagesFull(urlIF);
    //   imagesFull.push(urlIF);
    setViewPhotos(true);
  };

  const renderImages = (url) => {
    if (!loading) {
      return (
        <View style={{ marginTop: 10, width: "100%" }}>
          <CachedImage
            style={{
              width: "100%",
              height: 135,
              zIndex: 20000,
              borderBottomEndRadius: 5,
              borderBottomStartRadius: 5,
            }}
            source={{
              uri: Globals.S3_THUMB_URL_300 + url,
            }}
            resizeMode="cover"
          />
        </View>
      );
    }
  };

  function getSMSDivider(): string {
    return Platform.OS === "ios" ? "&" : "?";
  }

  const styleBox = (selectedItem: string) => {
    let selectedClients = camarasSelected;
    let isItemSelected =
      selectedClients.filter((item) => {
        return item.id.includes(selectedItem.id);
      }).length > 0
        ? true
        : false;

    if (isItemSelected) {
      return MaStyles.modaliconBackSelectedNTraffic;
    } else {
      return MaStyles.modaliconBackNTraffic;
    }
  };

  const styleBoxAll = () => {
    if (isAllSelected) {
      return MaStyles.modaliconBackSelectedNTraffic;
    } else {
      return MaStyles.modaliconBackNTraffic;
    }
  };

  //select car
  const styleTextAll = () => {
    if (isAllSelected) {
      return MaStyles.buttonTextNearTrafficRegion;
    } else {
      return MaStyles.buttonTextWhiteNRegion;
    }
  };

  //select car
  const styleText = (selectedItem: string) => {
    let selectedClients = camarasSelected;
    let isItemSelected =
      selectedClients.filter((item) => {
        return item.id.includes(selectedItem.id);
      }).length > 0
        ? true
        : false;

    if (isItemSelected) {
      return MaStyles.buttonTextNearTrafficRegion;
    } else {
      return MaStyles.buttonTextWhiteNRegion;
    }
  };

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

  const modalOptionsProvider = ({ page, pageSize, customFilterKey }) => {
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

  const renderMarker = (marker, index) => {
    //console.log(marker);
    return (
      <Marker
        key={index}
        onPress={() => openModalContact(index, marker.imageUrl)}
        coordinate={{
          latitude: parseFloat(marker.lat),
          longitude: parseFloat(marker.lon),
        }}
        /*  title={marker.operator}
          description={"Status: " + marker.availabilityStatus} */
      >
        <View
          style={{
            borderColor: "white",
            borderWidth: 2,
            borderRadius: 25,
            width: 53,
            height: 53,
          }}
        >
          <Image
            source={require("../../assets/images/icons/camera.png")}
            style={{
              width: 50,
              height: 50,
            }}
            resizeMode="contain"
          />
        </View>
      </Marker>
    );
  };

  const onSelectItem = async (selectedItem) => {
    setIsAllSelected(false);
    let selectedClients = camarasSelected;
    let isItemSelected =
      selectedClients.filter((item) => {
        return item.id.includes(selectedItem.id);
      }).length > 0
        ? true
        : false;

    if (isItemSelected) {
      const index = selectedClients.findIndex(
        (obj) => obj.id === selectedItem.id
      );
      selectedClients.splice(index, 1);
    } else {
      selectedClients.push(selectedItem);
    }

    setCamerasSelected(selectedClients);
    await AsyncStorage.setItem(
      "@MySuperStore:key",
      JSON.stringify(selectedClients)
    );
    setRefresh(!refresh);
  };

  const renderRegionItem = (item) => {
    return (
      <Row style={{ marginTop: 20, height: 40, width: "97%", marginBottom: 5 }}>
        <TouchableOpacity
          onPress={() => onSelectItem(item)}
          style={styleBox(item)}
        >
          <Text style={styleText(item)}>{item.name}</Text>
        </TouchableOpacity>
      </Row>
    );
  };

  return (
    <View
      style={[
        MaStyles.container,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      <View style={{ marginTop: 0 }}>
        <ImageView
          animationType={"fade"}
          style={{ paddingTop: 300 }}
          images={imagesFull}
          isVisible={viewPhotos}
          onClose={() => setViewPhotos(false)}
          imageIndex={0}
          //renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
        />
      </View>

      <Grid>
        <Row
          style={{
            paddingHorizontal: 10,
            height: 40,
            marginTop: 0,
            width: "100%",
          }}
        >
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 5 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={10}>
              <Text style={MaStyles.textHeaderScreenM}>Traffic Camera</Text>
            </Col>
            <Col style={{ paddingEnd: 15 }}>
              {mapView ? (
                <TouchableOpacity
                  onPress={(value) => setMapView(false)}
                  style={MaStyles.buttonViewTraffic}
                >
                  <Text style={MaStyles.buttonTextNearTraffic}>
                    <FontAwesome5 name="th-list" size={15} color="black" />
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={(value) => setMapView(true)}
                  style={MaStyles.buttonViewTraffic}
                >
                  <Text style={MaStyles.buttonTextNearTraffic}>
                    <FontAwesome5 name="map" size={15} color="black" />
                  </Text>
                </TouchableOpacity>
              )}
            </Col>
          </Grid>
        </Row>
        <Row style={{ paddingHorizontal: 15, height: 40 }}>
          <Col>
            <Text
              style={[
                MaStyles.subTextMake,
                { marginTop: 0, textAlign: "left" },
              ]}
            >
              Real-time static images of over 100 key locations across NZ.
              Refreshes every 30 seconds.
            </Text>
          </Col>
        </Row>
        <Row style={{ paddingHorizontal: 5, marginTop: -10 }}>
          <Col>
            <TouchableOpacity
              onPress={(value) => openModal()}
              style={MaStyles.buttonViewM}
            >
              <Text style={[MaStyles.buttonTextNearM]}>{locationLabel}</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              onPress={(value) => setModalVisibleStreet(true)}
              style={[MaStyles.buttonViewM, { backgroundColor: "#abbbd5" }]}
            >
              <Text style={[MaStyles.buttonTextNearM, { color: "#355599" }]}>
                {camarasSelected.length === 0 ? "All" : camarasSelected.length}{" "}
                Selected
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>

        {loading ? (
          <Loader />
        ) : listCar.length != 0 ? (
          <Row style={{ marginTop: 10 }} size={16}>
            {!loading && (
              <View style={{ width: "100%" }}>
                {mapView ? (
                  <MapView
                    clusterColor={"#0e4e95"}
                    zoomEnabled={true}
                    followsUserLocation={false}
                    showsUserLocation={true}
                    initialRegion={{
                      latitude: lat,
                      longitude: lon,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    style={{ width: "100%", height: widthMap, marginTop: 20 }}
                  >
                    {allCameras.map((marker, index) =>
                      renderMarker(marker, index)
                    )}
                  </MapView>
                ) : (
                  <FlatList
                    // onEndReached={loadMore}
                    ListFooterComponent={<View style={{ margin: 0 }} />}
                    style={{
                      paddingBottom: 30,
                      marginStart: 0,
                      marginTop: 16,
                      width: "100%",
                    }}
                    showsVerticalScrollIndicator={false}
                    extraData={refresh}
                    data={isAllSelected ? listCar : camarasSelected}
                    numColumns={2}
                    //onEndReached={loadMore}
                    //extraData={refresh}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          width: width / 2 - 4,
                          margin: 8,
                          marginStart: 0,
                          borderRadius: 5,
                          marginBottom: 0,
                          backgroundColor: "white",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => openModalContact(index, item.imageUrl)}
                        >
                          <SharedElement id="vehicleImage">
                            <Image
                              key={item.imageUrl}
                              source={{ uri: item.imageUrl }}
                              resizeMode="contain"
                              style={{
                                width: "100%",
                                height: 115,
                                marginTop: 0,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                              }}
                            />
                          </SharedElement>
                          <View
                            style={{
                              margin: 8,
                              marginBottom: 15,
                              marginTop: 5,
                            }}
                          >
                            <Text style={MaStyles.TextCardListView}>
                              {item.name}
                            </Text>
                            <Text style={MaStyles.TextCardVehicle}>
                              {item.description}
                            </Text>
                          </View>

                          <Grid style={{ marginTop: -5, marginBottom: 0 }}>
                            <Col
                              onPress={() =>
                                openModalContact(
                                  item.contact_phone,
                                  item.contact_email
                                )
                              }
                            ></Col>
                          </Grid>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
          </Row>
        ) : (
          <Row style={{ marginTop: 10 }} size={16}>
            {!loading && (
              <TouchableOpacity
                onPress={(value) => openModal()}
                style={{ paddingHorizontal: 15, width: "100%" }}
              >
                <LottieView
                  autoPlay={true}
                  loop={true}
                  style={{
                    marginTop: 0,
                    marginStart: 5,
                    alignSelf: "center",
                    width: width - 100,
                    height: width - 100,
                  }}
                  source={require("../../assets/lottie/car.json")}
                  // OR find more Lottie files @ https://lottiefiles.com/featured
                  // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                />
                <Text style={MaStyles.lottieTitle}>Wanted List Empty!</Text>
                <Text style={MaStyles.lottieSub}>
                  Click here to select a different region
                </Text>
              </TouchableOpacity>
            )}
          </Row>
        )}
      </Grid>

      <View>
        <Modal
          onBackdropPress={() => setModalVisible(false)}
          animationIn={"slideInUp"}
          isVisible={isModalVisible}
        >
          <View style={{ flex: 1 }}>
            <Image
              key={targetImg}
              source={{ uri: targetImg }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 300,
                marginTop: "50%",
              }}
            />
          </View>
        </Modal>
      </View>
      <View>
        <Modal
          onBackButtonPress={() => setModalVisibleStreet(false)}
          onBackdropPress={() => setModalVisibleStreet(false)}
          deviceHeight={height}
          animationIn={"slideInUp"}
          isVisible={isModalVisibleStreet}
          style={[
            MaStyles.container,
            {
              paddingTop: 20,
              maxHeight: 520,
              marginTop: height - 520,
              marginHorizontal: 0,
              marginVertical: 0,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              flexDirection: "column",
              justifyContent: "space-between",
            },
          ]}
        >
          <Grid style={{ height: 40 }}>
            <Row style={{ height: 40, marginTop: 0 }}>
              <Col
                style={{ marginStart: 4, alignItems: "center" }}
                onPress={() => setModalVisibleStreet(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>Select Cameras</Text>
              </Col>
              <Col onPress={() => setModalVisibleStreet(false)}>
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Row>

            <Row style={{ marginTop: 20, height: 40, width: "97%" }}>
              <TouchableOpacity
                onPress={() => setIsAllSelected(!isAllSelected)}
                style={styleBoxAll()}
              >
                <Text style={styleTextAll()}>All Cameras</Text>
              </TouchableOpacity>
            </Row>

            <FlatList
              style={{ marginTop: 5 }}
              //horizontal={true}
              data={listName}
              extraData={refresh}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderRegionItem(item)}
            />
          </Grid>
        </Modal>
      </View>

      <ModalSelectList
        inputName="customFilterKey"
        ref={saveModalRef}
        placeholder={"Find Region..."}
        closeButtonText={"Back"}
        options={staticModalOptions}
        onSelectedOption={onSelectedOption}
        disableTextSearch={false}
        provider={modalOptionsProvider}
        numberOfLines={3}
      />
    </View>
  );
}
