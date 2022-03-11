import { AntDesign } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StackScreenProps } from "@react-navigation/stack";
import { TextInputMask } from "react-native-masked-text";
import * as React from "react";
import { CheckBox } from "react-native-elements";
import {
  AsyncStorage,
  Dimensions,
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
import { useEffect, useRef, useState } from "react";
import Globals from "../../constants/Globals";
import VehicleListGrid from "../../components/VehicleComponents/VehicleListGrid";
import maxAuto from "../../api/maxAuto";
import { dateFormat1, findDaysDiffrent } from "../../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../components/CustomMarker";
import { SliderBox } from "react-native-image-slider-box";
import { SharedElement } from "react-navigation-shared-element";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { RFValue } from "react-native-responsive-fontsize";
import LandingScreen from "../../components/LandingScreen";
import DoneScreen from "../../components/DoneScreen";
import Loader from "../../components/Loader";
import VehicleBoxDetails from "../../components/VehicleBoxDetails";
import ProgressBar from "../../components/ProgressBar";
import FooterBar from "../../components/FooterBar";
import CalendarModal from "../../components/CalendarModal";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function SalesAgreementScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);
  const [linkPdf, setLinkPdf] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [listMake, setListMake] = useState([]);
  const [listModel, setListModel] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [makeId, setMakeId] = useState("0");
  const [logged, setLogged] = useState("false");
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [dateLabel, setDateLabel] = useState("12/12/2021");
  const [regoChecked, setRegoChecked] = useState(false);
  const [page0, setPage0] = useState(false);
  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [pageSeller, setPageSeller] = useState(false);
  const [pageBuyer, setPageBuyer] = useState(false);
  const [odoLabel, setOdome] = useState();
  const [makeLabel, setMakeLabel] = useState("Toyota ");
  const [modelLabel, setModelLabel] = useState("Camry ");
  const [pageActive, setPageActive] = useState(1);
  const [rego, setRego] = useState("");
  const [findRego, setRegoFind] = useState("");
  const [modelId, setModelId] = useState("0");
  const [vin, setVin] = useState("");
  const [desc, setDesc] = useState("");
  const [nameSeller, setNameSeller] = useState("");
  const [addressSeller, setAddressSeller] = useState("");
  const [phoneSeller, setPhoneSeller] = useState("");
  const [nameBuyer, setNameBuyer] = useState("");
  const [addressBuyer, setAddressBuyer] = useState("");
  const [phoneBuyer, setPhoneBuyer] = useState("");
  const [price, setPrice] = useState("");
  const [methodOption, setMethodOption] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState(true);
  const [date, setDate] = useState(new Date());
  const [dateWof, setDateWof] = useState(new Date());
  const [dateLicense, setDateLicense] = useState(new Date());
  const [datePay, setDatePay] = useState(new Date());
  const [dateL, setDateL] = useState();
  const [dateWofL, setDateWofL] = useState();
  const [dateLicenseL, setDateLicenseL] = useState("");
  const [datePayL, setDatePayL] = useState();
  const [dateDeliveryL, setDeliveryDateL] = useState();
  const [splashScreen, setSplashScreen] = useState(false);
  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findVIN, setFindVIN] = useState("");
  const [findVehicle, setFindVehicle] = useState(true);
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [nextTitle, setNextTitle] = useState("Next");
  const [backTitle, setBackTitle] = useState("");
  const [idCustomer, setIdCustomer] = useState("");
  const [bottomHeigth, setBottomHeigth] = useState(100);

  const [regoModal, setRegoModal] = useState(false);
  const [wofModal, setWofModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);

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

  const regionSelected = (idRegion: string, nameRegion: string) => {
    //console.log(nameRegion)
    //setModalVisible(false);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
    setPage(1);
    maxAuto.getWantedList(1, idRegion).then((result) => {
      console.log(result);
      setListCar(result);
      setLoading(false);
      setRefresh(!refresh);
    });
  };

  const generatePdf = async () => {
    setLoading(true);
    fetch(Globals.BASE_URL + "Maxauto/generatePdfAgreement/" + idCustomer, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfSale: dateL,
        idMake: findMake,
        idModel: findModel,
        rego: rego,
        vin: findVIN,
        dateLicense: dateLicenseL,
        dateWof: dateWofL,
        odo: odoLabel,
        desc: desc,
        nameSeller: nameSeller,
        addressSeller: addressSeller,
        phoneSeller: phoneSeller,
        nameBuyer: nameBuyer,
        addressBuyer: addressBuyer,
        phoneBuyer: phoneBuyer,
        price: price,
        method: methodOption,
        delivery: deliveryOption,
        datePay: datePayL,
        dateDelivery: dateDeliveryL,
        year: findYear,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setLinkPdf(data.data.document_url_final);
        setPage4(false);
        setPage5(true);
        //saveImage
      });
  };

  const setupPage = async () => {
    const idCustomer1 = await AsyncStorage.getItem("customer_id");
    setIdCustomer(idCustomer1);
    let region_default = await AsyncStorage.getItem("region_default");
    let region_id = await AsyncStorage.getItem("region_default_id");

    fetch(Globals.BASE_URL + "Maxauto/allPlacesList")
      .then((response) => response.json())
      .then((data) => {
        setRegionList(data.data.region_list);
      });

    fetch(Globals.BASE_URL + "Maxauto/getAllMake")
      .then((response) => response.json())
      .then((data) => {
        setListMake(data.data);
      });
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

  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return day + "/" + month + "/" + year;
  }

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
    modalRef2.show();
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

  const styleFocusSearchBox = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputSelectedM;
    } else {
      return MaStyles.textInputM;
    }
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

  const styleFocus1 = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected2;
    } else {
      return MaStyles.textInputRow2;
    }
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

  const handlePressLandingButton = () => {
    setPage0(true);
    setSplashScreen(true);
  };

  const handlePressNext = () => {
    console.log(step);
    switch (step) {
      case 0:
        setStep(1);
        setPage3(true);
        setPage2(false);
        setBackTitle("Back");
        break;
      case 1:
        setStep(2);
        setPageBuyer(true);
        setPage3(false);
        break;
      case 2:
        setStep(3);
        setPage4(true);
        setPageBuyer(false);
        setNextTitle("Generate");
        break;

      case 3:
        generatePdf();
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
        break;
      case 1:
        setStep(0);
        setPage2(true);
        setPage3(false);
        setBackTitle("");
        break;

      case 2:
        setStep(1);
        setPageBuyer(false);
        setPage3(true);
        break;

      case 3:
        setStep(2);
        setPageBuyer(true);
        setPage4(false);
        setNextTitle("Next");
        break;
      default:
        break;
    }
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

  const findPlateDetails = () => {
    setLoading(true);
    setRegoFind(rego);
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

  const labelStyle = (text: string) => {
    if (text == "") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const [regoDate, setRegoDate] = useState("");
  const [regoDateR, setRegoDateR] = useState(new Date());

  const [wofDate, setWofDate] = useState("");
  const [wofDateR, setWofDateR] = useState(new Date());

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryDateR, setDeliveryDateR] = useState(new Date());

  const [payDate, setPayDate] = useState("");
  const [payDateR, setPayDateR] = useState(new Date());

  const selectRegoDate = (regoDate) => {
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setRegoModal(false);
    setRegoDate(regoNew);
    setRegoDateR(regoDate.dateString);
  };

  const selectWofDate = (regoDate) => {
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setWofModal(false);
    setWofDate(regoNew);
    setWofDateR(regoDate.dateString);
  };

  const selectDeliveryDate = (regoDate) => {
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setDeliveryModal(false);
    setDeliveryDate(regoNew);
    setDeliveryDateR(regoDate.dateString);
  };

  const selectPayDate = (regoDate) => {
    let regoNew = dateFormat1(regoDate.dateString);
    console.log(regoDate);
    setPayModal(false);
    setPayDate(regoNew);
    setPayDateR(regoDate.dateString);
  };

  //element Form
  const scrollViewRef = useRef(null);
  const scrollViewRef2 = useRef(null);
  const scrollViewRef3 = useRef(null);
  const scrollViewRef4 = useRef(null);
  const additionalNote = useRef(null);
  const phoneNumber = useRef(null);
  const phoneNumber2 = useRef(null);

  const willPay = useRef(null);
  const willDelivery = useRef(null);

  const scrollTo = (element: any, scrollView: any) => {
    element.current.measure(
      (width: any, height: any, px: any, py: any, fx: any, fy: any) => {
        const location = {
          fx: fx,
          fy: fy,
          px: px,
          py: py,
          width: width,
          height: height,
        };
        console.log(location);
        scrollView.current?.scrollTo({ y: location.fy - 150, animated: true });
      }
    );
  };

  return splashScreen ? (
    <View
      style={[
        MaStyles.containerWhite,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      {/* page0 */}
      {page0 && (
        <View style={{ width: "100%" }}>
          <Row style={{ paddingHorizontal: 20, height: 40, marginTop: 0 }}>
            <Grid>
              <Col onPress={() => navigation.goBack()}>
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
                  placeholder={"Plate Number or VIN"}
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
          {loading ? (
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
            <VehicleBoxDetails
              rego={rego}
              year={findYear}
              make={findMake}
              model={findModel}
              isStolen={false}
              vin={""}
              onPressButton={() => {
                setPage0(false);
                setPage2(true);
                setIsVisible(true);
              }}
              isFind={findVehicle}
              isPoliceField={false}
            />
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
              style={{ marginTop: -1 }}
              onPress={() => navigation.goBack()}
              size={10}
            >
              <Text style={MaStyles.textHeader}>Vehicle Sales Agreement</Text>
            </Col>
          </Grid>
        </Row>

        <Row style={{ marginHorizontal: 20, marginTop: 0 }} size={16}>
          {page1 && (
            <View style={{ width: "100%" }}>
              <Row style={{ height: 34 }}>
                <Col style={{ height: 20 }}>
                  <TouchableOpacity style={MaStyles.buttonViewWhiteN}>
                    <Text style={MaStyles.buttonTextWhiteN}>
                      <AntDesign name="left" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={3} style={{ height: 20 }}>
                  <TouchableOpacity style={MaStyles.buttonViewN}>
                    <Text style={MaStyles.buttonTextNear}>Date of Sale</Text>
                  </TouchableOpacity>
                </Col>
                <Col style={{ height: 20 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPage1(false);
                      setPage2(true);
                    }}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <Text
                      style={[MaStyles.buttonTextWhiteN, { marginStart: 4 }]}
                    >
                      <AntDesign name="right" size={25} color="#0e4e92" />
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>

              <Row style={{ marginTop: 50, height: 40 }}>
                <Col>
                  <TextInputMask
                    onBlur={() => {
                      setIsFocused("");
                    }}
                    style={styleFocus("date1")}
                    onFocus={() => setIsFocused("date1")}
                    placeholderTextColor={"#d4d3d9"}
                    type={"datetime"}
                    options={{
                      format: "DD/MM/YYYY",
                    }}
                    placeholder="dd/mm/yyyy"
                    value={dateL}
                    onChangeText={(text) => {
                      setDateL(text);
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15, height: 40, marginBottom: 100 }}>
                <Col>
                  <TouchableOpacity
                    style={{ marginTop: 0 }}
                    onPress={() => {
                      setPage1(false);
                      setPage2(true);
                    }}
                  >
                    <View style={MaStyles.buttonView}>
                      <Text style={MaStyles.buttonText}>Continue</Text>
                    </View>
                  </TouchableOpacity>
                </Col>
              </Row>
            </View>
          )}

          {/* page2 */}
          {page2 && (
            <ScrollView
              ref={scrollViewRef}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: bottomHeigth }}
            >
              <ProgressBar stepActive={0} titleText={"Vehicle Details"} />

              <View
                style={{
                  marginTop: 40,
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
                    <Text style={[MaStyles.titleInput, { marginTop: 10 }]}>
                      VIN: {findVIN}
                    </Text>
                  </Col>
                  <Col style={{ justifyContent: "center" }}>
                    <Image
                      style={{ width: 40, height: 40, alignSelf: "center" }}
                      source={require("../../assets/images/checked.png")}
                    ></Image>
                  </Col>
                </Row>
              </View>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Registration Due</Text>
              </Row>

              <CalendarModal
                value={regoDateR}
                title=" Select REGO expire date"
                onBackdropPress={() => setRegoModal(false)}
                onBackButtonPress={() => setRegoModal(false)}
                onDayPress={function (day: any): void {
                  selectRegoDate(day);
                }}
                isVisible={regoModal}
              />

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <Text
                    style={labelStyle(regoDate)}
                    onPress={() => setRegoModal(true)}
                  >
                    {regoDate}
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>WOF Due</Text>
              </Row>

              <CalendarModal
                value={wofDateR}
                title=" Select REGO expire date"
                onBackdropPress={() => setWofModal(false)}
                onBackButtonPress={() => setWofModal(false)}
                onDayPress={function (day: any): void {
                  selectWofDate(day);
                }}
                isVisible={wofModal}
              />

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <Text
                    style={labelStyle(wofDate)}
                    onPress={() => setWofModal(true)}
                  >
                    {wofDate}
                  </Text>
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Odometer (KM)</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <TextInputMask
                    placeholder="3,500"
                    onBlur={() => {
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

              <Row style={{ marginTop: 10 }}>
                <Text style={[MaStyles.titleInput]}>
                  Additional Conditions{" "}
                  <Text style={{ fontSize: 10, color: "gray" }}>
                    (Optional)
                  </Text>
                </Text>
              </Row>

              <Row style={{ marginTop: 15, height: 300, paddingBottom: 300 }}>
                <Col>
                  <TextInput
                    ref={additionalNote}
                    multiline={true}
                    onChangeText={(text) => {
                      setDesc(text);
                    }}
                    numberOfLines={4}
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(100);
                    }}
                    autoCompleteType={"email"}
                    placeholderTextColor={"#d4d3d9"}
                    style={styleFocusDesc("desc")}
                    onFocus={() => {
                      setIsFocused("desc");
                      setBottomHeigth(500);
                      scrollTo(additionalNote, scrollViewRef);
                    }}
                    //onChangeText={text => setRego(text)}
                    //onSubmitEditing={() => { checkRego() }}
                  />
                </Col>
              </Row>

              <Row
                style={{ marginTop: 15, height: 10, marginBottom: 80 }}
              ></Row>
            </ScrollView>
          )}

          {page3 && (
            <ScrollView
              ref={scrollViewRef2}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: bottomHeigth }}
            >
              <ProgressBar stepActive={1} titleText={"Buyer's Details"} />

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Name</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"John"}
                    onBlur={() => {
                      setIsFocused("");
                    }}
                    style={styleFocus("ns")}
                    onFocus={() => setIsFocused("ns")}
                    onChangeText={(text) => setNameSeller(text)}
                    value={nameSeller}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Address</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"123 Oceanview Road"}
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(100);
                    }}
                    style={styleFocus("as")}
                    onFocus={() => {
                      setIsFocused("as");
                      setBottomHeigth(500);
                    }}
                    onChangeText={(text) => setAddressSeller(text)}
                    value={addressSeller}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Phone Number</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    ref={phoneNumber}
                    keyboardType={"phone-pad"}
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"0927201130"}
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(100);
                    }}
                    style={styleFocus("ps")}
                    onFocus={() => {
                      setIsFocused("ps");
                      setBottomHeigth(500);
                      scrollTo(phoneNumber, scrollViewRef2);
                    }}
                    onChangeText={(text) => setPhoneSeller(text)}
                    value={phoneSeller}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 15, height: 0, marginBottom: 80 }}></Row>
            </ScrollView>
          )}

          {pageBuyer && (
            <ScrollView
              ref={scrollViewRef3}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: bottomHeigth }}
            >
              <ProgressBar stepActive={2} titleText={"Seller's Details"} />

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Name</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"John"}
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(100);
                    }}
                    style={styleFocus("nb")}
                    onFocus={() => {
                      setIsFocused("nb");
                      setBottomHeigth(500);
                    }}
                    onChangeText={(text) => setNameBuyer(text)}
                    value={nameBuyer}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Address</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"123 Oceanview Road"}
                    onBlur={() => {
                      setIsFocused("");
                    }}
                    style={styleFocus("ab")}
                    onFocus={() => setIsFocused("ab")}
                    onChangeText={(text) => setAddressBuyer(text)}
                    value={addressBuyer}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Phone Number</Text>
              </Row>

              <Row style={{ marginTop: 15, height: 40 }}>
                <Col>
                  <TextInput
                    ref={phoneNumber2}
                    keyboardType={"phone-pad"}
                    placeholderTextColor={"#d4d3d9"}
                    placeholder={"0927201130"}
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(0);
                    }}
                    style={styleFocus("pb")}
                    onFocus={() => {
                      setIsFocused("pb");
                      setBottomHeigth(500);
                      scrollTo(phoneNumber2, scrollViewRef3);
                    }}
                    onChangeText={(text) => setPhoneBuyer(text)}
                    value={phoneBuyer}
                  />
                </Col>
              </Row>

              <Row
                style={{ marginTop: 15, height: 40, marginBottom: 80 }}
              ></Row>
            </ScrollView>
          )}

          {page4 && (
            <ScrollView
              ref={scrollViewRef4}
              style={{ width: "100%", height: height, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: bottomHeigth }}
            >
              <ProgressBar stepActive={3} titleText={"Payment & Delivery"} />

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Date Of Sale</Text>
              </Row>

              <Row style={{ marginTop: 20, height: 40 }}>
                <Col>
                  <TextInputMask
                    onBlur={() => {
                      setIsFocused("");
                      setBottomHeigth(100);
                    }}
                    style={styleFocus("date1")}
                    onFocus={() => {
                      setIsFocused("date1");
                      setBottomHeigth(400);
                    }}
                    placeholderTextColor={"#d4d3d9"}
                    type={"datetime"}
                    options={{
                      format: "DD/MM/YYYY",
                    }}
                    placeholder="dd/mm/yyyy"
                    value={dateL}
                    onChangeText={(text) => {
                      setDateL(text);
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 10, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Sale Price (NZD)</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 40 }}>
                <Col>
                  <TextInputMask
                    placeholder="$55,000"
                    onBlur={() => {
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

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Method of Payment</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 55 }}>
                <Col style={{ width: "100%", borderRadius: 5 }}>
                  <CheckBox
                    center
                    title="Buyer will pay on date of sale"
                    checkedIcon="dot-circle-o"
                    checkedColor="#0e4e92"
                    uncheckedIcon="circle-o"
                    checked={methodOption}
                    onPress={() => setMethodOption(true)}
                    textStyle={MaStyles.checkBoxTitle}
                    containerStyle={{
                      marginStart: -1,
                      backgroundColor: "white",
                      borderColor: "white",
                      width: "100%",
                      height: 45,
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                      paddingStart: 0,
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 10, height: 55 }}>
                <Col size={1}>
                  <CheckBox
                    center
                    title="Buyer will pay by: "
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor="#0e4e92"
                    checked={!methodOption}
                    onPress={() => setMethodOption(false)}
                    textStyle={MaStyles.checkBoxTitle}
                    containerStyle={{
                      marginStart: -1,
                      backgroundColor: "white",
                      borderColor: "white",
                      width: "100%",
                      height: 45,
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                      paddingStart: 0,
                    }}
                  />
                </Col>
                <Col>
                  <Row style={{ marginTop: 5, height: 30, marginStart: 0 }}>
                    <Col>
                      <Text style={{ marginTop: -28 }} ref={willPay}></Text>

                      <CalendarModal
                        value={deliveryDateR}
                        title=" Select REGO expire date"
                        onBackdropPress={() => setDeliveryModal(false)}
                        onBackButtonPress={() => setDeliveryModal(false)}
                        onDayPress={function (day: any): void {
                          selectDeliveryDate(day);
                        }}
                        isVisible={deliveryModal}
                      />

                      <Row style={{ marginTop: 10, height: 40 }}>
                        <Col>
                          <Text
                            style={labelStyle(deliveryDate)}
                            onPress={() => setDeliveryModal(true)}
                          >
                            {deliveryDate}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>Delivery Details</Text>
              </Row>

              <Row style={{ marginTop: 10, height: 55 }}>
                <Col>
                  <CheckBox
                    center
                    title="Buyer will pick-up"
                    checkedIcon="dot-circle-o"
                    checkedColor="#0e4e92"
                    uncheckedIcon="circle-o"
                    checked={deliveryOption}
                    onPress={() => setDeliveryOption(true)}
                    textStyle={MaStyles.checkBoxTitle}
                    containerStyle={{
                      marginStart: -1,
                      backgroundColor: "white",
                      borderColor: "white",
                      width: "100%",
                      height: 45,
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                      paddingStart: 0,
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 10, height: 55 }}>
                <Col size={1}>
                  <CheckBox
                    center
                    title="Seller will deliver"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor="#0e4e92"
                    checked={!deliveryOption}
                    onPress={() => setDeliveryOption(false)}
                    textStyle={MaStyles.checkBoxTitle}
                    containerStyle={{
                      marginStart: -1,
                      backgroundColor: "white",
                      width: "100%",
                      height: 50,
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                      paddingStart: 0,
                      borderColor: "white",
                    }}
                  />
                </Col>
                <Col style={{ marginTop: 5 }}>
                  <Text style={{ marginTop: -28 }} ref={willDelivery}></Text>
                  <CalendarModal
                    value={payDateR}
                    title=" Select REGO expire date"
                    onBackdropPress={() => setPayModal(false)}
                    onBackButtonPress={() => setPayModal(false)}
                    onDayPress={function (day: any): void {
                      selectPayDate(day);
                    }}
                    isVisible={payModal}
                  />

                  <Row style={{ marginTop: 10, height: 40 }}>
                    <Col>
                      <Text
                        style={labelStyle(payDate)}
                        onPress={() => setPayModal(true)}
                      >
                        {payDate}
                      </Text>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row
                style={{ marginTop: 15, height: 40, marginBottom: 100 }}
              ></Row>
            </ScrollView>
          )}

          {/* page5 */}
          {page5 && (
            <View
              style={{
                width: width - 40,
                height: height - 60,
                position: "absolute",
                marginTop: -60,
              }}
            >
              <DoneScreen
                titleText={"Your agreement is ready!"}
                subTitleText={"Click on the button below to view"}
                onPressButton={() => {
                  Linking.openURL(linkPdf);
                }}
                buttonText={"View Agreement"}
                uriImage={require("../../assets/images/splash/agree.png")}
              />
            </View>
          )}
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
    </View>
  ) : (
    <LandingScreen
      titleText={"Vehicle Sales Agreement"}
      subTitleText={
        " Selling or buying a vehicle privately? Use this to create a sales document to protect both parties."
      }
      onPressButton={() => {
        handlePressLandingButton();
      }}
      buttonText={"Generate agreement"}
      uriImage={require("../../assets/images/splash/agree.png")}
    />
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
});
