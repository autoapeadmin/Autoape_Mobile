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
import Loader from "../../components/Loader";
import VehicleBoxDetails from "../../components/VehicleBoxDetails";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function PoliceScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);
  const [linkPdf, setLinkPdf] = useState("");
  const [rego, setRego] = useState("");

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

  const [loading, setLoading] = useState(false);

  const [splashScreen, setSplashScreen] = useState(false);
  const [regoChecked, setRegoChecked] = useState(false);
  const [page0, setPage0] = useState(false);

  
  const [findMake, setFindMake] = useState("");
  const [findModel, setFindModel] = useState("");
  const [findYear, setFindYear] = useState("");
  const [findVehicle, setFindVehicle] = useState(true);
  const [findStolen, setFindStolen] = useState(true);
  const [findRego, setRegoFind] = useState("");

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
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected2;
    } else {
      return MaStyles.textInputRow2;
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

  
  const findPlateDetails = () => {
   setLoading(true)
   setRegoFind(rego);
    maxAuto.getMotoChekDetails(rego,"police").then((result)=>{
        console.log(result);
        setLoading(false);
       // setLoading(false);
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

  return splashScreen ? (
    <View
    style={[
      MaStyles.containerWhite,
      {marginHorizontal: 0, paddingHorizontal: 0},
    ]}
  >
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
                      placeholder={"Plate number or VIN"}
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


        {regoChecked ? (
          <VehicleBoxDetails
          rego={findRego} 
          year={findYear} 
          make={findMake} 
          model={findModel} 
          isStolen={findStolen} 
          vin={""} 
          onPressButton={()=>{}}
          isFind={findVehicle}          
          isPoliceField={true}   
          />
/*      findVehicle? (

<Row  style={{paddingHorizontal: 10, height: 180, marginTop: 15,width:"100%"}}>
<Grid style={{marginTop:0,height:50,borderColor:"white",borderWidth:0.5,borderRadius:10,width:"100%",flex:1}}>

  <Row style={{height:30}}>
  <Col>
  <Image  style={{width:50,height:50,marginTop:8,borderRadius:10}} source={require("../../assets/images/icons/searchcar.jpg")}></Image>
  </Col>
  <Col size={4}>
  <Text style={[MaStyles.titleInputBox,{marginTop:5}]}>{findYear} {findMake} {findModel}</Text>
  <Text style={[MaStyles.titleInput,{marginTop:5,color:"gray"}]}>Plate: {rego}</Text>
  </Col>
  <Col style={{height:60}} size={1}>

  </Col>
  </Row>
  <Row style={{height:30}}>   
  <View style={{height:0.25,backgroundColor:"#d4d3d9",width:"100%",marginTop:40}}></View>  
  </Row>      
    <Row style={{height:50}}>   
    {findStolen?
    <Text style={[MaStyles.titleInput,{marginTop:30,color:"#e63131",textAlign:"center",width:"100%"}]}><AntDesign name="warning" size={15} color="#e63131" /> Vehicle is currently listed as STOLEN</Text>
    :
    <Text style={[MaStyles.titleInput,{marginTop:30,color:"#5fb313",textAlign:"center",width:"100%"}]}><AntDesign name="checkcircle" size={15} color="#5fb313" /> Vehicle is currently listed as NOT STOLEN </Text>
    }
    </Row>    
 </Grid>
 
</Row>

):(
 
<Row  onPress={() => {console.log("aca");setPage0(false);setPage2(true)}} style={{paddingHorizontal: 10, height: 180, marginTop: 15,width:"100%"}}>
<Grid style={{marginTop:0,height:50,borderColor:"white",borderWidth:0.5,borderRadius:10,width:"100%",flex:1}}>

  <Row>
 
  <Col size={4}>
  <Text style={[MaStyles.titleInputBox,{marginTop:5,height:24}]}>Vehicle not found</Text>
  <Text style={[MaStyles.titleInput,{marginTop:5,color:"gray"}]}>Rego is not on NZQA Database</Text>
  </Col>
  </Row>
  <Row>
  <View style={{height:0.25,backgroundColor:"#d4d3d9",width:"100%",marginTop:40}}></View>  
  </Row>    
       
           
            
 </Grid>
</Row>

) */
):(
  <View>

  </View>
)}
            </View>
    }</View> ) : (

    <LandingScreen 
    titleText={"Stolen Vehicle Check"}
    subTitleText={"Before you purchase a vehicle, check if it has been reported as stolen to the NZ Police. Powered by NZTA."}
    onPressButton={()=>{handlePressLandingButton()}}
    buttonText={"Free Check"}
    uriImage={require('../../assets/images/splash/stol.png')}
    />    
 
 );
  /*  <View style={{width:"100%",height:"100%"}}>
 <ScrollView
 showsVerticalScrollIndicator={false}
 style={{
   flex: 1,
   width: "100%",
   height: "100%",
   backgroundColor: "white",
 }}
>
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""} style={{flex:1}}>
 <Grid style={{width:"100%",marginTop:60}}>
   <View  style={{paddingHorizontal:30}}>
   <AntDesign
                onPress={() => navigation.goBack()}
                style={{marginStart: -15}}
                name="left"
                size={24}
                color="#0e4e92"
              />
                 
                 
     <Image
                style={{width:"100%",height:300,alignSelf:"center",  resizeMode: 'contain',overflow:"visible",zIndex:1000,marginTop:"5%"}}
                source={
                    require('../../assets/images/splash/police.png') 
                }
                resizeMode="cover"
            />            


      <Text style={[MaStyles.textHeaderSplash,{lineHeight:50}]}>Stolen Vehicle - Police Check</Text>
            <Text
                  style={[
                    MaStyles.subTextMakeSplash,
                    {marginTop: 15, paddingBottom:25,lineHeight:25},
                  ]}
                >
                  Before you purchase a vehicle, check if it has been reported as stolen to the NZTA.
                </Text>
   </View>



   <View style={{height:40}}></View>
 </Grid>
  
 <Modal
        onBackdropPress={()=>setModalVisible(false)}
        style={{borderRadius:0}}
      
        hasBackdrop={true}
        isVisible={isModalVisible}
        backdropColor={"black"}
      >
        <TouchableOpacity  onPress={()=>setModalVisible(false)} style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={MaStyles.h1TitlePopup}>2008 Nissan Note {"\n"}</Text> 
            <Text style={styles.modalText}>We can confirm that KPS921 Nissan Note 2008 is not reported stolen as at </Text>
            <TouchableOpacity
      onPress={() => checkRego()}
      style={[MaStyles.viewDealer, {marginTop: 20,width:"100%"}]}
    >
      <Text style={[MaStyles.buttonTextC]}>Close</Text>
    </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

 </KeyboardAvoidingView>

</ScrollView>

<View style={{position:"absolute",width: "100%", paddingHorizontal: 30,bottom:0}}>
  
<Grid>
  <Row>
    <Col size={3}><TextInput
      placeholderTextColor={"#d4d3d9"}
      placeholder={"Plate number or VIN"}
      onBlur={() => {
        setIsFocused("");
      
      }}
      style={styleFocus("ns")}
      onFocus={() => {
        setIsFocused("ns");
   
      }}
      onChangeText={(text) => setNameSeller(text)}
      value={nameSeller}
    />
</Col>
    <Col><TouchableOpacity
      onPress={() => checkRego()}
      style={[MaStyles.viewDealerNew, {marginTop: 0}]}
    >
      <Text style={[MaStyles.buttonTextC]}>Check</Text>
    </TouchableOpacity></Col>
  </Row>
</Grid>

  <View style={{marginTop: 10, paddingBottom: 50}}>
  
   
  </View>
</View>

</View>
  */
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
