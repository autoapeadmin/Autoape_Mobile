import { AntDesign, Feather } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Alert,
  Animated,
  AsyncStorage,
  Button,
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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import MaStyles from "../assets/styles/MaStyles";
import CachedImage from "react-native-expo-cached-image";
import { RootStackParamList } from "../types";
import { useEffect, useState } from "react";
import Globals from "../constants/Globals";
import maxAuto from "../api/maxAuto";
import Carousel, { Pagination } from "react-native-snap-carousel";
import StripeCheckout from "react-native-stripe-checkout-webview";
import ModalR from "react-native-modal";
import { RFValue } from "react-native-responsive-fontsize";
import DoneScreen from "../components/DoneScreen";
import Loader from "../components/Loader";
import VehicleBoxDetails from "../components/VehicleBoxDetails";
import LandingScreen from "../components/LandingScreen";
import PaymentScreen from "../components/PaymentScreen";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

interface ItemProps {
  title: string;
  text: string;
  image: string;
  flag: boolean;
  desc1: string;
  desc2: string;
  desc3: string;
  desc4: string;
  desc5: string;
  price: string;
}

interface RenderItemProps {
  item: ItemProps;
  index: number;
}

export default function DocumentReportScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe();

  const [clientSecret, setClientSecret] = useState<string>();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading3, setLoadng] = useState(false);

  useEffect(() => {
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    initialisePaymentSheet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*   const response = await fetch(
      "https://saber-strengthened-beech.glitch.me/payment-sheet?email=" + email + "&price=1000",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ); */
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
      generateReport();
    }
    setPaymentSheetEnabled(false);
    setLoadng(false);
  };

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

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);

  const [fromRealSale, setFromRealSale] = useState("0");

  const [customerID, setCustomerId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [logged, setLogged] = useState("false");

  const [refresh, setRefresh] = useState(true);
  const [paymentPage, setPaymentPage] = useState(false);
  const [landing, SetLanding] = useState(false);
  const [key, isKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [downloadPdfView, setDownloadPdfView] = useState(false);

  const [nameSeller, setNameSeller] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFocused, setIsFocused] = useState("");

  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findStolen, setFindStolen] = useState(true);
  const [findRego, setRegoFind] = useState("");
  const [findVehicle, setFindVehicle] = useState(true);

  const [pdfURL, setPDFURl] = useState("");
  const [stripeId, setStripeID] = useState("");
  const [loading2, setLoading2] = useState(false);

  const handlePressDownalod = () => {
    Linking.openURL(
      Globals.BASE_URL + "documents/vehiclereport/JCG38202109200124.pdf"
    );
  };

  const onRefresh = React.useCallback(async () => {
    setPage(1);
    setRefreshing(true);
    setupPage();
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    setupPage();
  }, []);

  const goPayment = async () => {
    maxAuto.getSessionStripe("95" + "0").then((result) => {
      console.log(result);
      setStripeID(result);
      setPaymentPage(true);
    });
  };

  const generateReport = () => {
    console.log("generating report....");
    setLoading2(true);
    setPaymentPage(false);
    setDownloadPdfView(false);
    setLoadingPdf(true);
    maxAuto.getReportPDF(rego, customerID).then((result) => {
      console.log(result);
      setPDFURl(result.document_url_final);
      setLoadingPdf(false);
      setDownloadPdfView(true);
      setLoading2(false);
    });
  };

  const renderItem = ({ item, index }) => {
    if (item.title == "Car") {
      return (
        <View
          style={{
            width: "100%",
            marginTop: 40,
            paddingHorizontal: 30,
            backgroundColor: "white",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              style={{
                marginTop: "5%",
                width: "80%",
                height: 250,
                alignSelf: "center",
                resizeMode: "contain",
                overflow: "visible",
              }}
              source={require("../assets/images/splash/vehiclereportlanding.png")}
              resizeMode="cover"
            />
            <Text style={[MaStyles.textHeaderM, { marginTop: RFValue(20) }]}>
              Comprehensive Vehicle History {"\n"}Report
            </Text>
            <Text style={[MaStyles.textSubM]}>
              Buying a Car or Motorbike is a big decision. Many are bought with
              hidden problems that can cost thousands of dollars. These include
              money owning, unreliable odometers, damages etc.
              {"\n"} {"\n"} Get full NZ history vehicle report and buy with
              peace of mind.{" "}
              <Text
                onPress={() => handlePressDownalod()}
                style={{ color: "#0e4e92" }}
              >
                Download sample report.
              </Text>
            </Text>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            marginTop: 0,
            paddingHorizontal: 30,
            backgroundColor: "white",
            paddingTop: RFValue(80),
          }}
        >
          <Text style={MaStyles.textHeaderM}>
            An AutoApe Vehicle History Report Features:
          </Text>
          <ScrollView>
            <Grid style={{ paddingBottom: 60 }}>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> Any money owning</Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}>
                    {" "}
                    Registration, expired or cancelled
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}>
                    {" "}
                    Current warrant of fitness (WOF)
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> Odometer reliability</Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> Damaged import check</Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}>
                    {" "}
                    Road user charges (RUC)
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> NZ new or imported</Text>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> Stolen vehicle check</Text>
                </Col>
              </Row>
              <Row style={{ height: 40 }}>
                <Col style={{ width: 40 }}>
                  <Image
                    style={{ width: 30, height: 30, marginTop: 28 }}
                    source={require("../assets/images/splash/tick.png")}
                  ></Image>
                </Col>
                <Col>
                  <Text style={MaStyles.textSubM}> And more</Text>
                </Col>
              </Row>
              <Row
                onPress={() => handlePressDownalod()}
                style={{ height: "100%", width: "100%" }}
              >
                <Text style={MaStyles.textSubMDownload}>
                  {" "}
                  Download Sample Report
                </Text>
              </Row>
            </Grid>
          </ScrollView>
        </View>
      );
    }
    //Pigments
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "AutoApe | Vehicle",
        url: require("../assets/images/logo.png"),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const setupPage = async () => {
    setPage(1);
    const logged = await AsyncStorage.getItem("logged");
    const idCustomer = await AsyncStorage.getItem("customer_id");
    const email = await AsyncStorage.getItem("customer_email");

    setCustomerId(idCustomer);
    console.log("aca" + idCustomer);
    setLogged(logged);
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected;
    } else {
      return MaStyles.textInputRow;
    }
  };

  const styleFocusSearchBox = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputSelectedM;
    } else {
      return MaStyles.textInputM;
    }
  };

  const findPlateDetails = () => {
    setLoading(true);
    setDownloadPdfView(false);
    setRegoFind(rego);
    maxAuto.getMotoChekDetails(rego, "free").then((result) => {
      console.log(result.data);
      setLoading(false);
      if (result.data.find === false) {
        setFindVehicle(false);
        setRegoChecked(true);
      } else {
        setFindMake(result.data.make);
        setFindModel(result.data.model);
        setFindYear(result.data.year);
        // setFindVIN(result.data.vin);
        setRegoChecked(true);
        setFindVehicle(true);
      }
    });

    //getMotoChekDetails
  };

  const [regoChecked, setRegoChecked] = useState(false);
  const [page0, setPage0] = useState(false);

  const handlePressLandingButton = (pdfUrl: string) => {
    Linking.openURL(pdfUrl);
  };

  const [rego, setRego] = useState("");

  return landing ? (
    <PaymentScreen>
      <View
        style={[
          MaStyles.containerWhite,
          { marginHorizontal: 0, paddingHorizontal: 0 },
        ]}
      >
        {page0 && (
          <View style={{ width: "100%" }}>
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
                  ></View>
                )}
              </View>
            </ModalR>

            <Row style={{ paddingHorizontal: 20, height: 40, marginTop: 0 }}>
              <Grid>
                <Col
                  onPress={() => {
                    setPage0(false);
                    SetLanding(false);
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

            {loading2 ? (
              <View
                style={{
                  width: "100%",
                  alignContent: "center",
                  marginStart: width / 2 - 35,
                }}
              >
                <Loader title="Generating Report" />
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
                isStolen={findStolen}
                vin={""}
                onPressButton={() => {
                  openPaymentSheet();
                  //setPaymentPage(true);
                  //generateReport();
                }}
                isFind={findVehicle}
                isPoliceField={false}
              />
            ) : (
              <View></View>
            )}
          </View>
        )}
        {/* downloadPdfView */}
        {downloadPdfView && (
          <View style={{ width: "100%", height: "100%", position: "absolute" }}>
            <LandingScreen
              titleText={"Your report is ready!"}
              subTitleText={"Click on the button below to view"}
              onPressButton={() => {
                handlePressLandingButton(pdfURL);
              }}
              buttonText={"View Report"}
              uriImage={require("../assets/images/splash/ready.png")}
            />
          </View>
        )}
      </View>
    </PaymentScreen>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <View style={{ flex: 9 }}>
        <Carousel
          layoutCardOffset={0}
          layout={"default"}
          data={exampleItems}
          renderItem={renderItem}
          containerCustomStyle={{ marginTop: 0 }}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index: number) => setActiveIndex(index)}
          // scrollInterpolator={scrollInterpolators.scrollInterpolator2}
          //slideInterpolatedStyle={animatedStyles.animatedStyles2}
        />

        <Pagination
          dotsLength={2}
          activeDotIndex={activeIndex}
          //containerStyle={(isIphone) ? styles.pagiIOS : styles.pagiAndroid}
          dotStyle={{
            width: 20,
            height: 5,
            borderRadius: 7.5,
            //    marginHorizontal: 8,
            backgroundColor: "#0e4e9294",
          }}
          inactiveDotStyle={{
            backgroundColor: "gray",
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          setPage0(true);
          SetLanding(true);
        }}
        style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20 }}
      >
        <ImageBackground
          source={require("../assets/images/gradiantbg.png")}
          style={{ width: "100%", height: 50, alignItems: "center" }}
          imageStyle={{ borderRadius: 200 }}
        >
          <Text style={[MaStyles.buttonTextM]}>Get Report $9.50</Text>
        </ImageBackground>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  cardField: {
    width: "100%",
    height: 50,
    marginBottom: 20,
    marginTop: 30,
  },
});
