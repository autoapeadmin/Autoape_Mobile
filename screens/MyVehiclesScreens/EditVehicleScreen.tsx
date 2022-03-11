import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  AsyncStorage,
  ScrollView,
  TouchableHighlight,
  Button,
  Image,
  Picker,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import MaStyles from "../../assets/styles/MaStyles";
import { ListCarStackParamList } from "../../types";
import Globals from "../../constants/Globals";
import { AntDesign } from "@expo/vector-icons";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Card } from "react-native-elements";
import { Vehicle } from "../../types";
import { TextInputMask } from "react-native-masked-text";
import * as ImagePicker from "expo-image-picker";
import { ImageBrowser } from "expo-image-picker-multiple";
import Modal from "react-native-modal";
import { ModalSelectList } from "react-native-modal-select-list";
import { FlatList } from "react-native-gesture-handler";
import { CheckBox } from "native-base";
import LottieView from "lottie-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { dateFormat1 } from "../../utils/DateFunctions";
import maxAuto from "../../api/maxAuto";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function EditVehicleScreen({
  navigation,
}: StackScreenProps<ListCarStackParamList, "CheckRego">) {
  const [updatePhoto, setUpdatePhoto] = useState(true);

  const height = Dimensions.get("window").height;

  const [loading, setLoading] = useState(false);

  const [imageVisible, setImageVisible] = useState(false); //could b
  const [regoPoliceOk, setRegoPoliceOk] = useState();

  const [rego, setRego] = useState("");

  const [locationLabel, setLocationLabel] = useState("Wellington ");

  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  const [regoDate, setRegoDate] = useState("");
  const [wof, setWof] = useState("");

  const [regoDateR, setRegoDateR] = useState(new Date());
  const [wofR, setWofR] = useState(new Date());

  const [priceCar, setPriceCar] = useState("");

  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(true);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [page6, setPage6] = useState(false);
  const [paymentPage, setPaymentPage] = useState(false);

  const [scrollEnable, setScrollEnablie] = useState(true);

  const [localImage, setLocalImage] = useState([]);
  const [multipleUrl, setMultipleUrl] = useState([]);

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [stripeId, setStripeID] = useState("");

  const [photoResume, setPhotoResume] = useState("");
  const [price, setPrice] = useState();

  const [isFocused, setIsFocused] = useState("");

  const [regoVehicule, setRegoVehicule] = useState<Vehicle>();
  const [imgDB, setImgDB] = useState("");
  const [isImgNew, setIsImgNew] = useState(false);

  const [regoModal, setRegoModal] = useState(false);
  const [wofModal, setWofModal] = useState(false);

  const [title, setTitle] = useState("My Vehicles");

  const [newRego, setNewRego] = useState(false);
  const [newWof, setNewWof] = useState(false);
  const [idVehicle, setIdVehicle] = useState("");

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    const myArray = await AsyncStorage.getItem("myVehicleEdit");
    const myVehicle = JSON.parse(myArray);
    console.log(myVehicle);
    setImgDB(Globals.S3_THUMB_GRID + myVehicle.pic_url);
    setRegoDate(dateFormat1(myVehicle.vehicle_rego));
    setWof(dateFormat1(myVehicle.vehicle_wof));
    setRego(myVehicle.vehicle_registration);
    setTitle(myVehicle.vehicle_title);
    setIdVehicle(myVehicle.vehicle_id);

    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    let email = await AsyncStorage.getItem("customer_email");
    let id = await AsyncStorage.getItem("customer_id");

    console.log(id);

    setId(id);
    setEmail(email);

    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("No tenemos los permisos necesarios!");
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS == "android"
            ? Location.Accuracy.Lowest
            : Location.Accuracy.Lowest,
      });

      if (location != null) {
        setLat(location.coords.latitude.toString());
        setLong(location.coords.longitude.toString());
      }
    }
  };

  const deleteImage = (id) => {
    console.log(id);
    setLocalImage(localImage.filter((item) => item.filename !== id));
  };

  //

  //style evaluation
  const locationL = () => {
    if (locationLabel == "") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const uploadImages = async (idCar) => {
    //hacer un for y el i++ ponerlo cuando obtenga la respuesta de la base de datos

    //        let index = 0;

    for (let photo of localImage) {
      //uri
      let localUri = photo["localUri"];
      console.log("Local:" + localUri);
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
        let url = Globals.BASE_URL + "Maxauto/editMyCarImage/" + idCar;

        const fetchResponse = await fetch(url, setting);

        //console.log(fetchResponse.blob);
        const data = await fetchResponse.json();

        if (photoResume == "") {
          setPhotoResume(data.data);
        }

        setLoading(false);
      } catch (e) {}
      //index++;
    }

    navigation.goBack();
  };

  const selectImage = () => {
    setImageVisible(false);
    setUpdatePhoto(!updatePhoto);
    setIsImgNew(true);
  };

  const compressImage = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 400 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
    );
    return file;
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

  const callBackImg = (callback) => {
    //console.log(callback);
    const cPhotos = [];
    callback.then(async (photos) => {
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

  const logout = async () => {
    await AsyncStorage.setItem("logged", "false");
    await AsyncStorage.setItem("customer_id", "0");

    fetch(Globals.BASE_URL + "Maxauto/signOut")
      .then((response) => response.json())
      .then((data) => {
        //setListMake(data.data);
      });

      navigation.replace("Root");
  };

  const goRightCar = () => {
    if (rego.toLowerCase() == "") {
      Linking.openURL("https://rightcar.govt.nz/");
    } else {
      Linking.openURL("https://rightcar.govt.nz/detail?plate=" + rego);
    }
  };

  const go6 = () => {
    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(false);
    setPage5(false);
    setPage6(true);
  };

  const selectRegoDate = (regoDate) => {
    setNewRego(true);
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setRegoModal(false);
    setRegoDate(regoNew);
    setRegoDateR(regoDate.dateString);
  };

  const selectWOFDate = (wofDate) => {
    setNewWof(true);
    let regoNew = dateFormat1(wofDate.dateString);
    console.log(wofDate);
    setWofModal(false);
    setWof(regoNew);
    setWofR(wofDate.dateString);
    //  setWo(wofDate);
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowD;
    } else {
      return MaStyles.textInputRowD;
    }
  };
  const styleFocusDesc = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelectedDesc;
    } else {
      return MaStyles.textInputRowDesc;
    }
  };

  const callDelete = () =>{
    maxAuto.deleteMyVehicle(idVehicle);
    navigation.goBack();
  }

  const deleteCar = () =>
    Alert.alert(
      "Are you sure?",
      "Vehicle will be deleted",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => callDelete() }
      ],
      { cancelable: false }
    );

  const listCar = () => {
    //get Values to List
    setPaymentPage(false);
    setLoading(true);
    console.log("aca");

    if (newWof || newRego) {
      fetch(Globals.BASE_URL + "Maxauto/editMyCar/" + idVehicle, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateWof: wofR,
          dateRego: regoDateR,
          isWof: newWof,
          isRego: newRego,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data);

          if (isImgNew) {
            uploadImages(idVehicle);
          } else {
            navigation.goBack();
          }

          //saveImage
        });
    } else {
      if (isImgNew) {
        uploadImages(idVehicle);
      } else {
        navigation.goBack();
      }
    }

    //photos
    //console.log(bodyF);
    //redirect to the pay
  };

  return (
    <View style={MaStyles.containerWhite}>
      {/* Segunda Pantalla */}
      {page2 && (
        <KeyboardAwareScrollView
          enableAutomaticScroll={Platform.OS === "ios"}
          behavior={"padding"}
          style={{ width: "100%", height: 1000 }}
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
            <Col size={10} onPress={() => navigation.goBack()}>
              <Text style={MaStyles.textHeader}>{title}</Text>
            </Col>
          </Grid>

          <Grid></Grid>

          <Grid style={{ width: "100%" }}>
            {imgDB.length == 0 ? (
              isImgNew == false && (
                <TouchableOpacity onPress={() => setImageVisible(true)}>
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: "center",
                    }}
                    source={require("../../assets/lottie/imageload.gif")}
                  />
                </TouchableOpacity>
              )
            ) : (
              <View style={{ height: 200, width: "100%" }}>
                <Image
                  source={{ uri: imgDB }}
                  style={{ width: "100%", height: 200, marginTop: 20 }}
                />
                <View
                  style={{
                    marginTop: -190,
                    alignSelf: "flex-start",
                    borderRadius: 30,
                    height: 30,
                    width: 30,
                    marginStart: 4,
                  }}
                ></View>
                <TouchableOpacity
                  onPress={() => setImgDB("")}
                  style={{
                    backgroundColor: "#e90c0c",
                    marginTop: -30,
                    marginEnd: 13,
                    alignSelf: "flex-end",
                    borderRadius: 30,
                    height: 30,
                    width: 30,
                  }}
                >
                  <AntDesign
                    name="delete"
                    size={18}
                    color="white"
                    style={{ marginTop: 5, marginStart: 6 }}
                  />
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={localImage}
              style={{ alignSelf: "center", marginTop: 20 }}
              numColumns={2}
              renderItem={({ item, index }) => (
                <View style={{ height: 200, width: "100%" }}>
                  <Image
                    source={{ uri: item.localUri }}
                    style={{ width: "100%", height: 200 }}
                  />
                  <View
                    style={{
                      marginTop: -190,
                      alignSelf: "flex-start",
                      borderRadius: 30,
                      height: 30,
                      width: 30,
                      marginStart: 4,
                    }}
                  ></View>
                  <TouchableOpacity
                    onPress={() => deleteImage(item.filename)}
                    style={{
                      backgroundColor: "#e90c0c",
                      marginTop: -30,
                      marginEnd: 13,
                      alignSelf: "flex-end",
                      borderRadius: 30,
                      height: 30,
                      width: 30,
                    }}
                  >
                    <AntDesign
                      name="delete"
                      size={18}
                      color="white"
                      style={{ marginTop: 5, marginStart: 6 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>

            <Modal
              isVisible={imageVisible}
              deviceHeight={height}
              animationIn={"slideInUp"}
              style={[
                MaStyles.container,
                {
                  backgroundColor: "white",
                  maxHeight: height,
                  //marginTop: height,
                  marginHorizontal: 0,
                  marginVertical: 0,
                  borderTopStartRadius: 30,
                  borderTopEndRadius: 30,
                  flexDirection: "column",
                  justifyContent: "space-between",
                },
              ]}
            >
              <View style={{ flex: 1, marginTop: 45, width: "100%" }}>
                <Grid style={{ marginHorizontal: 20 }}>
                  <Col size={2}>
                    <Text style={[MaStyles.subText, { marginTop: 30 }]}>
                      SELECT UP TO 15 PHOTOS
                    </Text>
                  </Col>
                  <Col size={1} onPress={() => selectImage()}>
                    <View style={MaStyles.buttonView}>
                      <Text style={MaStyles.buttonText}>DONE</Text>
                    </View>
                  </Col>
                </Grid>
              </View>
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

            <Text style={[MaStyles.titleInputRego, { marginTop: 20 }]}>
              Plate Number or VIN
            </Text>

            <Row style={{ marginTop: 15, height: 40 }}>
              <Col>
                <TextInput
                  editable={false}
                  onBlur={() => {
                    //checkRego();
                    setIsFocused("");
                  }}
                  placeholderTextColor={"#d4d3d9"}
                  placeholder={"e.g: SSAA1"}
                  style={styleFocus("rego")}
                  onFocus={() => setIsFocused("rego")}
                  onChangeText={(text) => setRego(text)}
                  value={rego}
                />

                {regoPoliceOk == false ? (
                  <AntDesign
                    style={{
                      position: "absolute",
                      alignSelf: "flex-end",
                      marginTop: 28,
                      paddingEnd: 20,
                    }}
                    name="exclamationcircleo"
                    size={24}
                    color="#bc11119e"
                  />
                ) : (
                  <Text style={{ display: "none" }}>asd</Text>
                )}
                {regoPoliceOk == true ? (
                  <AntDesign
                    style={{
                      position: "absolute",
                      alignSelf: "flex-end",
                      marginTop: 28,
                      paddingEnd: 20,
                    }}
                    name="checkcircleo"
                    size={24}
                    color="#129912b5"
                  />
                ) : (
                  <Text style={{ display: "none" }}>Police checked</Text>
                )}
              </Col>
            </Row>
            <Row
              onPress={() => goRightCar()}
              style={{ marginTop: 5, height: 40 }}
            >
              <Text
                style={[
                  MaStyles.titleInput,
                  { color: "gray", fontSize: 14, marginTop: 8 },
                ]}
              >
                2010 Nissan Note
              </Text>
            </Row>
            <Row style={{ marginTop: -10, height: 45 }}>
              <Text style={[MaStyles.titleInput]}>Registration Due</Text>
            </Row>

            <Row style={{ marginTop: 10, height: 40 }}>
              <Col>
                <Text
                  style={locationL()}
                  onPress={(value) => setRegoModal(true)}
                >
                  {regoDate}
                </Text>
              </Col>
            </Row>

            <Row style={{ marginTop: 5, height: 45 }}>
              <Text style={[MaStyles.titleInput]}>WOF Due</Text>
            </Row>

            <Row style={{ marginTop: 10, height: 40 }}>
              <Col>
                <Text
                  style={locationL()}
                  onPress={(value) => setWofModal(true)}
                >
                  {wof}
                </Text>
              </Col>
            </Row>

            <Row style={{ marginTop: 5, height: 45 }}>
              <Text onPress={()=> deleteCar()} style={[MaStyles.titleInput, { color: "red" }]}>
                Delete Vehicle
              </Text>
            </Row>

            <Row style={{ marginTop: 15, height: 40, marginBottom: 100 }}>
              <Col>
                <TouchableOpacity
                  style={{ marginTop: 0 }}
                  onPress={() => listCar()}
                >
                  <View style={MaStyles.buttonView}>
                    <Text style={MaStyles.buttonText}>Update</Text>
                  </View>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </KeyboardAwareScrollView>
      )}
      {/* Fin Segunda Pantalla */}
      <Modal
        onBackButtonPress={() => setRegoModal(false)}
        onBackdropPress={() => setRegoModal(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={regoModal}
        style={[
          MaStyles.container,
          {
            backgroundColor: "white",
            maxHeight: 400,
            marginTop: height - 400,
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
          <Row style={{ marginTop: 25, marginStart: 10, height: 40 }}>
            <Text style={MaStyles.TextCardListView}>
              Select REGO expire date
            </Text>
          </Row>
          <Row style={{ width: "100%" }}>
            <Calendar
              onDayPress={(day) => {
                selectRegoDate(day);
              }}
              style={styles.calendar}
              hid
            />
          </Row>
        </Grid>
      </Modal>

      <Modal
        onBackButtonPress={() => setWofModal(false)}
        onBackdropPress={() => setWofModal(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={wofModal}
        style={[
          MaStyles.container,
          {
            backgroundColor: "white",
            maxHeight: 400,
            marginTop: height - 400,
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
          <Row style={{ marginTop: 25, marginStart: 10, height: 40 }}>
            <Text style={MaStyles.TextCardListView}>
              Select WOF expire date
            </Text>
          </Row>
          <Row style={{ width: "100%" }}>
            <Calendar
              onDayPress={(day) => {
                selectWOFDate(day);
              }}
              style={styles.calendar}
              hid
            />
          </Row>
        </Grid>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
    width: width - 40,
  },
  switchContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  switchText: {
    margin: 10,
    fontSize: 16,
  },
  text: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "lightgrey",
    fontSize: 16,
  },
  disabledText: {
    color: "grey",
  },
  defaultText: {
    color: "purple",
  },
  customCalendar: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  customDay: {
    textAlign: "center",
  },
  customHeader: {
    backgroundColor: "#FCC",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: -4,
    padding: 8,
  },
});
