import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  EvilIcons,
  SimpleLineIcons,
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
import Moment from "moment";
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
import { SharedElement } from "react-navigation-shared-element";
import TextAnimator from "../../utils/TextAnimator";
import NotFoundScreen from "../../components/NotFoundScreen";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function DealershipDetailsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [customerID, setCustomerId] = useState("0");
  const [isModalVisible, setModalVisible] = useState(false);
  const [dealerDetails, setDealerDetails] = useState([]);
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
  const [dealershipId, setDealership] = useState("0");

  const [isOpen, setOpen] = useState(true);
  const [timeFrom, setFrom] = useState("00:00");
  const [timeTo, setTo] = useState("00:00");

  const [clicked, setClicked] = useState(false);

  const [isAdded, setIsAdded] = useState(0);

  const [isTime, setIsTime] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupPage();
  }, []);

  const filterMakes = (search_text: String) => {
    setTextFilter(search_text);
    setRenderMake(renderMake!);
  };

  const loadMore = () => {
    let ind = page + 1;
    setPage(ind);
    let datas = urlCall + "/" + ind;

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
    const latitud2 = await AsyncStorage.getItem("latitude");
    const longitude2 = await AsyncStorage.getItem("longitude");
    const id = await AsyncStorage.getItem("customer_id");
    setCustomerId(id);
    setDealership(route.params.carId);
    console.log(route.params.carId);
    setUrlCall(
      Globals.BASE_URL +
        "Maxauto/findDealershipById/" +
        route.params.carId +
        "/" +
        latitud2 +
        "/" +
        longitude2
    );
    fetch(
      Globals.BASE_URL +
        "Maxauto/findDealershipById/" +
        route.params.carId +
        "/" +
        latitud2 +
        "/" +
        longitude2
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.data.details);
        setDealerDetails(data.data.details);
        setListSales(data.data.agents);
        setListCar(data.data.vehicles);
        setIsAdded(data.data.details.is_added);

        if (data.data.time.open != "00:00" && data.data.time.close != "00:00") {
          var open = Moment("2020-12-04T" + data.data.time.open).format("LT");
          var close = Moment("2020-12-04T" + data.data.time.close).format("LT");
          var now = Moment();
          setFrom(open);
          setTo(close);

          var format = "hh:mm:ss";
          var time = Moment(now, format),
            beforeTime = Moment(data.data.time.open + ":00", format),
            afterTime = Moment(data.data.time.close + ":00", format);

          if (time.isBetween(beforeTime, afterTime)) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        } else {
          setIsTime(false);
        }
        setLoading(false);
      });

    maxAuto.getAllMakeSearch().then((result) => setListMake(result));
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const renderImages = () => {
    //console.log(carDetails);
    if (!loading) {
      return (
        <Image
          source={{ uri: Globals.S3_FULL_URL + carPhotos[0].pic_url }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 300,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      );
    } else {
      return (
        <Image
          source={require("../../assets/images/loading.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 300,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      );
    }
  };

  const renderDetails = () => {
    if (!loading) {
      return (
        <View>
          <View
            style={{
              backgroundColor: "#0e4e92",
              width: 150,
              opacity: 0.9,
              borderRadius: 5,
            }}
          >
            <Text
              style={[
                MaStyles.subText,
                { fontSize: 12, margin: 5, color: "white", marginStart: 10 },
              ]}
            >
              Listed {findDaysDiffrent(carDetails[0].indate)}
            </Text>
          </View>
          <Text style={MaStyles.textHeaderBlack}>
            {carDetails[0].vehicule_year} {carDetails[0].make_description}{" "}
            {carDetails[0].model_desc}
          </Text>
        </View>
      );
    }
  };

  const checkMake = (id: string, url: string, name: string) => {
    //Alvaro
    idChecked(id);
    setSrcImg(url);
    setName(name);
    setMakeL(name);
    setModalVisible2(false);

    fetch(Globals.BASE_URL + "Maxauto/getModels/" + id)
      .then((response) => response.json())
      .then((data) => {
        setListModel(data.data);
      });
  };

  const renderFlatMake = (item, index) => {
    //Alvaro
    if (textFilter == "") {
      return (
        <Col
          onPress={() =>
            checkMake(item.make_id, item.make_logo, item.make_description)
          }
          style={{ marginBottom: 15 }}
        >
          <View style={styleBox(item.make_id)}>
            <Image
              source={{
                uri:
                  Globals.BASE_URL +
                  "images/logosMake/" +
                  item.make_logo +
                  ".png",
              }}
              style={{ width: 70, height: 80 }}
            />
          </View>
          <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
        </Col>
      );
    } else {
      if (
        item.make_description.toLowerCase().includes(textFilter.toLowerCase())
      ) {
        return (
          <Col
            onPress={() =>
              checkMake(item.make_id, item.make_logo, item.make_description)
            }
            style={{ marginBottom: 15 }}
          >
            <View style={styleBox(item.make_id)}>
              <Image
                source={{
                  uri:
                    Globals.BASE_URL +
                    "images/logosMake/" +
                    item.make_logo +
                    ".png",
                }}
                style={{ width: 70, height: 80 }}
              />
            </View>
            <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
          </Col>
        );
      } else {
        return <Col style={{ position: "absolute" }}></Col>;
      }
    }
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

  const addDealer = () => {
    if (customerID != "0") {
      maxAuto.addWashListDealer(customerID, dealershipId);
      setIsAdded(1);
    }
  };

  const remDealer = () => {
    if (customerID != "0") {
      maxAuto.removeWashListDealer(customerID, dealershipId);
      setIsAdded(0);
    }
  };

  const openMap = (address: string) => {
    Linking.openURL(
      "https://www.google.com/maps/search/?api=1&query=" + address
    );
  };

  const locationL = () => {
    if (locationLabel == "Location") {
      return MaStyles.labelPlaceholder2;
    } else {
      return MaStyles.labelText2;
    }
  };

  const styleBox = (id: string) => {
    if (checked == id) {
      return MaStyles.iconBackSelected;
    } else {
      return MaStyles.iconBack;
    }
  };

  const openModalMake = () => {
    setModalVisible2(true);
  };

  const modelL = () => {
    if (locationLabel == "Location") {
      return MaStyles.labelPlaceholder2;
    } else {
      return MaStyles.labelText2;
    }
  };

  let modalRef3;
  const openModal3 = () => {
    modalRef3.show();
  };

  const saveModalRef3 = (ref3) => (modalRef3 = ref3);
  const onSelectedOption3 = (value) => {
    let res = value.split("|");
    modelSelected(res[0], res[1]);
  };

  const modelSelected = (idMake: string, makeName: string) => {
    setModelLabel(makeName);
    setModelId(idMake);
  };

  const createStaticModalOptions3 = () => {
    const options = [];
    for (let i = 0; i < listModel.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listModel[i].model_desc,
        value: listModel[i].model_id + "|" + listModel[i].model_desc,
      });
    }
    return options;
  };

  const modalOptionsProvider3 = ({ page, pageSize, customFilterKey3 }) => {
    let options = [];
    for (let i = 0; i < listModel.length; i++) {
      //  console.log(listModel[i]);
      options.push({
        label: listModel[i].model_desc,
        value: listModel[i].model_id + "|" + listModel[i].model_desc,
      });
    }
    // console.log(customFilterKey3);
    if (!!customFilterKey3) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey3}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions3 = createStaticModalOptions3();

  const selectImage = () => {
    setImageVisible(false);
    setUpdatePhoto(!updatePhoto);
  };

  const compressImage = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 200 } }],
      { compress: 0.4, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    return file;
  };

  const callBackImg = (callback) => {
    //console.log(callback);
    const cPhotos = [];
    callback.then(async (photos) => {
      // console.log(photos);
      const cPhotos = [];
      for (let photo of photos) {
        //compress
        const pPhoto = await compressImage(photo.uri);

        photo["localUri"] = pPhoto["uri"];

        photo["index2"] = photos.indexOf(photo) + 1;
        cPhotos.push(photo);
      }
      setMultipleUrl(cPhotos);
      setLocalImage(cPhotos);
    });
  };

  const renderSelectedComponent = (number: string) => (
    <View
      style={{
        backgroundColor: "#0e4e92",
        marginTop: 5,
        marginStart: 5,
        alignSelf: "flex-start",
        borderRadius: 20,
        height: 20,
        width: 20,
      }}
    >
      <Text style={{ color: "white", alignSelf: "center", marginTop: 1 }}>
        {number}
      </Text>
    </View>
  );

  const listTradein = () => {
    //get Values to List

    setClicked(true);

    fetch(Globals.BASE_URL + "Maxauto/listTradeInd", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make_id: checked,
        model_id: modelId,
        submodel: subModel,
        odometer: odometer,
        description: desc,
        fk_customer: customerID,
        fk_dealership: dealershipId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //.log(data.data);
        uploadImages(data.data);
        //saveImage
      });

    //photos
    //console.log(bodyF);
  };

  const uploadImages = async (idCar) => {
    //hacer un for y el i++ ponerlo cuando obtenga la respuesta de la base de datos

    //        let index = 0;

    for (let photo of localImage) {
      //uri
      let localUri = photo["localUri"];
      //  console.log("Local:" + localUri);
      let filename = localUri.split("/").pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append("photo", { uri: localUri, name: filename, type });
      //formData.append('photo', index.toString());

      //

      //const response = await fetch('');
      const setting = {
        method: "POST",
        body: formData,
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      try {
        let url = Globals.BASE_URL + "Maxauto/uploadCarPhotoTradeIn/" + idCar;

        const fetchResponse = await fetch(url, setting);

        //console.log(fetchResponse.blob);
        const data = await fetchResponse.json();

        setModalVisible(false);

        Toast.show({
          type: "success",
          position: "top",
          text1: "Message Sent.",
          text2: "Trade In",
          topOffset: 50,
        });

        // if (photoResume == '') {
        //     setPhotoResume(data.data)
        // }
      } catch (e) {}
      //index++;
    }

    //go6();
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

  const renderOpen = () => {
    if (isTime) {
      if (isOpen) {
        return (
          <Text style={[MaStyles.subTextDealer2, { marginTop: 5 }]}>
            <FontAwesome
              name="circle"
              size={11}
              color="green"
              style={{ height: 20, textAlignVertical: "top" }}
            />
            {"   "}Open ({timeFrom} to {timeTo})
          </Text>
        );
      } else {
        return (
          <Text style={[MaStyles.subTextDealer2, { marginTop: 5 }]}>
            <FontAwesome
              name="circle"
              size={11}
              color="red"
              style={{ height: 20, textAlignVertical: "top" }}
            />
            {"   "}Close
          </Text>
        );
      }
    }
  };

  const renderBackground = () => {
    return (
      <CachedImage
        source={{
          uri: Globals.DEALERSHIP_LOGO + dealerDetails.cover_base64_img,
        }}
        resizeMode={"cover"}
        style={{ width: "100%", height: 300 }}
      ></CachedImage>
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
      <Modal
        deviceHeight={height}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        isVisible={loading}
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
            backgroundColor: "white",
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
            content="Loading"
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
            source={require("../../assets/lottie/loading3.gif")}
          />
        </View>
      </Modal>

      <View>
        {renderBackground()}
        <View style={{ marginHorizontal: 15 }}>
          <View style={{ marginTop: -66 }}>
            <Row style={{ marginTop: 12 }}>
              <Col size={5}>
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
                        marginTop: 0,
                        width: 100,
                        height: 100,
                        alignSelf: "flex-start",
                        borderColor: "white",
                        borderWidth: 1,
                        borderRadius: 50,
                      }}
                    >
                      <CachedImage
                        source={{
                          uri:
                            Globals.DEALERSHIP_LOGO + dealerDetails.img_base64,
                        }}
                        resizeMode="cover"
                        style={{
                          width: 98,
                          height: 98,
                        }}
                      />
                    </View>
                  </SharedElement>
                </View>
              </Col>
            </Row>
            <Row>
              <Col size={4}>
                <SharedElement id="dealer">
                  <Text style={MaStyles.textHeaderDealer}>
                    {dealerDetails.dealership_name}
                  </Text>
                </SharedElement>
                {renderOpen()}
                <Text
                  style={[
                    MaStyles.subTextDealer2,
                    { marginTop: 7, color: "gray" },
                  ]}
                >
                  <MaterialIcons name="gps-fixed" size={9} color="gray" />{" "}
                  {dealerDetails.distance} km away
                </Text>
              </Col>
             {/*  {isAdded == 0 && (
                <Col
                  onPress={() => addDealer()}
                  style={{ marginTop: 0, alignItems: "center" }}
                >
                  <AntDesign name="like2" size={34} color="gray" />
                  <Text style={[MaStyles.subTextDealer2, { marginTop: 5 }]}>
                    Follow
                  </Text>
                </Col>
              )}
              {isAdded == 1 && (
                <Col
                  onPress={() => remDealer()}
                  style={{ marginTop: 0, alignItems: "center" }}
                >
                  <AntDesign name="like1" size={34} color="#0e4e92" />
                  <Text
                    style={[
                      MaStyles.subTextDealer2,
                      { marginTop: 5, color: "#0e4e92" },
                    ]}
                  >
                    Following
                  </Text>
                </Col>
              )} */}
            </Row>
          </View>
          <Row>
            <Col>
              <Text style={MaStyles.textHeaderDealer2}>
                www.{dealerDetails.dealership_website}
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
                  <AntDesign
                    style={{ alignSelf: "flex-end" }}
                    name="message1"
                    size={13}
                    color="white"
                  />{" "}
                  Trade In
                </Text>
              </Button>
            </Col>
            <Col style={{ marginHorizontal: 4 }} size={2}>
              <Button style={MaStyles.buttonViewDealerWhite}>
                <Text style={MaStyles.buttonTextDealer}>
                  <AntDesign
                    style={{ alignSelf: "flex-end" }}
                    name="phone"
                    size={15}
                    color="#67686c"
                  />
                </Text>
              </Button>
            </Col>
            <Col style={{ marginStart: 4 }} size={2}>
              <Button style={MaStyles.buttonViewDealerWhite}>
                <Text style={MaStyles.buttonTextDealer}>
                  <AntDesign
                    style={{ alignSelf: "flex-end" }}
                    name="mail"
                    size={15}
                    color="#67686c"
                  />
                </Text>
              </Button>
            </Col>
          </Row>

          <Row style={{ marginTop: 30, height: 40 }}>
            <Col style={tabS1()}>
              <Text onPress={() => setTab(0)} style={tabT1()}>
                Information
              </Text>
            </Col>
            <Col style={tabS2()}>
              <Text onPress={() => setTab(1)} style={tabT2()}>
                Vehicles
              </Text>
            </Col>
            <Col style={tabS3()}>
              <Text onPress={() => setTab(2)} style={tabT3()}>
                Our team
              </Text>
            </Col>
          </Row>
        </View>

        <View
          style={{
            height: 20,
          }}
        ></View>

        {tab == 0 && (
          <View>
            <Row style={{ marginTop: 3, marginHorizontal: 15 }}>
              <Col size={1}>
                <FontAwesome
                  style={{ marginTop: 2 }}
                  name="map-pin"
                  size={15}
                  color="red"
                />
              </Col>
              <Col size={20}>
                <Text>{dealerDetails.address}</Text>
              </Col>
            </Row>

            <Row
              style={{ backgroundColor: "white", marginTop: 5, zIndex: 1000 }}
            >
              <Col style={{ marginHorizontal: 15 }}>
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

            <Row style={{ marginTop: 15, marginHorizontal: 15 }}>
              <Col>
                <Text style={MaStyles.subTextDealer}>
                  {dealerDetails.dealership_description}
                </Text>
              </Col>
            </Row>
          </View>
        )}

        {tab == 1 && (
          <View>
            <Row style={{ backgroundColor: "white", marginTop: -5 }}>
              <Col style={{ marginHorizontal: 15 }}>
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
            <Row style={{ backgroundColor: "white", marginTop: -5 }}>
              <Col style={{ marginHorizontal: 15 }}>
                {listSales.length === 0 ? (
                  <View style={{paddingBottom:30,overflow:"hidden"}}>
                    <NotFoundScreen
                      titleText={"No Team here!"}
                      subTitleText={"Dealership hasn't update people yet"}
                      uriImage={require("../../assets/images/splash/empty.png")}
                    />
                  </View>
                ) : (
                  <FlatList
                    style={{ paddingBottom: 30, marginTop: 15 }}
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
                                  uri:
                                    Globals.DEALERSHIP_LOGO + item.base64_img,
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
                                source={require("../../assets/images/placeholderuser.png")}
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
                          </View>
                        </TouchableOpacity>
                      </Card>
                    )}
                  />
                )}
              </Col>
            </Row>
          </View>
        )}
      </View>

      <Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: height,
            marginTop: height - (height - 50),
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >
        <KeyboardAwareScrollView
          enableAutomaticScroll={Platform.OS === "ios"}
          behavior={"padding"}
          style={{ width: "100%", height: 800, marginStart: 10 }}
        >
          <Row style={{ marginTop: 25, height: 50 }}>
            <Col>
              <Text style={MaStyles.textHeader}>Trade In</Text>
            </Col>
            <Col
              onPress={() => setModalVisible(false)}
              style={{ alignItems: "flex-end", marginEnd: 10 }}
            >
              <AntDesign name="closecircle" size={24} color="#0e4e92" />
            </Col>
          </Row>

          <Row>
            <Col>
              <Text
                style={[MaStyles.cardSubtitle, { marginTop: 0, color: "gray" }]}
              >
                Looking to trade your vehicle or sell it outright? Simply fill
                and submit the form below.{" "}
              </Text>
            </Col>
          </Row>

          <Row style={{ marginTop: 25, height: 16 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>
              Contact number
            </Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <TextInput
              style={[MaStyles.labelPlaceholder2, { paddingTop: 4 }]}
              onChangeText={(data) => setPhone(data)}
            ></TextInput>
          </Row>

          <Row style={{ marginTop: 20, height: 16 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>Make</Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Text style={locationL()} onPress={() => openModalMake()}>
              {makeL}
            </Text>
          </Row>

          <Row style={{ marginTop: 25, height: 16 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>Model</Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Text style={modelL()} onPress={(value) => openModal3()}>
              {modelLabel}
            </Text>
          </Row>

          <Row style={{ marginTop: 25, height: 16 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>
              Submodel
            </Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <TextInput
              style={[MaStyles.labelPlaceholder2, { paddingTop: 4 }]}
              onChangeText={(data) => setSubModel(data)}
            ></TextInput>
          </Row>

          <Row style={{ marginTop: 25, height: 16 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>
              Odometer (KM)
            </Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <TextInput
              style={[MaStyles.labelPlaceholder2, { paddingTop: 4 }]}
              onChangeText={(data) => setOdometer(data)}
            ></TextInput>
          </Row>

          <Row style={{ marginTop: 25, height: 20 }}>
            <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>
              Upload Photo
            </Text>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Button
              onPress={() => setImageVisible(true)}
              style={[
                MaStyles.buttonViewDealer,
                { width: width - 50, height: 50 },
              ]}
            >
              <Text style={[MaStyles.buttonTextDealer]}>
                <AntDesign
                  style={{ alignSelf: "flex-end" }}
                  name="camera"
                  size={15}
                  color="white"
                />{" "}
                Upload photo
              </Text>
            </Button>
          </Row>

          <Row style={{ marginTop: 25 }}>
            <Col>
              <Text style={[MaStyles.cardSubtitle, { marginTop: 0 }]}>
                Description (Optional)
              </Text>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <TextInput
              multiline={true}
              onChangeText={(text) => {
                setDesc(text);
              }}
              numberOfLines={4}
              autoCompleteType={"email"}
              placeholderTextColor={"gray"}
              style={[
                MaStyles.textInputRow,
                { height: 200, width: width - 50 },
              ]}
              //onChangeText={text => setRego(text)}
              //onSubmitEditing={() => { checkRego() }}
            />
          </Row>

          <Row style={{ marginTop: 15, marginBottom: 40 }}>
            <Button
              disabled={clicked}
              onPress={() => listTradein()}
              style={[
                MaStyles.buttonViewDealer,
                { width: width - 50, height: 50 },
              ]}
            >
              <Text style={MaStyles.buttonTextDealer}>Submit</Text>
            </Button>
          </Row>
        </KeyboardAwareScrollView>

        <Modal
          deviceHeight={height}
          animationIn={"slideInUp"}
          isVisible={isModalVisible2}
          style={[
            MaStyles.container,
            {
              marginHorizontal: 0,
              marginVertical: 0,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              flexDirection: "column",
              justifyContent: "space-between",
            },
          ]}
        >
          <Grid style={{ width: "100%" }}>
            <Row style={{ marginTop: 35, height: 40 }}>
              <Col style={{ marginHorizontal: 1 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible2(false)}
                  style={{ width: "100%", bottom: 5, alignSelf: "center" }}
                >
                  <View
                    style={[
                      MaStyles.buttonViewWhite,
                      { marginTop: 5, height: 50 },
                    ]}
                  >
                    <Text style={MaStyles.buttonTextWhite}>Done</Text>
                  </View>
                </TouchableOpacity>
              </Col>
              <Col size={3}>
                <TextInput //onChangeText={text => { setEngineSize(text); }}
                  placeholderTextColor={"gray"}
                  placeholder={"Quick make search"}
                  style={MaStyles.textInputRow}
                  onChangeText={(text) => filterMakes(text)}
                />
                <AntDesign
                  size={22}
                  style={{
                    marginBottom: -3,
                    marginTop: 14,
                    position: "absolute",
                    right: 1,
                    paddingEnd: 20,
                  }}
                  name="search1"
                  color="#0e4e92"
                />
              </Col>
            </Row>

            <Row style={{ marginTop: 100, position: "absolute" }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={listMake}
                style={{
                  alignSelf: "center",
                  marginTop: 0,
                  height: height - 200,
                  paddingBottom: 50,
                }}
                numColumns={4}
                extraData={renderMake}
                renderItem={({ item, index }) => renderFlatMake(item, index)}
              ></FlatList>
            </Row>
          </Grid>
        </Modal>

        <ModalSelectList
          inputName="customFilterKey3"
          ref={saveModalRef3}
          placeholder={"Find Model"}
          closeButtonText={"Back"}
          options={staticModalOptions3}
          onSelectedOption={onSelectedOption3}
          disableTextSearch={false}
          provider={modalOptionsProvider3}
          numberOfLines={3}
        />

        <Modal
          isVisible={imageVisible}
          style={[
            MaStyles.container,
            {
              marginHorizontal: 0,
              marginVertical: 0,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              flexDirection: "column",
              justifyContent: "space-between",
            },
          ]}
        >
          <Grid style={{ marginHorizontal: 15 }}>
            <Col size={2}>
              <Text style={[MaStyles.subText, { marginTop: 30 }]}>
                SELECT UP TO 1 PHOTO
              </Text>
            </Col>
            <Col size={1} onPress={() => selectImage()}>
              <View style={MaStyles.buttonView}>
                <Text style={MaStyles.buttonText}>DONE</Text>
              </View>
            </Col>
          </Grid>

          <View style={{ flex: 10, width: "100%", marginTop: 15 }}>
            <ImageBrowser
              max={1}
              renderSelectedComponent={(number) =>
                renderSelectedComponent(number)
              }
              onChange={(callback) => {}}
              callback={(onSubmit) => callBackImg(onSubmit)}
            />
          </View>
        </Modal>
      </Modal>
    </ScrollView>
  );
}

DealershipDetailsScreen.sharedElements = (
  route,
  otherNavigation,
  showing
) => {};
