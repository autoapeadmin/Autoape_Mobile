import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
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
import { dateFormat1, findDaysDiffrent } from "../../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../components/CustomMarker";
import { SliderBox } from "react-native-image-slider-box";
import { SharedElement } from "react-navigation-shared-element";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { Alert } from "react-native";
import NotFoundScreen from "../../components/NotFoundScreen";
import Loader from "../../components/Loader";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function MyDocumentsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalWantedVisible, setModalWantedVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const [listListings, setListListing] = useState([]);
  const [wantedList, setWantedList] = useState([]);

  const [targetListing, setTargetListing] = useState([]);

  const [carFlag, setCarFlag] = useState(true);
  const [dealerFlag, setDealerFlag] = useState(false);
  const [salesFlag, setSalesFlag] = useState(false);

  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [odo, setOdo] = useState("");
  const [engine, setEngine] = useState("");
  const [desc, setDesc] = useState("");

  const [id, setId] = useState("");
  const [idWanted, setIdWanted] = useState("");

  useEffect(() => {
    setupPage();
  }, []);

  const setupPage = async () => {
    const logged = await AsyncStorage.getItem("logged");
    const idCustomer = await AsyncStorage.getItem("customer_id");

    if (idCustomer == null) {
      navigation.navigate("Login");
    } else {
      if (logged == "true") {
        //navigation.navigate("List");
      } else {   
        navigation.navigate("Login");
      }
    }

    maxAuto.getMyDocuments(idCustomer).then((result) => {
      console.log(result);
      setLoading(false);
      setListListing(result);
      //setWantedList(result.objWantedListing);
      //setLoading(false);
    });
  };

  const changeTab = (id: number) => {
    if (id == 1) {
      setCarFlag(true);
      setDealerFlag(false);
    }
    if (id == 2) {
      setCarFlag(false);
      setDealerFlag(true);
    }
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

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const openListingModal = (targetId) => {
    console.log(targetId);
    let objList = listListings[targetId];
    console.log(objList);

    //
    setPrice(objList.vehicule_price);
    setYear(objList.vehicule_year);
    setOdo(objList.vehicule_odometer);
    setEngine(objList.vehicule_engine);
    setDesc(objList.vehicule_desc);
    setId(objList.vehicule_id);

    setModalVisible(true);
    setTargetListing(objList);
  };

  const openWantedModal = (targetId) => {
    let objList = wantedList[targetId];
    setIdWanted(objList.wanted_id);
    console.log(objList);
    setModalWantedVisible(true);
    setTargetListing(objList);
  };

  const updateWantedStatus = () => {
    console.log(idWanted);
    fetch(Globals.BASE_URL + "Maxauto/updateListingStatus/" + idWanted + "/1")
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          "Removed",
          "Wanted Listing has been removed",
          [
            {
              text: "OK",
              onPress: () => {
                setupPage();
                setModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const updateStatus = () => {
    fetch(Globals.BASE_URL + "Maxauto/updateListingStatus/" + id + "/1")
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          "Removed",
          "Listing has been removed",
          [
            {
              text: "OK",
              onPress: () => {
                setupPage();
                setModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const formatDate = (indate) => {
    return <Text>{indate}</Text>;
  };

  const editListing = () => {
    fetch(Globals.BASE_URL + "Maxauto/editListing", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceF: price,
        yearF: year,
        odoF: odo,
        engiF: engine,
        descF: desc,
        idVeh: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          "Updated",
          "Listing has been updated",
          [
            {
              text: "OK",
              onPress: () => {
                setupPage();
                setModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const removeDoc = (id: any) => {
    maxAuto.deleteDocument(id).then((result) => {
      console.log(result);
      //setWantedList(result.objWantedListing);
      //setLoading(false);
      setupPage();
    });
  };

  const renderDocType = (idType: any) => {
    console.log(idType);
    switch (idType) {
      case "0":
        return "Sales Agreement";
        break;
      case "1":
        return "Vehicle History Report";
        break;
      case "2":
        return "PPSR Report";
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={[
        MaStyles.container2,
        { marginHorizontal: 0, paddingHorizontal: 0, backgroundColor: "white" },
      ]}
    >
      <Grid>
        <Row style={{ paddingHorizontal: 10, height: 40 }}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 3 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={10}>
              <Text style={MaStyles.textHeaderScreenM}>My Documents</Text>
            </Col>
          </Grid>
        </Row>

        {/*         <Row style={{ marginTop: -12, paddingHorizontal: 10 }} size={2}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
          >
            <TouchableOpacity onPress={() => changeTab(1)} style={vehicleB()}>
              <Text style={vehicleLayer()}>Sale listings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeTab(2)} style={dealerB()}>
              <Text style={dealerLayer()}>Wanted listing</Text>
            </TouchableOpacity>

          </ScrollView>
        </Row> */}
        {!isLoading ? (
          <Row style={{ marginTop: -12 }} size={14}>
            <View style={{ width: "100%", marginTop: 20 }}>
              {listListings.length > 0 ? (
                <FlatList
                  style={{ paddingBottom: 30 }}
                  showsVerticalScrollIndicator={false}
                  data={listListings}
                  numColumns={1}
                  //onEndReached={loadMore}
                  extraData={refresh}
                  keyExtractor={(item) => item.vehicule_id}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: width,
                        margin: 8,
                        marginStart: 0,
                        borderRadius: 5,
                        marginBottom: 0,
                        backgroundColor: "white",
                        paddingHorizontal: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(Globals.BASE_URL + item.document_url);
                        }}
                      >
                        <Grid>
                          <Row>
                            <Col size={1}>
                              <Image
                                source={require("../../assets/images/pdfIcon.png")}
                                resizeMode="cover"
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginTop: 0,
                                  borderTopLeftRadius: 0,
                                  borderTopRightRadius: 0,
                                }}
                              />
                            </Col>
                            <Col style={{ paddingTop: 10 }} size={4}>
                              <Text style={MaStyles.subTextCardVehicleReport}>
                                {renderDocType(item.document_type)}
                                {item.rego}
                              </Text>
                              <Text style={MaStyles.TextCardMyDocumentDate}>
                                {" "}
                                {formatDate(item.indate)}
                              </Text>
                            </Col>
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "Remove Document",
                                  "Are you sure?",
                                  [
                                    {
                                      text: "Cancel",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                      style: "cancel",
                                    },
                                    {
                                      text: "OK",
                                      onPress: () =>
                                        removeDoc(item.document_id),
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={{
                                marginTop: -10,
                                right: 0,
                                position: "absolute",
                                width: 80,
                                height: 80,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <AntDesign
                                onPress={() => {
                                  Alert.alert(
                                    "Remove Document",
                                    "Are you sure?",
                                    [
                                      {
                                        text: "Cancel",
                                        onPress: () =>
                                          console.log("Cancel Pressed"),
                                        style: "cancel",
                                      },
                                      {
                                        text: "OK",
                                        onPress: () =>
                                          removeDoc(item.document_id),
                                      },
                                    ],
                                    { cancelable: false }
                                  );
                                }}
                                name="delete"
                                size={24}
                                color="#ea645e"
                              />
                            </TouchableOpacity>
                          </Row>
                        </Grid>

                        <View
                          style={{
                            margin: 8,
                            marginBottom: 13,
                            backgroundColor: "#737373",
                            height: 0.5,
                            marginTop: 10,
                          }}
                        ></View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <NotFoundScreen
                  titleText={"No Documents Found"}
                  subTitleText={
                    "You don’t have any documents here \n at the moment."
                  }
                  uriImage={require("../../assets/images/splash/notpdf.png")}
                />
              )}
            </View>
          </Row>
        ) : (
          <Row style={{width:"100%",alignContent:"center",marginStart:width/2-35}}>
          <Loader />
          </Row>
        )}
      </Grid>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: height,
            marginTop: 50,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >
        <Grid style={{ marginTop: -35, width: "100%" }}>
          <Row style={{ height: 40, marginTop: 0 }}>
            <Grid>
              <Col
                style={{ marginStart: 4, alignItems: "center" }}
                onPress={() => setModalVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeaderScreenM}>View listing</Text>
              </Col>
              <Col onPress={() => setModalVisible(false)}>
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </Row>

          <ScrollView showsVerticalScrollIndicator={false}>
            {targetListing.pic_url ? (
              <CachedImage
                source={{
                  uri: Globals.S3_THUMB_GRID_500 + targetListing.pic_url,
                }}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: 200,
                  marginTop: 10,
                }}
              />
            ) : (
              <Image
                source={require("../../assets/images/placecar.png")}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: 140,
                  marginTop: 10,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              />
            )}

            <Text
              style={[
                MaStyles.textHeader,
                {
                  marginTop: 12,
                  fontSize: 25,
                  color: "#0000009c",
                  textAlign: "center",
                },
              ]}
            >
              {targetListing.make_description} {targetListing.model_desc}
            </Text>

            <View
              style={{
                height: 0.5,
                backgroundColor: "#00000020",
                marginTop: 10,
              }}
            ></View>

            <Row style={{ height: 70, marginTop: 5 }}>
              <Col>
                <Text style={[MaStyles.titleInput3]}>Price</Text>
                <TextInput
                  onChangeText={(text) => {
                    setPrice(text);
                  }}
                  value={price}
                  keyboardType={"number-pad"}
                  placeholderTextColor={"gray"}
                  style={MaStyles.textInputRow2}
                />
              </Col>
              <Col>
                <Text style={[MaStyles.titleInput3]}>Year</Text>
                <TextInput
                  onChangeText={(text) => {
                    setYear(text);
                  }}
                  value={year}
                  keyboardType={"number-pad"}
                  placeholderTextColor={"gray"}
                  style={MaStyles.textInputRow2}
                />
              </Col>
            </Row>

            <Row style={{ height: 70 }}>
              <Col>
                <Text style={[MaStyles.titleInput3]}>Odometer</Text>
                <TextInput
                  onChangeText={(text) => {
                    setOdo(text);
                  }}
                  value={odo}
                  keyboardType={"number-pad"}
                  placeholderTextColor={"gray"}
                  style={MaStyles.textInputRow2}
                />
              </Col>
              <Col>
                <Text style={[MaStyles.titleInput3]}>Engine size (cc)</Text>
                <TextInput
                  onChangeText={(text) => {
                    setEngine(text);
                  }}
                  value={engine}
                  keyboardType={"number-pad"}
                  placeholderTextColor={"gray"}
                  style={MaStyles.textInputRow2}
                />
              </Col>
            </Row>

            <Row style={{ height: 260 }}>
              <Col>
                <Text style={[MaStyles.titleInput3]}>Description</Text>
                <TextInput
                  multiline={true}
                  onChangeText={(text) => {
                    setDesc(text);
                  }}
                  value={desc}
                  keyboardType={"number-pad"}
                  placeholderTextColor={"gray"}
                  style={MaStyles.textInputdescUpdate}
                />
              </Col>
            </Row>

            <Row style={{ height: 100 }}>
              <Col></Col>
            </Row>
          </ScrollView>

          {targetListing.delete_flag == 0 && (
            <Row style={{ position: "absolute", bottom: 0, marginBottom: 60 }}>
              <Col style={{ paddingHorizontal: 3 }}>
                <TouchableOpacity
                  onPress={() => updateStatus()}
                  style={MaStyles.viewDealerUpdateRed}
                >
                  <Text style={MaStyles.buttonTextC}>Withdraw listing</Text>
                </TouchableOpacity>
              </Col>

              <Col style={{ paddingHorizontal: 3 }}>
                <TouchableOpacity
                  onPress={() => editListing()}
                  style={MaStyles.viewDealerUpdate}
                >
                  <Text style={MaStyles.buttonTextC}>Update listing</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          )}
        </Grid>
      </Modal>

      <Modal
        onBackdropPress={() => setModalWantedVisible(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalWantedVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: 550,
            marginTop: height - 450,
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
                onPress={() => setModalWantedVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>View listing</Text>
              </Col>
              <Col onPress={() => setModalWantedVisible(false)}>
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </Row>

          {targetListing.pic_url ? (
            <CachedImage
              source={{
                uri: Globals.S3_THUMB_GRID_500 + targetListing.pic_url,
              }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 200,
                marginTop: 10,
              }}
            />
          ) : (
            <Image
              source={require("../../assets/images/placecar.png")}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 140,
                marginTop: 10,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            />
          )}

          <Text
            style={[
              MaStyles.textHeader,
              {
                marginTop: 12,
                fontSize: 25,
                color: "#0000009c",
                textAlign: "center",
              },
            ]}
          >
            {targetListing.make_description} {targetListing.model_desc}
          </Text>

          <Text
            style={[
              MaStyles.textHeader,
              {
                marginTop: 0,
                fontSize: 15,
                color: "#00000070",
                textAlign: "center",
              },
            ]}
          >
            {targetListing.wanted_price} / {targetListing.wanted_year}{" "}
          </Text>

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

        {targetListing.wanted_deleted == 0 && (
          <Row
            style={{
              height: 60,
              paddingHorizontal: 15,
              width: "100%",
              bottom: 0,
              alignSelf: "center",
              backgroundColor: "transparent",
              marginBottom: "15%",
            }}
          >
            <TouchableOpacity
              style={MaStyles.viewDealerUpdateRed}
              onPress={() => updateWantedStatus()}
            >
              <Text style={MaStyles.buttonTextC}>Withdraw listing</Text>
            </TouchableOpacity>
          </Row>
        )}
      </Modal>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
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

          <Grid style={{ marginTop: 100, position: "absolute" }}>
            <Row>
              <Text style={MaStyles.TextCardListView}></Text>
            </Row>
            <Row>
              <Text style={MaStyles.menuTitleBox}></Text>
            </Row>
          </Grid>
        </Grid>
      </Modal>
    </View>
  );
}
