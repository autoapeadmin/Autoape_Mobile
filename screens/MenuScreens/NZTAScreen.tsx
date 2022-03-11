import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import {TextInputMask} from "react-native-masked-text";
import LottieView from "lottie-react-native";
import * as React from "react";
import {CheckBox} from "react-native-elements";
import {
  Animated,
  AsyncStorage,
  Dimensions,
  ImageBackground,
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
import {Col, Grid, Row} from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import Modal from "react-native-modal";
import {RootStackParamList} from "../../types";
import {useEffect, useState} from "react";
import Globals from "../../constants/Globals";
import { RFValue } from "react-native-responsive-fontsize";
import Header from "../../components/Header";
import LinkText from "../../components/LinkText";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function NZTAScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);
  const [linkPdf, setLinkPdf] = useState("");

  const [listMake, setListMake] = useState([]);
  const [listModel, setListModel] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [makeId, setMakeId] = useState("0");

  const [logged, setLogged] = useState("false");
  1;
  const [refresh, setRefresh] = useState(true);

  const [isFocused, setIsFocused] = useState("");

  const [odoLabel, setOdome] = useState();

  const [makeLabel, setMakeLabel] = useState("Toyota ");
  const [modelLabel, setModelLabel] = useState("Camry ");

  const [nameSeller, setNameSeller] = useState("");

  const [splashScreen, setSplashScreen] = useState(false);

  useEffect(() => {
    setupPage();
  }, []);

  const checkRego = () => {
    setModalVisible(true);
  };

  const setupPage = async () => {
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelectedPlace;
    } else {
      return MaStyles.textInputRowSplash;
    }
  };
  const styleFocusDesc = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelectedDesc;
    } else {
      return MaStyles.textInputRowDesc;
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

  const modalOptionsProvider3 = ({page, pageSize, customFilterKey3}) => {
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

  const makeSelected = (idMake: string, makeName: string) => {
    setMakeLabel(makeName);
    setMakeId(idMake);

    fetch(Globals.BASE_URL + "Maxauto/getModels/" + idMake)
      .then((response) => response.json())
      .then((data) => {
        setListModel(data.data);
      });
  };

  return splashScreen ? (
    <View
      style={[
        MaStyles.containerWhite,
        {marginHorizontal: 0, paddingHorizontal: 0},
      ]}
    ></View>
  ) : (
    <ScrollView
    style={{ flex: 1, backgroundColor: "white" }}
  >

    <Header 
    titleText="NZTA Services Links"
    onPressButton={() => navigation.goBack()}
    />


    <View style={{ flex: 8, marginHorizontal: 30,paddingBottom:50 }}>
        <Text style={[MaStyles.textHeaderMNZTA,{marginTop:20}]}>
          Motor Vehicles
        </Text>
        <LinkText linkText={"Renew your vehicle licence (rego)"} url={"https://transact.nzta.govt.nz/transactions/RenewVehicleLicence/entry"} />
        <LinkText linkText={"Put your vehicle licence (rego) on hold"} url={"https://transact.nzta.govt.nz/transactions/LicensingExemption/entry"} />
        <LinkText linkText={"Let NZTA know you’ve sold a vehicle"} url={"https://transact.nzta.govt.nz/transactions/NoticeOfDisposal/entry"} />
        <LinkText linkText={"Check your vehicle expire date (rego & Inspection)"} url={"https://transact.nzta.govt.nz/transactions/CheckExpiry/entry"} />
        <LinkText linkText={"Let NZTA know you’ve bought a vehicle"} url={"https://transact.nzta.govt.nz/transactions/NoticeOfAcquisition/entry"} />
        <LinkText linkText={"Update your address and contact details"} url={"https://transact.nzta.govt.nz/transactions/ChangeOfAddress/entry"} />

        <Text style={[MaStyles.textHeaderMNZTA]}>
        Road user charges (RUC)
        </Text>
        <LinkText linkText={"Pay road user charges (RUC) invoice"} url={"https://transact.nzta.govt.nz/v2/pay-ruc-invoice"} />
        <LinkText linkText={"Buy a road user charges (RUC) licence"} url={"https://transact.nzta.govt.nz/transactions/PurchaseRUCLicence/entry"} />

        <Text style={[MaStyles.textHeaderMNZTA]}>
        Tolling
        </Text>

        <LinkText linkText={"Already used a toll road? Pay a toll"} url={"https://tollingonline.nzta.govt.nz/#/purchasetrips/prerequisites"} />
        <LinkText linkText={"Pay a toll payment notice"} url={"https://tollingonline.nzta.govt.nz/#/notice/prerequisites"} />
        <LinkText linkText={"Log in to your toll account"} url={"http://tollingonline.nzta.govt.nz/TollingLogin/Account"} />
        <LinkText linkText={"View or refund paid tolls"} url={"https://tollingonline.nzta.govt.nz/#/refund/prerequisites"} />
        <LinkText linkText={"Going to use a toll road? Buy a toll"} url={"https://tollingonline.nzta.govt.nz/#/purchasetrips/prerequisites"} />
        <LinkText linkText={"Create a toll account"} url={"https://tollingonline.nzta.govt.nz/#/create-account/account-type"} />

    </View>

  </ScrollView>

      
    


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
    marginStart:-15
  },
});
