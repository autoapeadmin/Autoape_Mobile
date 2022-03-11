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
import * as Notifications from "expo-notifications";
import moment from "moment";
import maxAuto from "../../api/maxAuto";
import CalendarModal from "../../components/CalendarModal";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function AddVehicleScreen({
  navigation,
}: StackScreenProps<ListCarStackParamList, "CheckRego">) {
  const [updatePhoto, setUpdatePhoto] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [dw4, setDw4] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageVisible, setImageVisible] = useState(false); //could b
  const [regoPoliceOk, setRegoPoliceOk] = useState();

  const [rego, setRego] = useState("");
  const [regoResult, setRegoResult] = useState(false);

  const [clicked, setClicked] = useState(false);

  const [regoNotFound, setNotFound] = useState(true);
  const [listRegion, setRegionList] = useState([]);
  const [listMake, setListMake] = useState([]);
  const [listModel, setListModel] = useState([]);

  const [locationLabel, setLocationLabel] = useState("Wellington ");
  const [bodyLabel, setBodyLabel] = useState("Sedan  ");

  const [makeLabel, setMakeLabel] = useState("Toyota ");
  const [modelLabel, setModelLabel] = useState("Camry ");
  const [yearLabel, setYearLabel] = useState("Year");
  const [odoLabel, setOdome] = useState();
  const [bodyType, setBodyType] = useState("Body Style");
  const [transL, setTransL] = useState("Automatic ");
  const [fuelL, setFuelL] = useState("Hybrid ");

  const [date, setDate] = useState(new Date());

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

  const [regoModal, setRegoModal] = useState(false);
  const [wofModal, setWofModal] = useState(false);

  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findVIN, setFindVIN] = useState("");
  const [findVehicle, setFindVehicle] = useState(true);

  // Modal con filtro
  let modalRef;
  const openModal = () => modalRef.show();
  const saveModalRef = (ref) => (modalRef = ref);
  const onSelectedOption = (value) => {
    let res = value.split("|");
    regionSelected(res[0], res[1]);
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
    const priceCarObj = await AsyncStorage.getItem("priceCar");
    setPriceCar(priceCarObj);

    fetch(Globals.BASE_URL + "Maxauto/allPlacesList")
      .then((response) => response.json())
      .then((data) => {
        setRegionList(data.data.region_list);
      });

    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    const { status } = await Location.requestForegroundPermissionsAsync();
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
        let url = Globals.BASE_URL + "Maxauto/uploadCarPhotoMy/" + idCar;

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
    //navigation.goBack();
  };

  const selectImage = () => {
    setImageVisible(false);
    setUpdatePhoto(!updatePhoto);
  };

  const compressImage = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
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

  const goPayment = () => {
    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(false);

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

  const go6 = () => {
    setPage1(false);
    setPage2(false);
    setPage3(false);
    setPage4(false);
    setPage5(false);
    setPage6(true);
  };

  const selectRegoDate = (regoDate) => {
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setRegoModal(false);
    setRegoDate(regoNew);
    setRegoDateR(regoDate.dateString);
  };

  const selectWOFDate = (wofDate) => {
    let regoNew = dateFormat1(wofDate.dateString);
    console.log(wofDate);
    setWofModal(false);
    setWof(regoNew);
    setWofR(wofDate.dateString);
    //  setWo(wofDate);
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected;
    } else {
      return MaStyles.textInputRow;
    }
  };
  const styleFocusDesc = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelectedDesc;
    } else {
      return MaStyles.textInputRowDesc;
    }
  };

  const listCar = () => {
    //get Values to List
    setPaymentPage(false);
    setLoading(true);
    console.log("aca");

    if (rego === "") {
      return;
    }
    if (!regoDateR) {
      return;
    }
    if (!wofR) {
      return;
    }

    fetch(Globals.BASE_URL + "Maxauto/listMyCar", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regoF: rego,
        title: findYear + " " + findMake + " " + findModel,
        dateWof: wofR,
        dateRego: regoDateR,
        customerId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        uploadImages(data.data);
        let idVehicle = data.data;
        //setNotification

        let wofNoti1: String;
        let regoNoti1: String;
        let wofNoti2: String;
        let regoNoti2: String;
        let wofNoti3: String;
        let regoNoti3: String;

        wofNoti1 = moment(wofR).subtract(1, "day").format("YYYY-MM-DD");
        regoNoti1 = moment(regoDateR).subtract(1, "day").format("YYYY-MM-DD");

        wofNoti2 = moment(wofR).subtract(1, "month").format("YYYY-MM-DD");
        regoNoti2 = moment(regoDateR).subtract(1, "month").format("YYYY-MM-DD");

        wofNoti3 = moment(wofR).subtract(7, "day").format("YYYY-MM-DD");
        regoNoti3 = moment(regoDateR).subtract(7, "day").format("YYYY-MM-DD");

        triggerLocalNotificationHandler(
          wofNoti1,
          "WOF Expiring tomorrow",
          rego + " Expiring tomorrow",
          "w1" + idVehicle,
          true
        );
        triggerLocalNotificationHandler(
          regoNoti1,
          "REGO Expiring tomorrow",
          rego + " Expiring tomorrow",
          "r1" + idVehicle
        );

        triggerLocalNotificationHandler(
          wofNoti2,
          "WOF Expiring Soon",
          rego + " Expiring this month",
          "w2" + idVehicle
        );
        triggerLocalNotificationHandler(
          regoNoti2,
          "REGO Expiring Soon",
          rego + " Expiring this month",
          "r2" + idVehicle
        );

        triggerLocalNotificationHandler(
          wofNoti3,
          "WOF Expiring Soon",
          rego + " Expiring this month",
          "w3" + idVehicle
        );
        triggerLocalNotificationHandler(
          regoNoti3,
          "WOF Expiring Soon",
          rego + " Expiring this month",
          "r3" + idVehicle
        );

        //saveImage
      });
    //photos
    //console.log(bodyF);
    //redirect to the pay
  };

  const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    console.log(datum);
    return datum;
  };

  function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    console.log("Current Date: " + endDate.getTime());
    console.log("Selected Date: " + startDate.getTime());
    return diff / 60000;
  }

  const [regoChecked, setRegoChecked] = useState(false);

  const findPlateDetails = () => {
    setLoading(true);
    maxAuto.getMotoChekDetails(rego, "free").then((result) => {
      console.log(result);
      setLoading(false);
      if (result.data.find === false) {
        //  setFindMake("Nissan");
        //  setFindModel("Note");
        setFindYear("Vehicle Not Found");
        setFindVehicle(false);
        setRegoChecked(true);
      } else {
        setFindMake(result.data.make);
        setFindModel(result.data.model);
        setFindYear(result.data.year);
        setFindVIN(result.data.vin);
        setRegoChecked(true);
        setFindVehicle(true);
      }
    });

    //getMotoChekDetails
  };

  const triggerLocalNotificationHandler = (
    date,
    title,
    message,
    id,
    isTomorrow: boolean = false
  ) => {
    var currentDate = new Date();
    var dateSecond = new Date(date);

    var now = moment(new Date());
    var end = moment(date);
    var duration = moment.duration(end.diff(now));
    var minutes = duration.asHours() + 12;
    console.log("Moment: " + minutes);

    //let resultInMinutes = getMinutesBetweenDates(dateSecond, currentDate);

    console.log("Current Date: " + currentDate);
    console.log("Selected Date: " + dateSecond);
    //console.log("Diff Date: " + resultInMinutes / 60);

    if (isTomorrow) {
    }

    Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: title,
        body: message,
      },
      trigger: { hour: minutes },
    });
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
              <Text style={MaStyles.textHeaderScreenM}>My Vehicles</Text>
            </Col>
          </Grid>

          <Grid></Grid>

          <Grid style={{ width: "100%" }}>
            {localImage.length == 0 && (
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
                  onBlur={() => {
                    //checkRego();
                    setIsFocused("");
                  }}
                  placeholderTextColor={"#d4d3d9"}
                  placeholder={"e.g: SSAA1"}
                  style={styleFocus("rego")}
                  onFocus={() => setIsFocused("rego")}
                  onChangeText={(text) => setRego(text)}
                />

                <TouchableOpacity
                  style={{
                    marginTop: -20,
                    position: "absolute",
                    alignSelf: "flex-end",
                    width: 100,
                  }}
                  onPress={() => findPlateDetails()}
                >
                  <View style={[MaStyles.buttonView, { borderRadius: 0 }]}>
                    <Text style={MaStyles.buttonText}>Confirm</Text>
                  </View>
                </TouchableOpacity>

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
                {findYear + " " + findMake + " " + findModel}
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
            <Row style={{ marginTop: 15, height: 40, marginBottom: 100 }}>
              <Col>
                <TouchableOpacity
                  style={{ marginTop: 0 }}
                  onPress={() => listCar()}
                >
                  <View style={MaStyles.buttonView}>
                    <Text style={MaStyles.buttonText}>Create</Text>
                  </View>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </KeyboardAwareScrollView>
      )}
      {/* Fin Segunda Pantalla */}

      <CalendarModal
        title=" Select REGO expire date"
        onBackdropPress={() => setRegoModal(false)}
        onBackButtonPress={() => setRegoModal(false)}
        onDayPress={function (day: any): void {
          selectRegoDate(day);
        }}
        isVisible={regoModal}
      />

      <CalendarModal
        title=" Select WOF expire date"
        onBackdropPress={() => setWofModal(false)}
        onBackButtonPress={() => setWofModal(false)}
        onDayPress={function (day: any): void {
          selectWOFDate(day);
        }}
        isVisible={wofModal}
      />
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
