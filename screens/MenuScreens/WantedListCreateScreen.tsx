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
  Modal,
  KeyboardAvoidingView,
  Platform,
  Linking,Dimensions
} from "react-native";
import MaStyles from "../../assets/styles/MaStyles";
import { ListCarStackParamList, WantedListStackParamList } from "../../types";
import Globals from "../../constants/Globals";
import { AntDesign } from "@expo/vector-icons";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Card } from "react-native-elements";
import { Vehicle } from "../../types";
import { TextInputMask } from "react-native-masked-text";
import * as ImagePicker from "expo-image-picker";
import { ImageBrowser } from "expo-image-picker-multiple";
import { ModalSelectList } from "react-native-modal-select-list";
import ModalR from "react-native-modal";
import { FlatList } from "react-native-gesture-handler";
import { CheckBox } from "native-base";
import LottieView from "lottie-react-native";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import maxAuto from "../../api/maxAuto";
import TextAnimator from "../../utils/TextAnimator";
import {StripeCheckout} from "react-native-stripe-checkout-webview";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function WantedListCreateScreen({
  navigation,
}: StackScreenProps<WantedListStackParamList, "WantedCreate">) {
  const [updatePhoto, setUpdatePhoto] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  const [dw4, setDw4] = useState(false);

  const [imageVisible, setImageVisible] = useState(false); //could b
  const [regoPoliceOk, setRegoPoliceOk] = useState();
  const { goBack } = navigation;

  const [rego, setRego] = useState("");
  const [paymentPage, setPaymentPage] = useState(false);

  const [sended, setSended] = useState(false);
  const [regoResult, setRegoResult] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [stripeId, setStripeID] = useState("");

  const [regoNotFound, setNotFound] = useState(true);
  const [listRegion, setRegionList] = useState([]);
  const [listMake, setListMake] = useState([]);
  const [listModel, setListModel] = useState([]);

  const [locationLabel, setLocationLabel] = useState("Wellington ");

  const [bodyLabel, setBodyLabel] = useState("Body Type");

  const [makeLabel, setMakeLabel] = useState("Toyota ");
  const [modelLabel, setModelLabel] = useState("Camry ");

  const [yearLabelFrom, setYearLabelFrom] = useState();
  const [yearLabelTo, setYearLabelTo] = useState();
  const [odoLabel, setOdome] = useState();
  const [bodyType, setBodyType] = useState("Body Style");
  const [transL, setTransL] = useState("Transmission");
  const [fuelL, setFuelL] = useState("Fuel Type");

  const [regionId, setRegionId] = useState("0");
  const [makeId, setMakeId] = useState("0");
  const [modelId, setModelId] = useState("0");
  const [bodyId, setBodyId] = useState("0");
  const [engineSize, setEngineSize] = useState("0");
  const [fuelType, setFuelType] = useState("0");
  const [trasmission, setTransmission] = useState("0");
  const [desc, setDesc] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(true);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [page6, setPage6] = useState(false);

  const [scrollEnable, setScrollEnablie] = useState(true);

  const [localImage, setLocalImage] = useState([]);
  const [multipleUrl, setMultipleUrl] = useState([]);

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [photoResume, setPhotoResume] = useState("");
  const [priceTo, setPriceTo] = useState();
  const [priceFrom, setPriceFrom] = useState();

  const [regoVehicule, setRegoVehicule] = useState<Vehicle>();

  // Modal con filtro
  let modalRef;
  const openModal = () => modalRef.show();
  const saveModalRef = (ref) => (modalRef = ref);
  const onSelectedOption = (value) => {
    let res = value.split("|");
    regionSelected(res[0], res[1]);
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .slice(0, -2);
  };

  const listCar = () => {
    //get Values to List
    setLoading(true);
    setSended(true);
    setClicked(true);

    let price = "$" +  format(priceFrom) + " - " + "$" + format(priceTo);
    let year = yearLabelFrom + " - " + yearLabelTo;

    fetch(Globals.BASE_URL + "Maxauto/listWantedList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fk_region: regionId,
        priceF: price,
        makeF: makeId,
        modelF: modelId,
        yearF: year,
        phoneF: phone,
        emailF: email,
        customerId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        uploadImages(data.data);
        //saveImage
      });

    //photos
    //console.log(bodyF);
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

  let modalRef2;
  const openModal2 = () => {
    if (!regoResult) modalRef2.show();
  };
  const saveModalRef2 = (ref2: any) => (modalRef2 = ref2);
  const onSelectedOption2 = (value: any) => {
    let res = value.split("|");
    makeSelected(res[0], res[1]);
    //openModal3();
  };

  const createStaticModalOptions2 = () => {
    const options = [];
    for (let i = 0; i < listMake.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listMake[i].make_description,
        value: listMake[i].make_id + "|" + listMake[i].make_description,
      });
    }
    return options;
  };

  const modalOptionsProvider2 = ({ page, pageSize, customFilterKey2 }) => {
    let options = [];
    for (let i = 0; i < listMake.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listMake[i].make_description,
        value: listMake[i].make_id + "|" + listMake[i].make_description,
      });
    }
    //console.log(customFilterKey2);
    if (!!customFilterKey2) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey2}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions2 = createStaticModalOptions2();

  let modalRef3;
  const openModal3 = () => {
    if (!regoResult) modalRef3.show();
  };

  const saveModalRef3 = (ref3) => (modalRef3 = ref3);
  const onSelectedOption3 = (value) => {
    let res = value.split("|");
    modelSelected(res[0], res[1]);
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
  // Fin modal con filtro
  let modalRef4;
  const openModal4 = () => {
    modalRef4.show();
  };

  const saveModalRef4 = (ref4) => (modalRef4 = ref4);
  const onSelectedOption4 = (value) => {
    let res = value.split("|");
    //modelSelected(res[0], res[1])
    setBodyLabel(res[0]);
    setBodyId(res[1]);
  };

  const createStaticModalOptions4 = () => {
    const options = [];

    const listBody = [
      {
        value: 0,
        desc: "Convertible",
      },
      {
        value: 1,
        desc: "Coupe",
      },
      {
        value: 2,
        desc: "Hatchback",
      },
      {
        value: 3,
        desc: "Sedan",
      },
      {
        value: 4,
        desc: "Station Wagon",
      },
      {
        value: 5,
        desc: "RV/SUV",
      },
      {
        value: 6,
        desc: "Ute",
      },
      {
        value: 7,
        desc: "Van",
      },
      {
        value: 8,
        desc: "Other",
      },
    ];

    for (let i = 0; i < listBody.length; i++) {
      //  console.log(listBody[i]);
      options.push({ label: listBody[i].desc, value: listBody[i].value });
    }
    return options;
  };

  const modalOptionsProvider4 = ({ page, pageSize, customFilterKey4 }) => {
    let options = [];

    const listBody = [
      {
        value: 0,
        desc: "Convertible",
      },
      {
        value: 1,
        desc: "Coupe",
      },
      {
        value: 2,
        desc: "Hatchback",
      },
      {
        value: 3,
        desc: "Sedan",
      },
      {
        value: 4,
        desc: "Station Wagon",
      },
      {
        value: 5,
        desc: "RV/SUV",
      },
      {
        value: 6,
        desc: "Ute",
      },
      {
        value: 7,
        desc: "Van",
      },
      {
        value: 8,
        desc: "Other",
      },
    ];
    for (let i = 0; i < listBody.length; i++) {
      //  console.log(listBody[i]);
      options.push({
        label: listBody[i].desc,
        value: listBody[i].desc + "|" + listBody[i].value,
      });
    }
    //  console.log(customFilterKey4);
    if (!!customFilterKey4) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey4}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions4 = createStaticModalOptions4();

  let modalRef5;
  const openModal5 = () => {
    modalRef5.show();
  };

  const saveModalRef5 = (ref5) => (modalRef5 = ref5);
  const onSelectedOption5 = (value) => {
    let res = value.split("|");
    //modelSelected(res[0], res[1])
    setTransmission(res[1]);
    setTransL(res[0]);
  };

  const createStaticModalOptions5 = () => {
    const options = [];

    const listBody = [
      {
        value: 0,
        desc: "Manual",
      },
      {
        value: 1,
        desc: "Automatic",
      },
    ];

    for (let i = 0; i < listBody.length; i++) {
      //  console.log(listBody[i]);
      options.push({ label: listBody[i].desc, value: listBody[i].value });
    }
    return options;
  };

  const modalOptionsProvider5 = ({ page, pageSize, customFilterKey5 }) => {
    let options = [];

    const listBody = [
      {
        value: 0,
        desc: "Manual",
      },
      {
        value: 1,
        desc: "Automatic",
      },
    ];
    for (let i = 0; i < listBody.length; i++) {
      //    console.log(listBody[i]);
      options.push({
        label: listBody[i].desc,
        value: listBody[i].desc + "|" + listBody[i].value,
      });
    }
    //      console.log(customFilterKey5);
    if (!!customFilterKey5) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey4}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions5 = createStaticModalOptions5();

  let modalRef6;
  const openModal6 = () => {
    modalRef6.show();
  };

  const saveModalRef6 = (ref6) => (modalRef6 = ref6);
  const onSelectedOption6 = (value) => {
    let res = value.split("|");
    //modelSelected(res[0], res[1])
    setFuelType(res[1]);
    setFuelL(res[0]);
  };

  const createStaticModalOptions6 = () => {
    const options = [];

    const listBody = [
      {
        value: 0,
        desc: "Petrol",
      },
      {
        value: 1,
        desc: "Diesel",
      },
      {
        value: 2,
        desc: "Hybrid",
      },
      {
        value: 3,
        desc: "Plug-in hybrid",
      },
      {
        value: 4,
        desc: "Electric",
      },
      {
        value: 5,
        desc: "LPG",
      },
      {
        value: 6,
        desc: "Alternative",
      },
    ];

    for (let i = 0; i < listBody.length; i++) {
      //  console.log(listBody[i]);
      options.push({ label: listBody[i].desc, value: listBody[i].value });
    }
    return options;
  };

  const modalOptionsProvider6 = ({ page, pageSize, customFilterKey6 }) => {
    let options = [];

    const listBody = [
      {
        value: 0,
        desc: "Petrol",
      },
      {
        value: 1,
        desc: "Diesel",
      },
      {
        value: 2,
        desc: "Hybrid",
      },
      {
        value: 3,
        desc: "Plug-in hybrid",
      },
      {
        value: 4,
        desc: "Electric",
      },
      {
        value: 5,
        desc: "LPG",
      },
      {
        value: 6,
        desc: "Alternative",
      },
    ];

    for (let i = 0; i < listBody.length; i++) {
      //  console.log(listBody[i]);
      options.push({
        label: listBody[i].desc,
        value: listBody[i].desc + "|" + listBody[i].value,
      });
    }

    if (!!customFilterKey6) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey4}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions6 = createStaticModalOptions6();

  //enviar imagen al backend esc

  //variales del vehiculo

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    fetch(Globals.BASE_URL + "Maxauto/allPlacesList")
      .then((response) => response.json())
      .then((data) => {
        setRegionList(data.data.region_list);
      });

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

    fetch(Globals.BASE_URL + "Maxauto/getAllMake")
      .then((response) => response.json())
      .then((data) => {
        setListMake(data.data);
      });

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

  const checkRego = () => {
    fetch(Globals.BASE_URL + "Maxauto/checkREGO/" + rego.toLowerCase())
      .then((response) => response.json())
      .then((data) => {
        //
        //console.log(data.data);
        setRegoPoliceOk(data.data);
      });
  };

  const regionSelected = (idRegion: string, nameRegion: string) => {
    //console.log(nameRegion)
    //setModalVisible(false);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
  };

  const makeSelected = (idMake: string, makeName: string) => {
    setMakeLabel(makeName);
    setMakeId(idMake);

    fetch(Globals.BASE_URL + "Maxauto/getModels/" + idMake)
      .then((response) => response.json())
      .then((data) => {
        setListModel(data.data);
      });
  };

  const modelSelected = (idMake: string, makeName: string) => {
    setModelLabel(makeName);
    setModelId(idMake);
  };

  const deleteImage = (id) => {
    console.log(id);
    setLocalImage(localImage.filter((item) => item.filename !== id));
  };

  //

  //style evaluation
  const locationL = () => {
    if (locationLabel == "Wellington ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };


  const makeL = () => {
    if (makeLabel == "Toyota ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const modelL = () => {
    if (modelLabel == "Camry ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const bodyL = () => {
    if (bodyType == "Body Style") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const yearL = () => {
    if (locationLabel == "Year") {
      return {
        height: 50,
        width: "98%",
        borderWidth: 1,
        paddingHorizontal: 15,
        backgroundColor: "white",
        shadowColor: "rgba(0,0,0, .001)",
        shadowOffset: { height: 0, width: 0 },
        borderColor: "#EBEBEB",
        shadowOpacity: 0,
        color: "gray",
        shadowRadius: 0,
        borderRadius: 5,
        paddingTop: 0,
      };
    } else {
      return {
        height: 50,
        width: "98%",
        borderWidth: 1,
        paddingHorizontal: 15,
        backgroundColor: "white",
        shadowColor: "rgba(0,0,0, .001)",
        shadowOffset: { height: 0, width: 0 },
        borderColor: "#EBEBEB",
        shadowOpacity: 0,
        color: "black",
        shadowRadius: 0,
        borderRadius: 5,
        paddingTop: 0,
      };
    }
  };

  const odoL = () => {
    if (locationLabel == "Odometer") {
      return {
        height: 40,
        width: "98%",
        borderWidth: 1,
        paddingHorizontal: 15,
        backgroundColor: "white",
        shadowColor: "rgba(0,0,0, .001)",
        shadowOffset: { height: 0, width: 0 },
        borderColor: "#EBEBEB",
        shadowOpacity: 0,
        color: "gray",
        shadowRadius: 0,
        borderRadius: 5,
        paddingTop: 0,
      };
    } else {
      return {
        height: 40,
        width: "98%",
        borderWidth: 1,
        paddingHorizontal: 15,
        backgroundColor: "white",
        shadowColor: "rgba(0,0,0, .001)",
        shadowOffset: { height: 0, width: 0 },
        borderColor: "#EBEBEB",
        shadowOpacity: 0,
        color: "black",
        shadowRadius: 0,
        borderRadius: 5,
        paddingTop: 0,
      };
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
        let url =
          Globals.BASE_URL + "Maxauto/uploadCarPhotoWantedList/" + idCar;

        const fetchResponse = await fetch(url, setting);

        //console.log(fetchResponse.blob);
        const data = await fetchResponse.json();

        if (photoResume == "") {
          setPhotoResume(data.data);
        }
      } catch (e) {}
      //index++;
    }

    go6();
  };

  const selectImage = () => {
    setImageVisible(false);
    setUpdatePhoto(!updatePhoto);
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

  const goRightCar = () => {
    if (rego.toLowerCase() == "") {
      Linking.openURL("https://rightcar.govt.nz/");
    } else {
      Linking.openURL("https://rightcar.govt.nz/detail?plate=" + rego);
    }
  };

  const goPayment = () => {
    /* Stripe.setOptionsAsync({
            publishableKey: 'pk_live_ifr9BuCfghqrG7NoJKabA0ws', // Your key
            androidPayMode: 'test', // [optional] used to set wallet environment (AndroidPay)
            merchantId: 'your_merchant_id', // [optional] used for payments with ApplePay
        }); */

    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(false);
    setPage5(true);

    listCar();
  };

  //change between pages

  const go2 = () => {
    setPage1(false);
    setPage2(true);
    setPage3(false);
    setPage4(false);
  };

  const go3 = () => {
    setPage1(false);
    setPage2(false);
    setPage3(true);
    setPage4(false);
    const listPhotos = [];
    //console.log("************************************");
    for (let photo of localImage) {
      let photoi = [
        {
          file_number: photo.index2,
          file_name: photo.filename,
          file_uri: photo.localUri,
        },
      ];

      listPhotos.push(photoi);
    }
    //console.log(listPhotos);
    //console.log("************************************");
  };

  const go4 = () => {
    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(true);
  };

  const go5 = async () => {
    const priceMoto2 = await AsyncStorage.getItem('priceCar');
    maxAuto.getSessionStripe(priceMoto2).then((result) => {
      console.log(result);
      setStripeID(result);
      setPaymentPage(true);
    });
  };

  const go6 = () => {
    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(false);
    setPage5(false);
    setPage6(true);
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      {/* Primera Pantalla */}
      {page2 && (
        <View style={MaStyles.containerWhite}>
          <KeyboardAwareScrollView
            enableAutomaticScroll={Platform.OS === "ios"}
            behavior={"padding"}
            style={{ width: "100%", height: 1000 }}
          >
            <Text style={MaStyles.textHeader}>Wanted listing</Text>
           

            <Grid>
       
            <Row style={{height: 34}}>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                  
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={MaStyles.buttonTextWhiteN}>
                      <AntDesign name="left" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={3} style={{height: 20}}>
                  <TouchableOpacity style={MaStyles.buttonViewN}>
                    <Text style={MaStyles.buttonTextNear}>Vehicle Details</Text>
                  </TouchableOpacity>
                </Col>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                     go3()
                    }}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={[MaStyles.buttonTextWhiteN,{marginStart:4}]}>
                      <AntDesign name="right" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>

          </Grid>

            <Grid style={{}}>
              <Row style={{ marginTop: 20, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Location</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <Text style={locationL()} onPress={(value) => openModal()}>
                    {locationLabel}
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginTop: 5, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Make</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <Text style={makeL()} onPress={(value) => openModal2()}>
                    {makeLabel}
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginTop: 5, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Model</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <Text style={modelL()} onPress={(value) => openModal3()}>
                    {modelLabel}
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginTop: 5, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Price Range</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col size={3}>
                  <TextInputMask
                    placeholder="$5,000"
                    style={MaStyles.textInputRow}
                 placeholderTextColor={"#d4d3d9"}
                    type={"money"}
                    options={{
                      precision: 0,
                      separator: ".",
                      delimiter: ",",
                      unit: "$",
                      suffixUnit: "",
                    }}
                    value={priceFrom}
                    onChangeText={text => {
                      console.log(text);
                      setPriceFrom(text);
                    }}
                  />
                </Col>
                <Col size={1}>
                  <Text
                    style={[
                      MaStyles.titleInput2,
                      { alignContent: "center", textAlign: "center" },
                    ]}
                  >
                    {" "}
                    to{" "}
                  </Text>
                </Col>
                <Col size={3}>
                  <TextInputMask
                    placeholder="$10,000"
                    style={MaStyles.textInputRow}
                 placeholderTextColor={"#d4d3d9"}
                    type={"money"}
                    options={{
                      precision: 0,
                      separator: ".",
                      delimiter: ",",
                      unit: "$",
                      suffixUnit: "",
                    }}
                    value={priceTo}
                    onChangeText={text => {
                      setPriceTo(text);
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 5, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Year Range</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40, zIndex: 1000,paddingBottom:100 }}>
                <Col size={3}>
                  <TextInputMask
                    placeholder="2010"
                    editable={regoNotFound}
                    style={yearL()}
                    maxLength={4}
                 placeholderTextColor={"#d4d3d9"}
                    type={"only-numbers"}
                    options={{
                      precision: 0,
                      separator: ".",
                      delimiter: ",",
                      unit: "$",
                      suffixUnit: "",
                    }}
                    value={yearLabelFrom}
                    onChangeText={(text) => {
                      setYearLabelFrom(text);
                    }}
                  />
                </Col>

                <Col size={1}>
                  <Text
                    style={[
                      MaStyles.titleInput2,
                      { alignContent: "center", textAlign: "center" },
                    ]}
                  >
                    {" "}
                    to{" "}
                  </Text>
                </Col>

                <Col size={3}>
                  <TextInputMask
                    placeholder="2021"
                    editable={regoNotFound}
                    style={yearL()}
                    maxLength={4}
                 placeholderTextColor={"#d4d3d9"}
                    type={"only-numbers"}
                    options={{
                      precision: 0,
                      separator: ".",
                      delimiter: ",",
                      unit: "$",
                      suffixUnit: "",
                    }}
                    value={yearLabelTo}
                    onChangeText={(text) => {
                      setYearLabelTo(text);
                    }}
                  />
                </Col>
              </Row>
              <Row style={{marginTop: -15, height: 40, marginBottom:100}}>
              <Col>
                <TouchableOpacity style={{marginTop: 0}} onPress={() => go3()}>
                  <View style={MaStyles.buttonView}>
                    <Text style={MaStyles.buttonText}>Continue</Text>
                  </View>
                </TouchableOpacity>
              </Col>
            </Row>
            </Grid>
         
          </KeyboardAwareScrollView>
          
        </View>
      )}

      {/* Fin Segunda Pantalla */}

      {/* Tercera Pantalla */}
      {page3 && (
       <View style={MaStyles.containerWhite}>
       <View style={{maxHeight:height,height:height,width:"100%"}}>
            <Grid>
            <Text style={MaStyles.textHeader}>Wanted listing</Text>
          
                <Row style={{height: 34}}>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                      go2()
                     }}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={MaStyles.buttonTextWhiteN}>
                      <AntDesign name="left" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={3} style={{height: 20}}>
                  <TouchableOpacity style={MaStyles.buttonViewN}>
                    <Text style={MaStyles.buttonTextNear}>Photos</Text>
                  </TouchableOpacity>
                </Col>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                     go4()
                    }}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={[MaStyles.buttonTextWhiteN,{marginStart:4}]}>
                      <AntDesign name="right" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>
               
                <Row style={{height:40}}>
                <TouchableOpacity
          style={{marginTop: 20,width:"100%"}}
          onPress={() => setImageVisible(true)}
        >
          <View style={MaStyles.buttonViewUploadFoto}>
            <Text style={MaStyles.buttonTextUploadImage}>
              Select photo (1 max.)
            </Text>
          </View>
        </TouchableOpacity>
                </Row>
                <Row style={{marginTop:50,height:height-380}}>
          {/* {renderImage()} */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnable}
          >

{localImage.length==0 &&
<TouchableOpacity
style={{   marginTop:"20%"}}
   onPress={() => setImageVisible(true)}
>
<Image
 style={{
   width: 300,
   height: 300,
   alignSelf: "center",
 }}
 source={require("../../assets/lottie/imageload.gif")}
/>
</TouchableOpacity>
}

            <FlatList
              data={localImage}
              style={{alignSelf: "center", marginTop: 20}}
              numColumns={2}
              renderItem={({item, index}) => (
                <View style={{height: 160, width: 160}}>
                  <Image
                    source={{uri: item.localUri}}
                    style={{width: 150, height: 150}}
                  />
                  <View
                    style={{
                      backgroundColor: "#0e4e92",
                      marginTop: -145,
                      alignSelf: "flex-start",
                      borderRadius: 30,
                      height: 30,
                      width: 30,
                      marginStart: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        marginTop: 6,
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
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
                      style={{marginTop: 5, marginStart: 6}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          </ScrollView>
        </Row>
           
           <Row>
           <TouchableOpacity style={{marginTop: 0,width:"100%"}} onPress={() => go4()}>
          <View style={MaStyles.buttonView}>
            <Text style={MaStyles.buttonText}>Continue</Text>
          </View>
        </TouchableOpacity>  
           </Row>
           
            </Grid>
            <Modal visible={imageVisible}>
    <View style={{flex: 1, marginTop: 45}}>
      <Grid style={{marginHorizontal: 20}}>
        <Col size={2}>
          <Text style={[MaStyles.subText, {marginTop: 30}]}>
            SELECT A PHOTO
          </Text>
        </Col>
        <Col size={1} onPress={() => selectImage()}>
          <View style={MaStyles.buttonView}>
            <Text style={MaStyles.buttonText}>DONE</Text>
          </View>
        </Col>
      </Grid>
    </View>
    <View style={{flex: 10, width: "100%", marginTop: 15}}>
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
        </View>
        </View>
      )}
      {/* Fin Tercera Pantalla */}

      {/* Cuarta Pantalla */}
      {page4 && (
        <View style={MaStyles.containerWhite}>
          <ScrollView style={{ width: "100%", flex: 1 }}>
            <Grid>
        
            <Text style={MaStyles.textHeader}>Wanted listing</Text>
          
                <Row style={{height: 34}}>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                      go3()
                     }}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={MaStyles.buttonTextWhiteN}>
                      <AntDesign name="left" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={3} style={{height: 20}}>
                  <TouchableOpacity style={MaStyles.buttonViewN}>
                    <Text style={MaStyles.buttonTextNear}>Contact Details</Text>
                  </TouchableOpacity>
                </Col>
                <Col style={{height: 20}}>
                  <TouchableOpacity
                   
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text style={[MaStyles.buttonTextWhiteN,{marginStart:4}]}>
                      <AntDesign name="right" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>
               
                
               
            </Grid>
            <Grid>
              <Row style={{ marginTop: 20, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Contact Email</Text>
              </Row>
              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                 placeholderTextColor={"#d4d3d9"}
                    placeholder={"email"}
                    style={MaStyles.textInputRow}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Contact Number</Text>
              </Row>
              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                 placeholderTextColor={"#d4d3d9"}
                    placeholder={"Phone Number"}
                    style={MaStyles.textInputRow}
                    onChangeText={(text) => setPhone(text)}
                    value={phone}
                  />
                </Col>
              </Row>
              <View style={{bottom: 1, width: "100%", marginTop: 10}}>
              <View style={{bottom: 0, paddingBottom: 0}}>
                <TouchableOpacity style={{marginTop: 0}} onPress={() => go5()}>
                  <View style={MaStyles.buttonView}>
                    <Text style={MaStyles.buttonText}>Confirm listing</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            </Grid>
          </ScrollView>
          <ModalR
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={paymentPage}
        style={[
          MaStyles.container,
          {
            maxHeight: height,
            marginTop: 60,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            marginTop: 30,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 60,
              paddingTop: 5,
              zIndex: 1000,
              backgroundColor: "white",
              overflow: "hidden",
              marginHorizontal: 5,
            }}
          >
            <Grid>
              <Col
                style={{marginStart: 4}}
                onPress={() => setPaymentPage(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>Payment</Text>
              </Col>
              <Col onPress={() => setPaymentPage(false)}>
                <AntDesign
                  style={{marginTop: 2}}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </View>

          {paymentPage && (
            <View
              style={{
                width: "100%",
                height: "100%",
                marginTop: -225,
                backgroundColor: "white",
                overflow: "hidden",
              }}
            >
              <StripeCheckout
                webViewProps={{scrollEnabled: "false"}}
                stripePublicKey={"pk_test_vDqT6P1ZQuUoZlsTdobsww8l"}
                checkoutSessionInput={{
                  sessionId: stripeId,
                }}
                options={{
                  htmlContentLoading:
                    '<center><h1  style="margin-top:120px;">Chargement</h1></center>',
                }}
                onSuccess={({checkoutSessionId}) => {
                  console.log(
                    `Stripe checkout session succeeded. session id: ${checkoutSessionId}.`
                  );
                  listCar();
                }}
                onCancel={() => {
                  console.log(`Stripe checkout session cancelled.`);
                }}
              />
            </View>
          )}
        </View>
      </ModalR>
      <ModalR
            deviceHeight={height}
            animationIn={"zoomInDown"}
            animationOut={"zoomOutUp"}
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
                content="Uploading your Vehicle...️️️"
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
                source={require("../../assets/lottie/loading.gif")}
              />
            </View>
          </ModalR>
        </View>
      )}
      {/* Fin Tercera Pantalla */}
     

      {page6 && (
        <View style={MaStyles.container}>
          <ScrollView style={{ width: "100%", flex: 1 }}>
            <Text style={MaStyles.textHeader}>Wanted Vehicle listed</Text>
            <Grid>
              <Row style={{ marginTop: 15, height: 10 }}>
                {/*   <Col>
                                <LottieView style={{
                                    width: 300, height: 300, alignSelf: 'center',
                                }} source={require('../../assets/images/lottie/listed.json')} autoPlay loop={false} />
                            </Col> */}
              </Row>

              <Row>
                <Col>
                  <Image
                    source={{
                      uri:
                        "https://maxauto.s3-ap-southeast-2.amazonaws.com/maxauto/listingCar/" +
                        photoResume,
                    }}
                    resizeMode="contain"
                    style={{ width: "100%", height: 300 }}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <TouchableOpacity
                    style={MaStyles.buttonViewWhite}
                    disabled={clicked}
                    onPress={() => goBack()}
                  >
                    <Text
                      onPress={() => goBack()}
                      style={MaStyles.buttonTextWhite}
                    >
                      Return to wanted list
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          </ScrollView>
        </View>
      )}

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

      <ModalSelectList
        inputName="customFilterKey2"
        ref={saveModalRef2}
        placeholder={"Find Make"}
        closeButtonText={"Back"}
        options={staticModalOptions2}
        onSelectedOption={onSelectedOption2}
        disableTextSearch={false}
        provider={modalOptionsProvider2}
        numberOfLines={3}
      />

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

      <ModalSelectList
        inputName="customFilterKey4"
        ref={saveModalRef4}
        placeholder={"Find Body"}
        closeButtonText={"Back"}
        options={staticModalOptions4}
        onSelectedOption={onSelectedOption4}
        disableTextSearch={false}
        provider={modalOptionsProvider4}
        numberOfLines={3}
      />

      <ModalSelectList
        inputName="customFilterKey5"
        ref={saveModalRef5}
        placeholder={"Find Transmission"}
        closeButtonText={"Back"}
        options={staticModalOptions5}
        onSelectedOption={onSelectedOption5}
        disableTextSearch={false}
        provider={modalOptionsProvider5}
        numberOfLines={3}
      />

      <ModalSelectList
        inputName="customFilterKey6"
        ref={saveModalRef6}
        placeholder={"Find Fuel Type"}
        closeButtonText={"Back"}
        options={staticModalOptions6}
        onSelectedOption={onSelectedOption6}
        disableTextSearch={false}
        provider={modalOptionsProvider6}
        numberOfLines={3}
      />
    </View>
  );
}
