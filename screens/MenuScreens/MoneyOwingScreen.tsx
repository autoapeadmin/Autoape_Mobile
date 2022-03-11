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
  import { Col, Grid, Row } from "react-native-easy-grid";
  import MaStyles from "../../assets/styles/MaStyles";
  import Modal from "react-native-modal";
  import { RootStackParamList } from "../../types";
  import { useEffect, useState } from "react";
  import Globals from "../../constants/Globals";
  import maxAuto from "../../api/maxAuto";
  import { RFValue } from "react-native-responsive-fontsize";
  import LandingScreen from "../../components/LandingScreen";
import VehicleBoxDetails from "../../components/VehicleBoxDetails";
import DoneScreen from "../../components/DoneScreen";
import Loader from "../../components/Loader";

  
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  
  export default function MoneyOwingScreen({
    navigation,
    route,
  }: StackScreenProps<RootStackParamList, "NotFound">) {
    const [listCar, setListCar] = useState([]);
    const [page, setPage] = useState(1);
    const [linkPdf, setLinkPdf] = useState("");
    const [rego, setRego] = useState("");

    const [downloadPdfView, setDownloadPdfView] = useState(false);
  
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
    const [regoChecked, setRegoChecked] = useState(false);
    const [page0, setPage0] = useState(false);
  
    
    const [findMake, setFindMake] = useState("");
    const [findModel, setFindModel] = useState("");
    const [findYear, setFindYear] = useState("");
    const [findVehicle, setFindVehicle] = useState(true);
    const [findStolen, setFindStolen] = useState(true);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [pdfURL, setPDFURl] = useState("");
    const [customerID, setCustomerId] = useState("");
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loaderText, setLoaderText] = useState("");
  
    useEffect(() => {
      setupPage();
    }, []);
  
    const styleFocusSearchBox = (input) => {
      if (isFocused == input) {
        return MaStyles.textInputSelectedM;
      } else {
        return MaStyles.textInputM;
      }
    };
  
    const checkRego = () => {
      setModalVisible(true);
    };
  
    const setupPage = async () => {
      let region_default = await AsyncStorage.getItem("region_default");
      let region_id = await AsyncStorage.getItem("region_default_id");

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
  
  
      setCustomerId(idCustomer);
      console.log("aca"  + idCustomer);
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
  
    const makeSelected = (idMake: string, makeName: string) => {
      setMakeLabel(makeName);
      setMakeId(idMake);
  
      fetch(Globals.BASE_URL + "Maxauto/getModels/" + idMake)
        .then((response) => response.json())
        .then((data) => {
          setListModel(data.data);
        });
    };
  
    const handlePressLandingButton = () =>{
      setPage0(true);
      setSplashScreen(true);
    }


    const generateReport = () =>{
      //setPaymentPage(false);
      setRegoChecked(false);
      setLoaderText("Generating Report");
      setLoading2(true);
      setDownloadPdfView(false);
      setLoadingPdf(true);
      maxAuto.getReportPDFPPSR(rego,customerID).then((result)=>{
        setLoading2(false);
          console.log(result)
          setPDFURl(result.document_url_final);
          setLoadingPdf(false);
          setPage0(false);
          setDownloadPdfView(true);
          setLoaderText("")
      }
      ) 
    }
   
  
    
    const findPlateDetails = () => {
     setLoading(true)
      maxAuto.getMotoChekDetails(rego,"police").then((result)=>{
          console.log(result);
         setLoading(false);
          if(result.data.find===false){
          //  setFindMake("Nissan");
          //  setFindModel("Note");
           setFindYear("Vehicle Not Found");
           setFindVehicle(false);
           setRegoChecked(true);
           
          }else{
            setFindMake(result.data.make);
            setFindModel(result.data.model);
            setFindYear(result.data.year);
            setRegoChecked(true);
            setFindVehicle(true);  
            let stolen = (result.data.isStolen =="true");   
            setFindStolen(stolen);
          }
      }
      )
  
      //getMotoChekDetails
    }

    const handlePressPDFButton = (pdfUrl:string) =>{
      Linking.openURL(pdfUrl);
    }
  
    return splashScreen ? (
      <View
      style={[
        MaStyles.containerWhite,
        {marginHorizontal: 0, paddingHorizontal: 0},
      ]}
    >


      {/* downloadPdfView */}
      {downloadPdfView &&
      <View style={{width:"100%",height:"100%",position:"absolute"}}>

<LandingScreen 
      titleText={"Your report is ready!"}
      subTitleText={"Click on the button below to view"}
      onPressButton={()=>{handlePressPDFButton(pdfURL)}}
      buttonText={"View Report"}
      uriImage={require('../../assets/images/splash/ready.png')}
      />    

      </View>
}


      { page0 &&
        <View style={{width:"100%"}}>
         <Row style={{paddingHorizontal: 20, height: 40, marginTop: 0}}>
                <Grid>
                  <Col onPress={() => navigation.goBack()}>
                    <AntDesign
                      style={{marginTop: 10}}
                      name="left"
                      size={24}
                      color="#0e4e92"
                    />
                  </Col>
                  <Col style={{marginTop:0}} onPress={() => navigation.goBack()} size={10}>
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
                        onSubmitEditing={()=>{findPlateDetails()}}
                      />
                  </Col>
                </Grid>
          </Row>

          {loading ?
    <View style={{width:"100%",alignContent:"center",marginStart:width/2-35}}>
  <Loader />
  </View>
  :
<View></View>
  }

{loading2 ?
    <View style={{width:"100%",alignContent:"center",marginStart:width/2-35}}>
  <Loader title="Generating Report" />
  </View>
  :
<View></View>
  }


          {regoChecked ? (

<VehicleBoxDetails
rego={rego} 
year={findYear} 
make={findMake} 
model={findModel} 
isStolen={false} 
vin={""} 
onPressButton={()=>{
  generateReport()
}}
isFind={findVehicle}          
isPoliceField={false}   
/>

  ):(
    <View>
  
    </View>
  )}
              </View>
      }</View> ) : (
  
      <LandingScreen 
      titleText={"Money Owing Check"}
      subTitleText={"Are you buying a vehicle? Check if it still has money owing. Avoid it from being repossessed to repaid any outstanding debt. Powered by MBIE"}
      onPressButton={()=>{handlePressLandingButton()}}
      buttonText={"Check $2.95"}
      uriImage={require('../../assets/images/splash/money.png')}
      />    
   
   );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
  