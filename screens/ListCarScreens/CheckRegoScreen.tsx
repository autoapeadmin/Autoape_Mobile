import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage,
  ScrollView,
  Image,
  Modal,
  Platform,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import MaStyles from "../../assets/styles/MaStyles";
import { ListCarStackParamList } from "../../types";
import Globals from "../../constants/Globals";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Card } from "react-native-elements";
import { Vehicle } from "../../types";
import { TextInputMask } from "react-native-masked-text";
import * as ImagePicker from "expo-image-picker";
import { ImageBrowser } from "expo-image-picker-multiple";
import { ModalSelectList } from "react-native-modal-select-list";
import { FlatList } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { StripeCheckout } from "react-native-stripe-checkout-webview";
import ModalR from "react-native-modal";
import maxAuto from "../../api/maxAuto";
import TextAnimator from "../../utils/TextAnimator";
import DoneScreen from "../../components/DoneScreen";
import Loader from "../../components/Loader";
import ProgressBar from "../../components/ProgressBar";
import FooterBar from "../../components/FooterBar";
import PaymentScreen from "../../components/PaymentScreen";
import { useStripe } from "@stripe/stripe-react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function CheckRegoScreen({
  navigation,
}: StackScreenProps<ListCarStackParamList, "CheckRego">) {
  const [updatePhoto, setUpdatePhoto] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  const [dw4, setDw4] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingF, setLoadingF] = useState(false);
  const [isDone, setIsDone] = useState(false);

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

  const [regionId, setRegionId] = useState("0");
  const [makeId, setMakeId] = useState("0");
  const [modelId, setModelId] = useState("0");
  const [bodyId, setBodyId] = useState("0");
  const [engineSize, setEngineSize] = useState("0");
  const [fuelType, setFuelType] = useState("0");
  const [trasmission, setTransmission] = useState("0");
  const [desc, setDesc] = useState("");
  const [findVIN, setFindVIN] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  const [priceCar, setPriceCar] = useState("");

  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [page6, setPage6] = useState(false);
  const [paymentPage, setPaymentPage] = useState(false);

  const [scrollEnable, setScrollEnablie] = useState(true);

  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [nextTitle, setNextTitle] = useState("Next");
  const [backTitle, setBackTitle] = useState("");

  const [localImage, setLocalImage] = useState([]);
  const [multipleUrl, setMultipleUrl] = useState([]);

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [stripeId, setStripeID] = useState("");

  const [photoResume, setPhotoResume] = useState("");
  const [price, setPrice] = useState();

  const [isFocused, setIsFocused] = useState("");

  const [regoVehicule, setRegoVehicule] = useState<Vehicle>();

  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findVehicle, setFindVehicle] = useState(true);
  const [findStolen, setFindStolen] = useState(true);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading2, setLoadng] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();

  const fetchPaymentSheetParams = async () => {
    const email = await AsyncStorage.getItem("customer_email");
    const response = await fetch(
      "https://saber-strengthened-beech.glitch.me/payment-sheet?email=" +
        email +
        "&price=1000",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    setClientSecret(paymentIntent);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const openPaymentSheet = async () => {
    await initialisePaymentSheet();
    if (!clientSecret) {
      return;
    }
    setLoadng(true);
    const { error } = await presentPaymentSheet({
      clientSecret,
    });

    if (error) {
      Alert.alert(`${error.code}`, error.message);
    } else {
      listCar();
    }
    setPaymentSheetEnabled(false);
    setLoadng(false);
  };

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: "Example Inc.",
      style: "alwaysLight",
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    }
  };

  // Modal con filtro
  let modalRef;
  const openModal = () => modalRef.show();
  const saveModalRef = (ref) => (modalRef = ref);
  const onSelectedOption = (value) => {
    let res = value.split("|");
    regionSelected(res[0], res[1]);
  };

  const listCar = () => {
    //get Values to List
    setIsVisible(false);
    setPaymentPage(false);
    setLoading(true);

    fetch(Globals.BASE_URL + "Maxauto/listCar", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regoF: rego,
        fk_region: regionId,
        priceF: price,
        makeF: makeId,
        modelF: modelId,
        bodyF: bodyId,
        yearF: findYear,
        odoF: odoLabel,
        tranF: trasmission,
        descF: desc,
        phoneF: phone,
        emailF: email,
        customerId: id,
        flagType: 0,
        typeList: 1,
        lati: lat,
        longi: long,
        fuelF: fuelType,
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
    //redirect to the pay
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

  const bodyL1 = () => {
    if (bodyLabel == "Sedan  ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const transmisionL = () => {
    if (transL == "Automatic ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const fuelL1 = () => {
    if (fuelL == "Hybrid ") {
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
        let url = Globals.BASE_URL + "Maxauto/uploadCarPhoto/" + idCar;

        const fetchResponse = await fetch(url, setting);

        //console.log(fetchResponse.blob);
        const data = await fetchResponse.json();

        if (photoResume == "") {
          setPhotoResume(data.data);
        }

        setLoading(false);
        setIsDone(true);
      } catch (e) {}
      //index++;
    }

    // go6();
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

  const logout = async () => {
    await AsyncStorage.setItem("logged", "false");
    await AsyncStorage.setItem("customer_id", "0");

    fetch(Globals.BASE_URL + "Maxauto/signOut")
      .then((response) => response.json())
      .then((data) => {
        //setListMake(data.data);
      });

    navigation.navigate("AddList");
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
    console.log(priceCar);
    maxAuto.getSessionStripe(priceCar + "00").then((result) => {
      console.log(result);
      setStripeID(result);
      setPaymentPage(true);
    });
  };

  const onPaymentSuccess = (token) => {
    // send the stripe token to your backend!
  };

  const onClose = () => {
    // maybe navigate to other screen here?
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

  const handlePressNext = () => {
    console.log(step);
    switch (step) {
      case 0:
        setStep(1);
        go3();
        setBackTitle("Back");
        break;
      case 1:
        setStep(2);
        go4();
        setPage3(false);
        setNextTitle("Pay");
        break;
      case 2:
        openPaymentSheet();
        //setStep(2);
        //go5();
        //setNextTitle("Generate");
        break;

      case 3:
        //generatePdf();
        setIsVisible(false);
        break;

      default:
        break;
    }
  };

  const handlePressBack = () => {
    console.log(step);
    switch (step) {
      case 0:
        setStep(0);
        setBackTitle("");
        break;
      case 1:
        setStep(0);
        setBackTitle("");
        go2();
        break;

      case 2:
        setStep(1);
        go3();
        setPage3(true);
        setNextTitle("Next");
        break;

      case 3:
        setStep(2);
        go3();
        setNextTitle("Next");
        break;

      default:
        break;
    }
  };

  const [regoChecked, setRegoChecked] = useState(false);
  const [page0, setPage0] = useState(true);

  const styleFocusSearchBox = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputSelectedM;
    } else {
      return MaStyles.textInputM;
    }
  };

  const findPlateDetails = () => {
    setLoadingF(true);

    maxAuto.getMotoChekDetails(rego, "police").then((result) => {
      console.log(result);
      setLoadingF(false);
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
        setMakeId(result.data.makeId);
        setModelId(result.data.modelId);
        setFindVIN(result.data.vin);
        setRegoChecked(true);
        setFindVehicle(true);
        let stolen = result.data.isStolen == "true";
        setFindStolen(stolen);
        setLoadingF(false);
      }
    });

    //getMotoChekDetails
  };

  return (
    <View
      style={[
        MaStyles.containerWhite,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      {page0 && (
        <View style={{ width: "100%" }}>
          <Row style={{ paddingHorizontal: 20, height: 40, marginTop: 0 }}>
            <Grid>
              <Col
                onPress={() => {
                  setPage0(false);
                }}
              >
                <AntDesign
                  style={{ marginTop: 10 }}
                  name="left"
                  size={24}
                  color="#0e4e92"
                />
              </Col>
              <Col
                style={{ marginTop: 0 }}
                onPress={() => navigation.goBack()}
                size={10}
              >
                <TextInput
                  onBlur={() => {
                    //checkRego();
                    setIsFocused("");
                  }}
                  placeholderTextColor={"#808080bf"}
                  placeholder={"Plate number or VIN"}
                  style={styleFocusSearchBox("rego")}
                  onFocus={() => setIsFocused("rego")}
                  onChangeText={(text) => setRego(text)}
                  autoFocus={true}
                  onSubmitEditing={() => {
                    findPlateDetails();
                  }}
                />
              </Col>
            </Grid>
          </Row>

          {loadingF ? (
            <View
              style={{
                width: "100%",
                alignContent: "center",
                marginStart: width / 2 - 35,
              }}
            >
              <Loader />
            </View>
          ) : (
            <View></View>
          )}

          {regoChecked ? (
            findVehicle ? (
              <TouchableOpacity
                style={{ marginTop: 15 }}
                onPress={() => {
                  if (!findStolen) {
                    setPage0(false);
                    setPage2(true);
                    setIsVisible(true);
                  }
                }}
              >
                <Row
                  style={{
                    paddingHorizontal: 10,
                    height: 180,
                    marginTop: 25,
                    width: "100%",
                  }}
                >
                  <Grid
                    style={{
                      marginTop: 0,
                      height: 50,
                      borderColor: "white",
                      borderWidth: 0.5,
                      borderRadius: 10,
                      width: "100%",
                      flex: 1,
                    }}
                  >
                    <Row style={{ height: 30 }}>
                      <Col style={{ width: 60 }}>
                        <View
                          style={{
                            backgroundColor: "gray",
                            borderRadius: 150,
                            width: 50,
                            height: 50,
                            alignItems: "center",
                          }}
                        >
                          <FontAwesome
                            style={{ marginTop: 15 }}
                            name="car"
                            size={20}
                            color="white"
                          />
                        </View>
                      </Col>
                      <Col>
                        <Text
                          style={[MaStyles.titleInputBox, { marginTop: 5 }]}
                        >
                          {findYear} {findMake} {findModel}
                        </Text>
                        <Text
                          style={[
                            MaStyles.titleInput,
                            { marginTop: 5, color: "gray" },
                          ]}
                        >
                          Plate: {rego}
                        </Text>
                      </Col>
                    </Row>
                    <Row style={{ height: 30 }}>
                      <View
                        style={{
                          height: 0.25,
                          backgroundColor: "#d4d3d9",
                          width: "100%",
                          marginTop: 40,
                        }}
                      ></View>
                    </Row>
                    <Row style={{ height: 90 }}>
                      {findStolen ? (
                        <Text
                          style={[
                            MaStyles.titleInput,
                            {
                              marginTop: 30,
                              color: "#e63131",
                              textAlign: "center",
                              width: "100%",
                            },
                          ]}
                        >
                          <AntDesign name="warning" size={15} color="#e63131" />{" "}
                          The above vehicle is REPORTED stolen {"\n"} as of{" "}
                          {new Date().toLocaleDateString()}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            MaStyles.titleInput,
                            {
                              marginTop: 30,
                              color: "#5fb313",
                              textAlign: "center",
                              width: "100%",
                            },
                          ]}
                        >
                          <AntDesign
                            name="checkcircle"
                            size={15}
                            color="#5fb313"
                          />{" "}
                          The above vehicle is NOT reported stolen {"\n"} as of{" "}
                          {new Date().toLocaleDateString()}
                        </Text>
                      )}
                    </Row>
                  </Grid>
                </Row>
              </TouchableOpacity>
            ) : (
              <Row
                onPress={() => {
                  console.log("aca");
                  setPage0(false);
                  setPage2(true);
                }}
                style={{
                  paddingHorizontal: 10,
                  height: 180,
                  marginTop: 15,
                  width: "100%",
                }}
              >
                <Grid
                  style={{
                    marginTop: 0,
                    height: 50,
                    borderColor: "white",
                    borderWidth: 0.5,
                    borderRadius: 10,
                    width: "100%",
                    flex: 1,
                  }}
                >
                  <Row>
                    <Col size={4}>
                      <Text
                        style={[
                          MaStyles.titleInputBox,
                          { marginTop: 5, height: 24 },
                        ]}
                      >
                        Vehicle not found
                      </Text>
                      <Text
                        style={[
                          MaStyles.titleInput,
                          { marginTop: 5, color: "gray" },
                        ]}
                      >
                        Rego is not on NZTA Database
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <View
                      style={{
                        height: 0.25,
                        backgroundColor: "#d4d3d9",
                        width: "100%",
                        marginTop: 40,
                      }}
                    ></View>
                  </Row>
                </Grid>
              </Row>
            )
          ) : (
            <View></View>
          )}
        </View>
      )}

      <Grid>
        <Row style={{ paddingHorizontal: 20, height: 40, marginTop: 0 }}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 0 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col
              style={{ marginTop: -3 }}
              onPress={() => navigation.goBack()}
              size={10}
            >
              <Text style={MaStyles.textHeaderScreenM}>Create a listing</Text>
            </Col>
          </Grid>
        </Row>

        <Row style={{ marginHorizontal: 20, marginTop: 0 }} size={16}>
          {/* Primera Pantalla */}
          {page1 && (
            <View style={{ width: "100%", flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={MaStyles.textHeader}>Create a listing</Text>
                <Grid>
                  <Col>
                    <AntDesign
                      style={{ alignSelf: "center", marginTop: 20 }}
                      name="leftcircleo"
                      size={20}
                      color="#0e4e92"
                    />
                  </Col>
                  <Col>
                    <Text style={[MaStyles.subText, { marginTop: 20 }]}>
                      STEP 1 OUT OF 3
                    </Text>
                  </Col>
                  <Col onPress={() => go3()}>
                    <AntDesign
                      style={{ alignSelf: "center", marginTop: 20 }}
                      name="rightcircleo"
                      size={20}
                      color="#0e4e92"
                    />
                  </Col>
                </Grid>
              </View>
              <View style={{ flex: 7, width: "100%" }}>
                <TextInput
                  onBlur={() => checkRego}
                  autoCompleteType={"email"}
                  placeholderTextColor={"#d4d3d9"}
                  placeholder={"Vehicle registration"}
                  style={MaStyles.textInput}
                  //onChangeText={text => setRego(text)}
                />
                {regoNotFound && (
                  <Text
                    onPress={() => go2()}
                    style={[
                      MaStyles.cardSubtitle,
                      { marginTop: 20, marginHorizontal: 5 },
                    ]}
                  >
                    REGO not found, continue without registration{" "}
                  </Text>
                )}

                {regoResult && (
                  <View>
                    <Card containerStyle={[MaStyles.item, { marginTop: 20 }]}>
                      <Text style={MaStyles.cardTitle}>
                        <AntDesign name="infocirlce" size={10} color="black" />{" "}
                        Vehicle Information
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Vehicle: {regoVehicule.make_description}{" "}
                        {regoVehicule.model_desc}
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Year: {regoVehicule.vehicule_year}
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Engine: {regoVehicule.vehicule_engine}
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Color: {regoVehicule.vehicule_color}
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Seats: {regoVehicule.vehicule_seat}
                      </Text>
                      <Text style={MaStyles.cardSubtitle}>
                        Fuel type: {regoVehicule.vehicule_fuel}
                      </Text>
                    </Card>
                    <Text
                      onPress={() => go2()}
                      style={[
                        MaStyles.cardSubtitle,
                        { marginTop: 0, marginHorizontal: 5, color: "#0e4e92" },
                      ]}
                    >
                      Use this vehicle
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 2, width: "100%" }}>
                <View style={{ bottom: 0, paddingBottom: 0 }}>
                  <TouchableOpacity
                    style={{ marginTop: 0 }}
                    onPress={() => checkRego()}
                  >
                    <View style={MaStyles.buttonView}>
                      <Text style={MaStyles.buttonText}>Find vehicle</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginTop: 0 }}
                    onPress={() => go2()}
                  >
                    <View style={MaStyles.buttonViewWhite}>
                      <Text style={MaStyles.buttonTextWhite}>
                        Continue without registration
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {/* Fin Primera Pantalla */}

          {/* Segunda Pantalla */}
          {page2 && (
            <KeyboardAwareScrollView
              enableAutomaticScroll={Platform.OS === "ios"}
              behavior={"padding"}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: 0 }}
            >
              <ProgressBar stepActive={0} titleText={"Vehicle Details"} />

              <View
                style={{
                  marginTop: 30,
                  height: 120,
                  borderColor: "#0e4e92",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: "100%",
                  flex: 1,
                  borderStyle: "dashed",
                }}
              >
                <Row style={{ paddingHorizontal: 20 }}>
                  <Col size={5} style={{ justifyContent: "center" }}>
                    <Text style={[MaStyles.titleInputBox, { marginTop: 0 }]}>
                      {findYear} {findMake} {findModel}
                    </Text>
                    <Text
                      style={[
                        MaStyles.titleInput,
                        { marginTop: 15, color: "gray" },
                      ]}
                    >
                      Plate: {rego}
                    </Text>
                  </Col>
                  <Col style={{ justifyContent: "center" }}>
                    <Image
                      style={{ width: 30, height: 30, alignSelf: "center" }}
                      source={require("../../assets/images/checked.png")}
                    ></Image>
                  </Col>
                </Row>
              </View>

              <Grid style={{ paddingBottom: 100 }}>
                <Row style={{ marginTop: 0, height: 70 }}>
                  <Text style={[MaStyles.titleInput]}>
                    <FontAwesome name="info-circle" size={14} color="#c29f1b" />{" "}
                    Information such as engine, body type, fuel, etc will be
                    displayed automatically
                  </Text>
                </Row>

                <Row style={{ marginTop: 0, height: 43 }}>
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
                  <Text style={[MaStyles.titleInput]}>Asking Price</Text>
                </Row>

                <Row style={{ marginTop: 10, height: 40 }}>
                  <Col>
                    <TextInputMask
                      placeholder="$55,000"
                      onBlur={() => {
                        checkRego();
                        setIsFocused("");
                      }}
                      style={styleFocus("price")}
                      onFocus={() => setIsFocused("price")}
                      placeholderTextColor={"#d4d3d9"}
                      type={"money"}
                      options={{
                        precision: 0,
                        separator: ".",
                        delimiter: ",",
                        unit: "$",
                        suffixUnit: "",
                      }}
                      value={price}
                      onChangeText={(text) => {
                        setPrice(text);
                      }}
                    />
                  </Col>
                </Row>

                {/*         <Row style={{marginTop: 5, height: 43}}>
              <Text style={[MaStyles.titleInput]}>Make</Text>
            </Row>

            <Row style={{marginTop: 15, height: 40}}>
              <Col>
                <Text style={makeL()} onPress={(value) => openModal2()}>
                  {makeLabel}
                </Text>
              </Col>
            </Row>

            <Row style={{marginTop: 5, height: 43}}>
              <Text style={[MaStyles.titleInput]}>Model</Text>
            </Row>

            <Row style={{marginTop: 10, height: 40}}>
              <Col>
                <Text style={modelL()} onPress={(value) => openModal3()}>
                  {modelLabel}
                </Text>
              </Col>
            </Row>
 */}
                {/*       <Row style={{marginTop: 5, height: 45}}>
             <Text style={[MaStyles.titleInput]}>Body Type</Text>
            </Row>

            <Row style={{marginTop: 15, height: 40, zIndex: 1000}}>
              <Col>
                <Text style={bodyL1()} onPress={(value) => openModal4()}>
                  {bodyLabel}
                </Text>
              </Col>
            </Row>
 */}
                {/*  <Row style={{marginTop: 5, height: 43}}>
              <Text style={[MaStyles.titleInput]}>Year</Text>
            </Row>
            <Row style={{marginTop: 15, height: 40, zIndex: 1000}}>
              <Col>
                <TextInputMask
                  placeholder="2018"
                  editable={regoNotFound}
                  onBlur={() => {
                    checkRego();
                    setIsFocused("");
                  }}
                  style={styleFocus("year")}
                  onFocus={() => setIsFocused("year")}
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
                  value={yearLabel}
                  onChangeText={(text) => {
                    setYearLabel(text);
                  }}
                />
              </Col>
            </Row> */}

                <Row style={{ marginTop: 5, height: 43 }}>
                  <Text style={[MaStyles.titleInput]}>Odometer (km)</Text>
                </Row>
                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col>
                    <TextInputMask
                      placeholder="3,500"
                      editable={regoNotFound}
                      onBlur={() => {
                        checkRego();
                        setIsFocused("");
                      }}
                      style={styleFocus("odo")}
                      onFocus={() => setIsFocused("odo")}
                      maxLength={7}
                      placeholderTextColor={"#d4d3d9"}
                      type={"money"}
                      options={{
                        precision: 0,
                        separator: ".",
                        delimiter: ",",
                        unit: "",
                        suffixUnit: "",
                      }}
                      value={odoLabel}
                      onChangeText={(text) => {
                        setOdome(text);
                      }}
                    />
                  </Col>
                </Row>

                {/*         <Row style={{marginTop: 0, height: 45}}>
              <Text style={[MaStyles.titleInput]}>Engine size (cc) <Text style={{fontSize:10,color:"gray"}}>(Optional)</Text></Text>
            </Row>
            <Row style={{marginTop: 15, height: 40}}>
              <Col>
                <TextInput
                  onChangeText={(text) => {
                    setEngineSize(text);
                  }}
                  keyboardType={"number-pad"}
                 placeholderTextColor={"#d4d3d9"}
                  placeholder={"2487"}
                  onBlur={() => {
                    checkRego();
                    setIsFocused("");
                  }}
                  style={styleFocus("engine")}
                  onFocus={() => setIsFocused("engine")}
                />
              </Col>
            </Row> */}

                <Row style={{ marginTop: 0, height: 45 }}>
                  <Text style={[MaStyles.titleInput]}>Body Type</Text>
                </Row>
                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col>
                    <Text style={bodyL1()} onPress={(value) => openModal4()}>
                      {bodyLabel}
                    </Text>
                  </Col>
                </Row>

                <Row style={{ marginTop: 0, height: 43 }}>
                  <Text style={[MaStyles.titleInput]}>
                    Transmission{" "}
                    <Text style={{ fontSize: 10, color: "gray" }}>
                      (Optional)
                    </Text>
                  </Text>
                </Row>
                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col>
                    <Text
                      style={transmisionL()}
                      onPress={(value) => openModal5()}
                    >
                      {transL}
                    </Text>
                  </Col>
                </Row>

                <Row style={{ marginTop: 0, height: 45 }}>
                  <Text style={[MaStyles.titleInput]}>
                    Fuel Type{" "}
                    <Text style={{ fontSize: 10, color: "gray" }}>
                      (Optional)
                    </Text>
                  </Text>
                </Row>
                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col>
                    <Text style={fuelL1()} onPress={(value) => openModal6()}>
                      {fuelL}
                    </Text>
                  </Col>
                </Row>

                {/*    <Row style={{marginTop: 0, height: 45}}>
              <Text style={[MaStyles.titleInput]}>Fuel Type</Text>
            </Row>
            <Row style={{marginTop: 15, height: 40}}>
              <Col>
                <Text style={fuelL1()} onPress={(value) => openModal6()}>
                  {fuelL}
                </Text>
              </Col>
            </Row>
 */}
                {/*     <Row style={{marginTop: 0, height: 45}}>
              <Text style={[MaStyles.titleInput]}>Drive Type <Text style={{fontSize:10,color:"gray"}}>(Optional)</Text></Text>
            </Row>

            <Row style={{marginTop: 15, height: 40}}>
              <Col size={1}>
                <CheckBox
                  style={{marginTop: 2}}
                  checked={dw4}
                  color="#0e4e92"
                  onPress={() => setDw4(!dw4)}
                />
              </Col>
              <Col size={6}>
                <Text style={[MaStyles.txtDesc]}>4WD</Text>
              </Col>
            </Row> */}

                <Row style={{ marginTop: 0 }}>
                  <Text style={[MaStyles.titleInput]}>
                    Description{" "}
                    <Text style={{ fontSize: 10, color: "gray" }}>
                      (Optional)
                    </Text>
                  </Text>
                </Row>

                <Row style={{ marginTop: 15, height: 300 }}>
                  <Col>
                    <TextInput
                      multiline={true}
                      onChangeText={(text) => {
                        setDesc(text);
                      }}
                      numberOfLines={4}
                      onBlur={() => {
                        setIsFocused("");
                      }}
                      autoCompleteType={"email"}
                      placeholderTextColor={"#d4d3d9"}
                      style={styleFocusDesc("desc")}
                      onFocus={() => setIsFocused("desc")}

                      //onChangeText={text => setRego(text)}
                      //onSubmitEditing={() => { checkRego() }}
                    />
                  </Col>
                </Row>

                <Row
                  style={{ marginTop: 15, height: 40, marginBottom: 100 }}
                ></Row>
              </Grid>
            </KeyboardAwareScrollView>
          )}
          {/* Fin Segunda Pantalla */}

          {/* Tercera Pantalla */}
          {page3 && (
            <KeyboardAwareScrollView
              enableAutomaticScroll={Platform.OS === "ios"}
              behavior={"padding"}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: 0 }}
            >
              <ProgressBar stepActive={1} titleText={"Images"} />

              <Grid style={{ paddingTop: 20 }}>
                <Row style={{ height: 130, marginTop: -20 }}>
                  <TouchableOpacity
                    onPress={() => setImageVisible(true)}
                    style={MaStyles.buttonViewUploadFoto}
                  >
                    <Text
                      onPress={() => setImageVisible(true)}
                      style={MaStyles.buttonTextUploadImage}
                    >
                      Select photos (15 max.)
                    </Text>
                  </TouchableOpacity>
                </Row>
                <Row style={{ marginTop: 0 }}>
                  {/* {renderImage()} */}
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollEnable}
                  >
                    {localImage.length == 0 && (
                      <TouchableOpacity onPress={() => setImageVisible(true)}>
                        <Image
                          style={{
                            width: 300,
                            height: 300,
                            alignSelf: "center",
                            marginTop: 50,
                          }}
                          source={require("../../assets/lottie/imageload.gif")}
                        />
                      </TouchableOpacity>
                    )}

                    <FlatList
                      data={localImage}
                      style={{ alignSelf: "center", paddingBottom: 200 }}
                      numColumns={2}
                      renderItem={({ item, index }) => (
                        <View style={{ height: 160, width: 160 }}>
                          <Image
                            source={{ uri: item.localUri }}
                            style={{ width: 150, height: 150 }}
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
                              style={{ marginTop: 5, marginStart: 6 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    ></FlatList>
                  </ScrollView>
                </Row>

                <Row></Row>
              </Grid>

              <Modal visible={imageVisible}>
                <View style={{ flex: 1, marginTop: 45 }}>
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
                    max={15}
                    renderSelectedComponent={(number) =>
                      renderSelectedComponent(number)
                    }
                    onChange={(callback) => {}}
                    callback={(onSubmit) => callBackImg(onSubmit)}
                  />
                </View>
              </Modal>
            </KeyboardAwareScrollView>
          )}
          {/* Fin Tercera Pantalla */}

          {/* Cuarta Pantalla */}
          {page4 && (
            <KeyboardAwareScrollView
              enableAutomaticScroll={Platform.OS === "ios"}
              behavior={"padding"}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: 0 }}
            >
              <ProgressBar stepActive={2} titleText={"Contact Details"} />

              <PaymentScreen>
                <Grid>
                  <Row style={{ marginTop: 20, height: 43 }}>
                    <Text style={[MaStyles.titleInput]}>Contact Email</Text>
                  </Row>
                  <Row style={{ marginTop: 15, height: 40 }}>
                    <Col>
                      <TextInput
                        placeholderTextColor={"#d4d3d9"}
                        placeholder={"email"}
                        onBlur={() => {
                          setIsFocused("");
                        }}
                        style={styleFocus("email")}
                        onFocus={() => setIsFocused("email")}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 0, height: 43 }}>
                    <Text style={[MaStyles.titleInput]}>Contact Number</Text>
                  </Row>
                  <Row style={{ marginTop: 15, height: 40 }}>
                    <Col>
                      <TextInput
                        placeholderTextColor={"#d4d3d9"}
                        placeholder={"09272113737"}
                        onBlur={() => {
                          setIsFocused("");
                        }}
                        style={styleFocus("phone")}
                        onFocus={() => setIsFocused("phone")}
                        onChangeText={(text) => setPhone(text)}
                        value={phone}
                      />
                    </Col>
                  </Row>

                  <View style={{ bottom: 1, width: "100%", marginTop: 10 }}>
                    <View style={{ bottom: 0, paddingBottom: 0 }}></View>
                  </View>
                </Grid>
              </PaymentScreen>
            </KeyboardAwareScrollView>
          )}
          {/* Fin Tercera Pantalla */}
          {page5 && (
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <Text style={[MaStyles.textHeaderM, { marginTop: 0 }]}>
                Payment
              </Text>
              <Grid>
                <Text style={[MaStyles.h1Title]}>Payment Details</Text>

                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col size={3}>
                    <TextInput
                      placeholderTextColor={"#d4d3d9"}
                      placeholder={"Card number"}
                      style={MaStyles.textInputRow}
                      onChangeText={(text) => setRego(text)}
                    />
                  </Col>
                  <Col>
                    <TextInput
                      placeholderTextColor={"#d4d3d9"}
                      placeholder={"MM/YY"}
                      style={MaStyles.textInputRow}
                    />
                  </Col>
                </Row>

                <Row style={{ marginTop: 15, height: 40 }}>
                  <Col size={3}>
                    <TextInput
                      placeholderTextColor={"#d4d3d9"}
                      placeholder={"John Smitch"}
                      style={MaStyles.textInputRow}
                      onChangeText={(text) => setRego(text)}
                    />
                  </Col>

                  <Col>
                    <TextInput
                      placeholderTextColor={"#d4d3d9"}
                      placeholder={"CVC"}
                      style={MaStyles.textInputRow}
                    />
                  </Col>
                </Row>

                <View style={{ bottom: 1, width: "100%", marginTop: 10 }}>
                  <View style={{ bottom: 0, paddingBottom: 0 }}>
                    <TouchableOpacity
                      style={MaStyles.buttonView}
                      //disabled={clicked}
                      onPress={() => goPayment()}
                    >
                      <Text style={MaStyles.buttonText}>Pay and List</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Grid>
            </ScrollView>
          )}

          <ModalR
            deviceHeight={height}
            animationIn={"slideInUp"}
            isVisible={paymentPage}
            style={[
              MaStyles.containerM,
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
                paddingTop: 30,
              },
            ]}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                marginTop: 0,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 40,
                  paddingTop: 0,
                  zIndex: 1000,
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginHorizontal: 5,
                }}
              >
                <Grid style={{ height: 10 }}>
                  <Col
                    style={{ marginStart: 4 }}
                    onPress={() => setPaymentPage(false)}
                    size={10}
                  ></Col>
                  <Col onPress={() => setPaymentPage(false)}>
                    <AntDesign
                      style={{ marginTop: 2 }}
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
                    marginTop: -20,
                    backgroundColor: "white",
                    overflow: "hidden",
                  }}
                >
                  <StripeCheckout
                    webViewProps={{ scrollEnabled: "true" }}
                    stripePublicKey={"pk_test_vDqT6P1ZQuUoZlsTdobsww8l"}
                    checkoutSessionInput={{
                      sessionId: stripeId,
                    }}
                    options={{
                      htmlContentLoading: "<center></center>",
                    }}
                    onSuccess={({ checkoutSessionId }) => {
                      console.log(
                        `Stripe checkout session succeeded. session id: ${checkoutSessionId}.`
                      );
                      listCar();
                    }}
                    onCancel={() => {
                      console.log(`Stripe checkout session cancelled.`);
                      setPaymentPage(false);
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

          {/* page6 */}
          {isDone && (
            <View
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                marginTop: -40,
              }}
            >
              <DoneScreen
                titleText={"Your vehicle listing is active!"}
                subTitleText={"You can view it from My Listings"}
                onPressButton={() => {
                  navigation.goBack();
                }}
                buttonText={"Back"}
                uriImage={require("../../assets/images/splash/ready.png")}
              />
            </View>
          )}

          {page6 && (
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <Text style={MaStyles.textHeader}>Vehicle listed</Text>
              <Grid>
                <Row style={{ marginTop: 15, height: 300 }}>
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
                      style={MaStyles.buttonView}
                      disabled={clicked}
                      //onPress={() => goPayment()}
                    >
                      <Text style={MaStyles.buttonText}>View Vehicle</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <TouchableOpacity
                      style={MaStyles.buttonViewWhite}
                      disabled={clicked}
                      //onPress={() => goPayment()}
                    >
                      <Text
                        onPress={() => navigation.navigate("Home")}
                        style={MaStyles.buttonTextWhite}
                      >
                        Return to home
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Grid>
            </ScrollView>
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
        </Row>
      </Grid>

      <FooterBar
        nextTitle={nextTitle}
        backTitle={backTitle}
        onPressItemNext={() => handlePressNext()}
        onPressItemBack={() => handlePressBack()}
        isBackButton={false}
        isVisible={isVisible}
      />
    </View>
  );
}
