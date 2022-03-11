import { AntDesign, FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Alert,
  Animated,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
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
import MaStyles from "../assets/styles/MaStyles";
import { ModalSelectList } from "react-native-modal-select-list";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import { RootStackParamList } from "../types";
import { useEffect, useState } from "react";
import Globals from "../constants/Globals";
import maxAuto from "../api/maxAuto";
import { dateFormat1 } from "../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../components/CustomMarker";
import { SliderBox } from "react-native-image-slider-box";
import { SharedElement } from "react-navigation-shared-element";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { RFValue } from "react-native-responsive-fontsize";
import Loader from "../components/Loader";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

//  g

export default function HomeScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);
  const [isFocused, setIsFocused] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [fromRealSale, setFromRealSale] = useState("0");

  const [isMax, setIsMax] = useState(false);

  const [customerID, setCustomerId] = useState("");
  const [logged, setLogged] = useState("false");

  const [refresh, setRefresh] = useState(true);
  const [key, isKey] = useState(true);

  const [page1, setPage1] = useState(true);

  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nameSeller, setNameSeller] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [locationLabel, setLocationLabel] = useState("All New Zealand");

  let exampleItems = [
    {
      title: "Car",
      text: "/incl. GST",
      price: "$8.00",
      priceDiscount: "$7.50",
      image: "./assets/motobg.jpg",
      flag: true,
      desc1: "90 days listings",
      desc2: "IOS & Android",
      desc3: "15 Photos",
      desc4: "Free basic checks",
      desc5: "Reach thousand",
    },
    {
      title: "Motorcycle",
      text: "/incl. GST",
      price: "$7.50",
      priceDiscount: "$7.50",
      image: "./assets/motobg.jpg",
      flag: false,
      desc1: "90 days listings",
      desc2: "IOS & Android",
      desc3: "15 Photos",
      desc4: "Free basic checks",
      desc5: "Reach thousand",
    },
  ];

  const onRefresh = React.useCallback(async () => {
    setPage(1);
    setRefreshing(true);
    setupPage();
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    setupPage();
  }, []);

  const setupPage = async () => {
    maxAuto.silentLogin().then(async (result) => {});
    maxAuto.getMyVehicles().then(async (result) => {
      setLoading(false);
      setListCar(result.data);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setupPage();
    }, [])
  );

  const updateMyVehicle = () => {
    setupPage();
  };

  //
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

  const regionSelected = (idRegion: string, nameRegion: string) => {
    //console.log(nameRegion)
    //setModalVisible(false);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
    setPage(1);
  };

  const createList = () => {
    if (logged) {
      navigation.navigate("WantedCreate");
    } else {
      navigation.navigate("Login");
    }
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected;
    } else {
      return MaStyles.textInputRow;
    }
  };

  const loadMore = () => {
    let ind = page + 1;
    console.log("**************************************** Page :" + ind);
    setPage(ind);
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const checkRego = () => {
    setModalVisible(false);
    setPage1(false);
  };

  //asdasd kasd asdka kjgh  kjhasd  jh asd lkj lkj asd  lkjha s   kjh asdasdfas
  //asdasd kasd

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

  const goToEdit = async (item) => {
    await AsyncStorage.setItem("myVehicleEdit", JSON.stringify(item));
    navigation.navigate("MyVehicleEdit");
  };

  const renderRegoColor = (vehicle_rego) => {
    let today = new Date();
    let date = new Date(vehicle_rego);
    //console.log(today);
    //console.log(date);

    if (today >= date) {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>REGO DUE</Text>
          <Text style={MaStyles.myVehicleSubExpire}>
            {dateFormat1(vehicle_rego)}
          </Text>
        </Col>
      );
    } else if (today.getMonth == date.getMonth) {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>REGO DUE</Text>
          <Text style={MaStyles.myVehicleSubExpireMonth}>
            {dateFormat1(vehicle_rego)}
          </Text>
        </Col>
      );
    } else {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>REGO DUE</Text>
          <Text style={MaStyles.myVehicleSub}>{dateFormat1(vehicle_rego)}</Text>
        </Col>
      );
    }
  };

  const reVeh = (item: string, index) => {
    maxAuto.desactivateNoti(item.vehicle_id);
    maxAuto.cancelNotification(item.vehicle_id);
    let targetItem = listCar[index];
    targetItem.is_notification = 0;
    //console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    updateMyVehicle();
    //setListCar(listCar);
  };

  const addVeh = (item: string, index) => {
    maxAuto.activateNoti(item.vehicle_id);
    let targetItem = listCar[index];
    targetItem.is_notification = 1;
    //console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);

    let wofNoti1 = new Date();
    let regoNoti1 = new Date();
    let wofNoti2 = new Date();
    let regoNoti2 = new Date();
    let wofNoti3 = new Date();
    let regoNoti3 = new Date();

    wofNoti1 = moment(item.vehicle_wof).subtract(1, "day").format("YYYY-MM-DD");
    regoNoti1 = moment(item.vehicle_rego)
      .subtract(1, "day")
      .format("YYYY-MM-DD");

    wofNoti2 = moment(item.vehicle_wof)
      .subtract(1, "month")
      .format("YYYY-MM-DD");
    regoNoti2 = moment(item.vehicle_rego)
      .subtract(1, "month")
      .format("YYYY-MM-DD");

    wofNoti3 = moment(item.vehicle_wof).subtract(7, "day").format("YYYY-MM-DD");
    regoNoti3 = moment(item.vehicle_rego)
      .subtract(7, "day")
      .format("YYYY-MM-DD");

    triggerLocalNotificationHandler(
      wofNoti1,
      "WOF is about to expired",
      "Wof is going to expired tomorrow",
      "w1" + item.vehicle_id
    );
    triggerLocalNotificationHandler(
      regoNoti1,
      "REGO is about to expired",
      "REGO is going to expired tomorrow",
      "r1" + item.vehicle_id
    );

    triggerLocalNotificationHandler(
      wofNoti2,
      "WOF is about to expired",
      "Wof is going to expired this month",
      "w2" + item.vehicle_id
    );
    triggerLocalNotificationHandler(
      regoNoti2,
      "REGO is about to expired",
      "REGO is going to expired this month",
      "r2" + item.vehicle_id
    );

    triggerLocalNotificationHandler(
      wofNoti3,
      "WOF is about to expired",
      "Wof is going to expired this month",
      "w3" + item.vehicle_id
    );
    triggerLocalNotificationHandler(
      regoNoti3,
      "REGO is about to expired",
      "REGO is going to expired this month",
      "r3" + item.vehicle_id
    );

    updateMyVehicle();
    //setListCar(listCar);
    //maxAuto.addWashList(customerID, id)
  };

  function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
  }

  const triggerLocalNotificationHandler = (date, title, message, id) => {
    var currentDate = new Date();
    var dateSecond = new Date(date);

    let resultInMinutes = getMinutesBetweenDates(dateSecond, currentDate);

    //console.log("val:----");
    //console.log(resultInMinutes);

    Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: title,
        body: message,
      },
      trigger: { minute: resultInMinutes },
    });
  };

  const renderBell = (item, index) => {
    if (item.is_notification == 0) {
      return (
        <TouchableOpacity
          onPress={() => reVeh(item, index)}
          style={{
            position: "absolute",
            right: 0,
            marginEnd: 20,
            marginTop: 70,
            backgroundColor: "white",
            borderRadius: 40,
            width: 35,
            height: 35,
          }}
        >
          <FontAwesome
            style={{ alignSelf: "center", marginTop: 5 }}
            name="bell"
            size={22}
            color="#0e4e92"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => addVeh(item, index)}
          style={{
            position: "absolute",
            right: 0,
            marginEnd: 20,
            marginTop: 70,
            backgroundColor: "white",
            borderRadius: 40,
            width: 35,
            height: 35,
          }}
        >
          <FontAwesome
            style={{ alignSelf: "center", marginTop: 5 }}
            name="bell-o"
            size={22}
            color="#0e4e92"
          />
        </TouchableOpacity>
      );
    }
  };

  const renderWofColor = (vehicle_wof) => {
    let today = new Date();
    let date = new Date(vehicle_wof);
    //console.log(today);
    //console.log(date);

    if (today >= date) {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>WOF Due</Text>
          <Text style={MaStyles.myVehicleSubRigthExpire}>
            {dateFormat1(vehicle_wof)}
          </Text>
        </Col>
      );
    } else if (today.getMonth == date.getMonth) {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>WOF Due</Text>
          <Text style={MaStyles.myVehicleSubRigthExpireMonth}>
            {dateFormat1(vehicle_wof)}
          </Text>
        </Col>
      );
    } else {
      return (
        <Col size={5}>
          <Text style={MaStyles.myVehicleSub}>WOF Due</Text>
          <Text style={MaStyles.myVehicleSubRigth}>
            {dateFormat1(vehicle_wof)}
          </Text>
        </Col>
      );
    }
  };

  return (
    <View
      style={[
        MaStyles.containerWhite,
        { marginHorizontal: 0, paddingHorizontal: 0, backgroundColor: "white" },
      ]}
    >
      <Grid>
        <Row
          style={{ paddingStart: 20, height: 40, marginTop: 0, width: "100%" }}
        >
          <Grid>
            <Col size={10} onPress={() => navigation.goBack()}>
              <Text style={MaStyles.textHeaderScreenM}>Vehicle Alerts</Text>
            </Col>
            <Col
              style={{ paddingEnd: 7 }}
              onPress={() => {
                if (isMax) {
                  Alert.alert("Max reached");
                } else {
                  navigation.navigate("MyVehicles");
                }
              }}
            >
              <AntDesign
                style={{ marginTop: 5 }}
                name="pluscircleo"
                size={22}
                color="#0e4e92"
              />
            </Col>
          </Grid>
        </Row>

        {loading ? (
          <Loader />
        ) : listCar.length != 0 ? (
          <Row style={{ marginTop: 10, paddingBottom: 20 }} size={16}>
            <FlatList
              style={{
                paddingBottom: 30,
                marginStart: 0,
                marginTop: 0,
                width: "100%",
              }}
              showsVerticalScrollIndicator={false}
              extraData={refresh}
              data={listCar}
              numColumns={1}
              ItemSeparatorComponent={() => (
                <View style={{ backgroundColor: "#cbccd2", height: 10 }}></View>
              )}
              //onEndReached={loadMore}
              //extraData={refresh}
              keyExtractor={(item) =>
                item.vehicle_registration + item.pic_url + item.vehicle_id
              }
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: width,
                    margin: 8,
                    marginStart: 0,
                    borderRadius: 5,
                    marginBottom: 0,
                    backgroundColor: "white",
                    paddingBottom: 20,
                    paddingTop: 10,
                  }}
                >
                  <Grid style={{ marginStart: 25 }}>
                    <Col size={1}>
                      {item.customer_pic != "" && (
                        <SharedElement id="profilePhoto">
                          <View
                            style={{
                              width: 38,
                              height: 38,
                              marginEnd: -6,
                              zIndex: 20000,
                              marginTop: -2,
                              borderRadius: 20,
                              alignSelf: "flex-start",
                              backgroundColor: "#0e4e92",
                            }}
                          />
                        </SharedElement>
                      )}
                    </Col>
                    <Col style={{ marginTop: -3 }} size={6}>
                      <Text style={MaStyles.listingNameM}>
                        {item.vehicle_title}
                      </Text>
                      <Text style={MaStyles.listingRegionM}>
                        {item.vehicle_registration}
                      </Text>
                    </Col>
                  </Grid>

                  {item.pic_url ? (
                    <View style={{ borderRadius: 0, marginTop: 20 }}>
                      <CachedImage
                        source={{ uri: Globals.S3_FULL_URL + item.pic_url }}
                        key={{ uri: Globals.S3_FULL_URL + item.pic_url }}
                        resizeMode="cover"
                        style={{
                          width: "100%",
                          height: 250,
                          marginTop: 0,
                          alignSelf: "center",
                          overflow: "hidden",
                          borderColor: "white",
                        }}
                      />
                    </View>
                  ) : (
                    <Image
                      source={require("../assets/images/placecar.png")}
                      resizeMode="cover"
                      style={{
                        width: "100%",
                        height: 270,
                        marginTop: 0,
                        alignSelf: "center",
                        overflow: "hidden",
                        borderColor: "white",
                        borderWidth: 2,
                        borderRadius: 20,
                      }}
                    />
                  )}
                  {renderBell(item, index)}
                  <Grid style={{ paddingHorizontal: 25, paddingTop: 20 }}>
                    <Col
                      onPress={() => {
                        goToEdit(item);
                      }}
                    ></Col>
                  </Grid>
                  <Grid style={{ paddingHorizontal: 25, marginTop: 0 }}>
                    {renderRegoColor(item.vehicle_rego)}
                    {renderWofColor(item.vehicle_wof)}
                  </Grid>
                </View>
              )}
            />
          </Row>
        ) : (
          <Row style={{ marginTop: height / 4 }} size={16}>
            <TouchableOpacity style={{ paddingHorizontal: 15, width: "100%" }}>
              <Ionicons
                onPress={(value) => navigation.navigate("MyVehicles")}
                style={{ alignSelf: "center" }}
                name="md-add-circle"
                size={50}
                color="#0e4e92"
              />
              <Text style={[MaStyles.textHeaderMCenter, { marginTop: 20 }]}>
                Add Vehicle
              </Text>
              <Text style={MaStyles.textSubMCenter}>
                Vehicle Reminder helps you keep track and stay on top of your
                WOF and Rego.
              </Text>
            </TouchableOpacity>
          </Row>
        )}
      </Grid>

      <Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: 250,
            marginTop: height - 250,
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
                onPress={() => setModalVisible(false)}
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
          </Row>

          <Row style={{ marginTop: 100, position: "absolute" }}>
            <Col
              onPress={() => {
                Linking.openURL(`tel:${phone}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 20 }}
                  name="phone"
                  size={35}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Call Contact</Text>
            </Col>
            <Col
              onPress={() => {
                Linking.openURL(`sms:${phone}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 21 }}
                  name="message1"
                  size={33}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Send a Message</Text>
            </Col>
            <Col
              onPress={() => {
                Linking.openURL(`mailto:${email}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 20 }}
                  name="mail"
                  size={35}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Send a Email</Text>
            </Col>
          </Row>
        </Grid>
      </Modal>

      <Modal
        onBackdropPress={() => setCreateModal(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={createModal}
        style={[
          MaStyles.container,
          {
            maxHeight: 650,
            marginTop: height - 550,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >
        <Grid style={{ marginTop: 5, width: "100%" }}>
          <Row style={{ height: 40, marginTop: 20 }}>
            <Grid>
              <Col
                style={{ marginStart: 4, alignItems: "center" }}
                // onPress={() => setModalWantedVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>Add Vehicle</Text>
              </Col>
              <Col
              //onPress={() => setModalWantedVisible(false)}
              >
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </Row>

          <Image
            source={require("../assets/images/placecar.png")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 140,
              marginTop: 10,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />

          <View
            style={{ height: 0.5, backgroundColor: "#00000020", marginTop: 10 }}
          ></View>

          <Row>
            <Text style={MaStyles.TextCardListView}></Text>
          </Row>
          <Row>
            <Text style={MaStyles.menuTitleBox}></Text>
          </Row>
        </Grid>
      </Modal>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    marginTop: 10,
  },
  label: {
    margin: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginStart: -15,
  },
});
