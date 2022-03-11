import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { TextInputMask } from "react-native-masked-text";
import LottieView from "lottie-react-native";
import * as React from "react";
import { CheckBox } from "react-native-elements";
import { ModalSelectList } from "react-native-modal-select-list";
import {
  Alert,
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
import { Col, Grid, Row } from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import Modal from "react-native-modal";
import { RootStackParamList } from "../../types";
import { useEffect, useState } from "react";
import Globals from "../../constants/Globals";
import maxAuto from "../../api/maxAuto";
import LandingScreen from "../../components/LandingScreen";
import Loader from "../../components/Loader";
import VehicleBoxDetails from "../../components/VehicleBoxDetails";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { dateFormat1 } from "../../utils/DateFunctions";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function OwnerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [rego, setRego] = useState("");
  const [license, setLicence] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");

  const [splashScreen, setSplashScreen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [findVehicle, setFindVehicle] = useState(false);
  const [isMatch, setIsMatch] = useState(true);

  const [page0, setPage0] = useState(false);
  const [page3, setPage3] = useState(false);
  const [isFocused, setIsFocused] = useState("");

  const [driverLicense, setDriverLicense] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [optionSelected, setOptionSelected] = useState(0);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setupPage();
  }, []);

  const checkRego = () => {
    //checkOwner
    setLoading(true);
    maxAuto
      .getOwnerCheck(rego, firstName, lastName, license, date)
      .then((result) => {
        console.log(result);
        setLoading(false);
        if (result.data.find === false) {
          //  setFindMake("Nissan");
          //  setFindModel("Note");
          setFindVehicle(true);
        } else {
          setIsMatch(result.data.isMatch);
          setFindVehicle(true);
        }
      });
  };

  const setupPage = async () => {};

  const handlePressLandingButton = () => {
    setPage0(true);
    setSplashScreen(true);
  };

  const checkOwner = () => {
    let opt = optionSelected;
    console.log(opt); 
    setLoading(true);
    console.log(license);
    setPage2(false);
    setPage3(true);

    if(opt==1){
      console.log("aca3");
      maxAuto.ownerLicense(rego, driverLicense.trim()).then((result) => {
        setPage2(true);
        setPage3(false);
        console.log(result.data.matchField);
        if(result.data.matchField){
          Alert.alert("We can confirm that the individual specified on the driver licence number " + driverLicense + " is the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }else{
          Alert.alert("We can confirm that the individual specified on the driver licence number " + driverLicense + " is not the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }

        setLoading(false);
        });
    }else if(opt==3){
      console.log("aca3");

      maxAuto.ownerName(rego, firstName.trim(),lastName.trim()).then((result) => {
        setPage2(true);
        setPage3(false);
        console.log(result.data.matchField);
        if(result.data.matchField){
          Alert.alert("We can confirm that " + firstName + " " + lastName+" is the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }else{
          Alert.alert("We can confirm that " + firstName + " " + lastName+" is not the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }
        setLoading(false);
        });
    }else if(opt==2){
      console.log("aca3");
      maxAuto.ownerCompany(rego, companyName ).then((result) => {
        setPage2(true);
        setPage3(false);
        console.log(result.data.matchField);
        if(result.data.matchField){
          Alert.alert("We can confirm that " + companyName + " is the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }else{
          Alert.alert("We can confirm that " + companyName + " is not the registered person of " + rego + " as at " + dateFormat1(Date.now()));
        }

        setLoading(false);
        });
    }
  };

  const styleFocusSearchBox = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputSelectedM;
    } else {
      return MaStyles.textInputM;
    }
  };

  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findStolen, setFindStolen] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [regoChecked, setRegoChecked] = useState(false);

  const findPlateDetails = () => {
    setLoading(true);
    maxAuto.getMotoChekDetails(rego, "police").then((result) => {
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
        setRegoChecked(true);
        setFindVehicle(true);
        let stolen = result.data.isStolen == "true";
        setFindStolen(stolen);
      }
    });

    //getMotoChekDetails
  };

  const [page2, setPage2] = useState(false);
  const generateReport = () => {
    //setPaymentPage(false);
    if (!findStolen) {
      setPage0(false);
      setPage2(true);
    }
  };

  const [locationLabel, setLocationLabel] = useState("Select method ");
  const locationL = () => {
    if (locationLabel == "Select method ") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  let modalRef4;
  const openModal4 = () => {
    modalRef4.show();
  };

  const saveModalRef4 = (ref4) => (modalRef4 = ref4);
  const onSelectedOption4 = (value) => {
    let res = value.split("|");
    //modelSelected(res[0], res[1])
    //setBodyLabel(res[0]);
    setOptionSelected(res[1]);
    setLocationLabel(res[0]);
    console.log("option selected" + optionSelected);
  };

  const createStaticModalOptions4 = () => {
    const options = [];

    const listBody = [
      {
        value: 1,
        desc: "Owner's Driver License",
      },
      {
        value: 2,
        desc: "Company Name",
      },
      {
        value: 3,
        desc: "Owner's Name",
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
        value: 1,
        desc: "Owner's Driver License",
      },
      {
        value: 2,
        desc: "Company Name",
      },
      {
        value: 3,
        desc: "Owner's Name",
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

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected;
    } else {
      return MaStyles.textInputRow;
    }
  };

  return splashScreen ? (
    <View
      style={[
        MaStyles.containerWhite,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      {page0 && (
        <View style={{ width: "100%" }}>
          <Row style={{ paddingHorizontal: 20, height: 45, marginTop: 0 }}>
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
                generateReport();
              }}
              isFind={findVehicle}
              isPoliceField={false}
            />
          ) : (
            <View></View>
          )}
        </View>
      )}

      {page2 && (
        <Grid>
          <Row style={{ paddingHorizontal: 20, height: 45, marginTop: 0 }}>
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
                <Text style={MaStyles.textHeaderScreenM}>Verify Ownership</Text>
              </Col>
            </Grid>
          </Row>
          <Row style={{ marginHorizontal: 20, marginTop: 0 }} size={16}>
            <KeyboardAwareScrollView
              enableAutomaticScroll={Platform.OS === "ios"}
              style={{ width: "100%", paddingTop: 0 }}
              behavior={"padding"}
              contentContainerStyle={{ paddingBottom: 0 }}
            >
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
                      style={{ width: 40, height: 45, alignSelf: "center" }}
                      source={require("../../assets/images/checked.png")}
                    ></Image>
                  </Col>
                </Row>
              </View>
              <Row style={{ marginTop: 0, height: 45 }}>
                <Text style={[MaStyles.titleInput]}>
                  Verify ownership using:
                </Text>
              </Row>
              <Row style={{ marginTop: 10, height: 50 }}>
                <Col>
                  <Text style={locationL()} onPress={(value) => openModal4()}>
                    {locationLabel}
                  </Text>
                </Col>
              </Row>
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
             
      
              <Row>
                {optionSelected == 1 ? (
                  <Grid>
                    <Row style={{ marginTop: 10, height: 46 }}>
                      <Text style={[MaStyles.titleInput]}>
                        Driver License Number
                      </Text>
                    </Row>
                    <Row style={{ marginTop: 15, height: 50 }}>
                      <Col>
                        <TextInput
                          placeholderTextColor={"#d4d3d9"}
                          placeholder={"Driver License Number"}
                          onBlur={() => {
                            setIsFocused("");
                          }}
                          style={styleFocus("dl")}
                          onFocus={() => setIsFocused("dl")}
                          onChangeText={(text) => setDriverLicense(text)}
                          value={driverLicense}
                        />
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                  <></>
                )}
                {optionSelected == 2 ? (
                  <Grid>
                    <Row style={{ marginTop: 10, height: 46 }}>
                      <Text style={[MaStyles.titleInput]}>Company Name</Text>
                    </Row>
                    <Row style={{ marginTop: 15, height: 50 }}>
                      <Col>
                        <TextInput
                          placeholderTextColor={"#d4d3d9"}
                          placeholder={"Company Name"}
                          onBlur={() => {
                            setIsFocused("");
                          }}
                          style={styleFocus("cm")}
                          onFocus={() => setIsFocused("cm")}
                          onChangeText={(text) => setCompanyName(text)}
                          value={companyName}
                        />
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                  <></>
                )}
                {optionSelected == 3 ? (
                  <Grid>
                    <Row style={{ marginTop: 10, height: 46 }}>
                      <Text style={[MaStyles.titleInput]}>First Name</Text>
                    </Row>
                    <Row style={{ marginTop: 15, height: 50 }}>
                      <Col>
                        <TextInput
                          placeholderTextColor={"#d4d3d9"}
                          placeholder={"First Name"}
                          onBlur={() => {
                            setIsFocused("");
                          }}
                          style={styleFocus("fn")}
                          onFocus={() => setIsFocused("fn")}
                          onChangeText={(text) => setFirstname(text)}
                          value={firstName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10, height: 46 }}>
                      <Text style={[MaStyles.titleInput]}>Last Name</Text>
                    </Row>
                    <Row style={{ marginTop: 15, height: 50 }}>
                      <Col>
                        <TextInput
                          placeholderTextColor={"#d4d3d9"}
                          placeholder={"Last Name"}
                          onBlur={() => {
                            setIsFocused("");
                          }}
                          style={styleFocus("ln")}
                          onFocus={() => setIsFocused("ln")}
                          onChangeText={(text) => setLastName(text)}
                          value={lastName}
                        />
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                  <></>
                )}
              </Row>

              <Row>
                
              </Row>
            </KeyboardAwareScrollView>
          </Row>

       
         

          <Row
            style={{
              marginTop: 15,
              height: 45,
              position: "absolute",
              bottom: 80,
              width: "100%",
              paddingHorizontal: 20,zIndex:10000
            }}
          >
            <Col>
              <TouchableOpacity
                 onPress={() => checkOwner()}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  paddingHorizontal: 0,
                }}
              >
                <ImageBackground
                  source={require("../../assets/images/gradiantbg.png")}
                  style={{ width: "100%", height: 50, alignItems: "center" }}
                  imageStyle={{ borderRadius: 200 }}
                >
                  <Text style={[MaStyles.buttonTextM]}>Check Ownership</Text>
                </ImageBackground>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      )}

      {page3&&(
       <View
       style={{
         width: "100%",
         alignContent: "center",
         marginStart: width / 2 - 35,
       }}
     >
       <Loader />
     </View>
      )}
    </View>
  ) : (
    <LandingScreen
      titleText={"Vehicle Ownership Check"}
      subTitleText={
        "Before you purchase a vehicle, verify that the seller legally owns the vehicle.\n Powered by NZTA."
      }
      onPressButton={() => {
        handlePressLandingButton();
      }}
      buttonText={"Free Check"}
      uriImage={require("../../assets/images/splash/owner2.png")}
    />
  );
}
