import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Animated,
  AsyncStorage,
  Dimensions,
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
import { ModalSelectList } from "react-native-modal-select-list";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import { Card } from "react-native-shadow-cards";
import { RootStackParamList } from "../../types";
import { useEffect, useState } from "react";
import Globals from "../../constants/Globals";
import VehicleListGrid from "../../components/VehicleComponents/VehicleListGrid";
import maxAuto from "../../api/maxAuto";
import { findDaysDiffrent } from "../../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../components/CustomMarker";
import { SliderBox } from "react-native-image-slider-box";
import { SharedElement } from "react-navigation-shared-element";
import Carousel, {Pagination} from "react-native-snap-carousel";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function MyVehicleListScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);
  const [isFocused, setIsFocused] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [fromRealSale, setFromRealSale] = useState("0");

  const [customerID, setCustomerId] = useState("");
  const [logged, setLogged] = useState("false");

  const [refresh, setRefresh] = useState(true);

  const [page1, setPage1] = useState(true);

  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nameSeller, setNameSeller] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [locationLabel, setLocationLabel] = useState("All New Zealand");

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

  const renderItem = ({item, index}) => {
  
    //item.price = "80";

    // console.log(item);

    if (item.title=="Car"){
      return (
        <View
          style={{
            width:"100%",marginTop:20,paddingHorizontal:30,backgroundColor:"white"
          }}
        >
        <Text
            style={[MaStyles.textHeaderSplash, {marginTop: 20, lineHeight: 40}]}
          >
            My Vehicles
          </Text>

          <Text
            style={[
              MaStyles.subTextMakeSplash,
              {
                marginTop: 15,
                textAlign: "left",
                paddingBottom: 25,
                lineHeight: 25,
              },
            ]}
          >
           Set up Alerts to help you keep track and stay on top of your WOF and Vehicle licensing expiry dates
          </Text>

       
            <Image
              style={{
                width: "100%",
                height: 250,
                alignSelf: "center",
                overflow: "visible",
                zIndex: 1000,
                marginStart: 50,
                paddingBottom: 30,marginTop:60
              }}
              source={require("../../assets/images/splash/report.png")}
              resizeMode="cover"
            />
          


        </View>
      );
  }else{
    return (
      <View
        style={{
        width:"100%",marginTop:20,paddingHorizontal:30,backgroundColor:"white"
        }}
      >
    <Text
            style={[MaStyles.textHeaderSplash, {marginTop: 20, lineHeight: 40}]}
          >
            My Vehicles
          </Text>

          <Text
            style={[
              MaStyles.subTextMakeSplash,
              {
                marginTop: 15,
                textAlign: "left",
                paddingBottom: 25,
                lineHeight: 25,
              },
            ]}
          >
           Set up Alerts to help you keep track and stay on top of your WOF and Vehicle licensing expiry dates
          </Text>

          <Image
              style={{
                width: "100%",
                height: 250,
                alignSelf: "center",
                overflow: "visible",
                zIndex: 1000,
                marginStart: 50,
                paddingBottom: 30,marginTop:60
              }}
              source={require("../../assets/images/splash/report.png")}
              resizeMode="cover"
            />
          

      </View>
    );
  }
    //Pigments
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

  const setupPage = async () => {
    setPage(1);

    let region_default = await AsyncStorage.getItem("region_default");
    let region_id = await AsyncStorage.getItem("region_default_id");

    setLocationLabel(
      region_default != null ? region_default : "All New Zealand"
    );


    setRegionId(
      region_id != null ? region_id : "0"
    )


    maxAuto.getWantedList(page, region_id).then((result) => {
      console.log(result);
      setListCar(result);
      setLoading(false);
    });

    fetch(Globals.BASE_URL + "Maxauto/allPlacesList")
      .then((response) => response.json())
      .then((data) => {
        setRegionList(data.data.region_list);
      });
  };

  const createList = () => {
    if (logged) {
      navigation.navigate("WantedCreate");
    } else {
      navigation.navigate("Login");
    }
  };

  const styleFocus = (input) => {
    if (isFocused == input) {
      return MaStyles.textInputRowSelected;
    } else {
      return MaStyles.textInputRow;
    }
  };

  const loadMore = () => {
    let ind = page + 1;
    console.log("**************************************** Page :" + ind);
    setPage(ind);
    maxAuto.getWantedList(ind, regionId).then((result) => {
      let array = result;
      array.forEach((element) => {
        // console.log(element.vehicule_price);
        listCar.push(element);
      });
      setLoading(false);
      setRefresh(!refresh);
    });
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  function numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const openModalContact = (phone, email) => {
    setPhone(phone);
    setEmail(email);
    setModalVisible(true);
  };

  const renderImages = (url) => {
    if (!loading) {
      return (
        <View style={{ marginTop: 10 }}>
          <CachedImage
            style={{
              width: "100%",
              height: 135,
              zIndex: 20000,
              borderBottomEndRadius: 5,
              borderBottomStartRadius: 5,
            }}
            source={{
              uri: Globals.S3_THUMB_URL_300 + url,
            }}
            resizeMode="cover"
          />
        </View>
      );
    }
  };

  function getSMSDivider(): string {
    return Platform.OS === "ios" ? "&" : "?";
  }

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

  return (
 
    page1 ? 
  
     
    <View style={{width:"100%",height:"100%"}}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={{flex: 1}}
      >

<Carousel
           layout={'stack'}
            data={exampleItems}
            renderItem={renderItem}
            containerCustomStyle={{marginTop: 30}}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index: number) => setActiveIndex(index)}
           // scrollInterpolator={scrollInterpolators.scrollInterpolator2}
            //slideInterpolatedStyle={animatedStyles.animatedStyles2}
            useScrollView={true}
          />
<View style={{marginTop:20}}>
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


        <Modal
        onBackdropPress={()=>setModalVisible(false)}
        
        hasBackdrop={true}
        isVisible={isModalVisible}
        backdropColor={"black"}
      >
        <TouchableOpacity  onPress={()=>setModalVisible(false)} style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={MaStyles.h1TitlePopup}>2008 Nissan Note {"\n"}</Text> 
            <Text style={styles.modalText}>We can confirm that KPS921 Nissan Note 2008 is not reported stolen as at </Text>
        
            <TouchableOpacity
      onPress={() => {setModalVisible(false);navigation.navigate("MyVehicles")}}
      style={[MaStyles.viewDealer, {marginTop: 20,width:"100%"}]}
    >
      <Text style={[MaStyles.buttonTextC]}>Confirm</Text>
    </TouchableOpacity>

         </View>

        </TouchableOpacity>
      </Modal>

      </KeyboardAvoidingView>
    </ScrollView>
    
<View style={{position:"absolute",width: "100%", paddingHorizontal: 30,bottom:0}}>
  
  <View style={{marginTop: 10, paddingBottom: 50}}>
    <TextInput
      placeholderTextColor={"#808080bf"}
      placeholder={"Plate number or VIN"}
      onBlur={() => {
        setIsFocused("");
        isKey(false);
      }}
      style={styleFocus("ns")}
      onFocus={() => {
        setIsFocused("ns");
        isKey(true);
      }}
      onChangeText={(text) => setNameSeller(text)}
      value={nameSeller}
    />

    <TouchableOpacity
      onPress={() => checkRego()}
      style={[MaStyles.viewDealer, {marginTop: 20}]}
    >
      <Text style={[MaStyles.buttonTextC]}>Get Started</Text>
    </TouchableOpacity>
  </View>
</View>

    </View>
 
   :
      <View
      style={[
        MaStyles.container,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      <Grid>
      <Row style={{ paddingHorizontal: 10, height: 40,marginTop:0,width:"100%"}}>
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
              <Text style={MaStyles.textHeader}>My Vehicles</Text>
            </Col>
            <Col style={{paddingEnd:7}} onPress={() => navigation.navigate("MyVehicleAdd")}>
            <AntDesign style={{marginTop:5}} name="pluscircleo" size={22} color="#0e4e92" />
            </Col>
          </Grid>
        </Row>
        <Row style={{ paddingHorizontal: 15 }}>
          <Col>
            <Text
              style={[
                MaStyles.subTextMake,
                { marginTop: 0, textAlign: "left" },
              ]}
            >
              Neque porro quisquam est qui dolorem ipsum quia dolor
            </Text>
          </Col>
        </Row>
   
        {true ? 
         <Row style={{ marginTop: 10 }} size={16}>
                <View
                 style={{
                   width: width,height:300,
                   margin: 8,
                   marginStart: 0,
                   borderRadius: 5,
                   marginBottom: 0,
                   backgroundColor: "white",
                 }}
               >
                          <SharedElement id="vehicleImage">

                       <Image
                         source={require("../../assets/images/placecar.png")}
                         resizeMode="cover"
                         style={{
                           width: "100%",
                           height: 200,
                           marginTop: 0,
                           borderTopLeftRadius: 0,
                           borderTopRightRadius: 0,
                         }}
                       /></SharedElement>

                    <Grid style={{padding:20}}>
                       <Col style={{marginTop:5}} size={5}>
                         <Text style={MaStyles.subTextCardVehicle}>
                         2018 Nissan Note
                         </Text>
                       </Col>
                       <Col>
                       <Feather name="bell" size={20} style={{marginTop:5,alignSelf:"flex-end"}} color="#0e4e92" />
                       </Col>
                     </Grid>

              </View>



         {!loading && (
           <FlatList
             onEndReached={loadMore}
             ListFooterComponent={<View style={{ margin: 0 }} />}
             style={{ paddingBottom: 30, marginStart: 0, marginTop: 16,width:"100%" }}
             showsVerticalScrollIndicator={false}
             extraData={refresh}
             data={listCar}
             numColumns={2}
             //onEndReached={loadMore}
             //extraData={refresh}
             keyExtractor={(item) => item.pic_url}
             renderItem={({ item, index }) => (
               <View
                 style={{
                   width: width / 2 - 4,
                   margin: 8,
                   marginStart: 0,
                   borderRadius: 5,
                   marginBottom: 0,
                   backgroundColor: "white",
                 }}
               >
                 <TouchableOpacity
                   onPress={() =>
                     openModalContact(item.contact_phone, item.contact_email)
                   }
                 >
                   {item.is_added == 0 && (
                     <TouchableOpacity
                       onPress={() => addVeh(item, index)}
                       style={{
                         position: "absolute",
                         zIndex: 2,
                         right: 0,
                         backgroundColor: "#0000008a",
                         borderRadius: 40,
                         height: 30,
                         width: 30,
                         margin: 5,
                       }}
                     >
                       <AntDesign
                         name="staro"
                         size={20}
                         color="white"
                         style={{ textAlign: "center", marginTop: 5 }}
                       />
                     </TouchableOpacity>
                   )}

                   {item.is_added == 1 && (
                     <TouchableOpacity
                       onPress={() => reVeh(item, index)}
                       style={{
                         position: "absolute",
                         zIndex: 2,
                         right: 0,
                         backgroundColor: "#0000008a",
                         borderRadius: 40,
                         height: 30,
                         width: 30,
                         margin: 5,
                       }}
                     >
                       <AntDesign
                         name="star"
                         size={18}
                         color="#ffbf00"
                         style={{ textAlign: "center", marginTop: 5 }}
                       />
                     </TouchableOpacity>
                   )}
                   <SharedElement id="vehicleImage">
                     {item.pic_url ? (
                       <CachedImage
                         source={{ uri: Globals.S3_THUMB_GRID + item.pic_url }}
                         resizeMode="cover"
                         style={{
                           width: "100%",
                           height: 140,
                           marginTop: 0,
                           borderTopLeftRadius: 0,
                           borderTopRightRadius: 0,
                         }}
                       />
                     ) : (
                       <Image
                         source={require("../../assets/images/placecar.png")}
                         resizeMode="cover"
                         style={{
                           width: "100%",
                           height: 140,
                           marginTop: 0,
                           borderTopLeftRadius: 0,
                           borderTopRightRadius: 0,
                         }}
                       />
                     )}
                   </SharedElement>
                   <View style={{ margin: 8, marginBottom: 15,marginTop:0 }}>
                  
                         <Text style={MaStyles.TextCardVehicleDate}>
                           {findDaysDiffrent(item.post_at)}
                         </Text>
                      
                
                     <Text style={MaStyles.TextCardListView}>
                 {item.make_description}{" "}
                       {item.model_desc}
                     </Text>
                     <Text style={MaStyles.TextCardListView}>
                  {item.wanted_year}
                     </Text>

                   
                   
                     <Grid>
                       <Col style={{marginTop:5}} size={5}>
                         <Text style={MaStyles.subTextCardVehicle}>
                         Between
                         </Text>
                         <Text style={MaStyles.subTextCardVehicle}>
                          {item.wanted_price}
                         </Text>
                       </Col>
                     </Grid>

                   </View>

                   <Grid style={{ marginTop: -5, marginBottom: 0 }}>
                     <Col
                       onPress={() =>
                         openModalContact(
                           item.contact_phone,
                           item.contact_email
                         )
                       }
                     >
                      
                     </Col>
                   </Grid>
                 </TouchableOpacity>
               </View>
             )}
           />
         )}
       </Row>
        :
        <Row style={{ marginTop: 10 }} size={16}>
        {!loading && (
          <TouchableOpacity onPress={(value) => openModal()} style={{paddingHorizontal:15,width:"100%"}}>
      <LottieView
        autoPlay={true}
        loop={true}
        style={{
          marginTop: 0,marginStart:5,
          alignSelf: "center",
          width: width - 100,
          height: width - 100,
        }}
        source={require("../../assets/lottie/car.json")}
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
      />
      <Text style={MaStyles.lottieTitle}>Wanted List Empty!</Text>
      <Text
      
        style={MaStyles.lottieSub}
      >
        Click here to select a different region >
      </Text>
    </TouchableOpacity>
        )}
      </Row>        
        }
        
      </Grid>
      <Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: 250,
            marginTop: height - 250,
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
          <Row style={{ marginTop: 35, height: 40 }}>
            <Col style={{ marginHorizontal: 1 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ width: "100%", bottom: 5, alignSelf: "center" }}
              >
                <View
                  style={[
                    MaStyles.buttonViewWhite,
                    { marginTop: 5, height: 50 },
                  ]}
                >
                  <Text style={MaStyles.buttonTextWhite}>Done</Text>
                </View>
              </TouchableOpacity>
            </Col>
          </Row>

          <Row style={{ marginTop: 100, position: "absolute" }}>
            <Col
              onPress={() => {
                Linking.openURL(`tel:${phone}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 20 }}
                  name="phone"
                  size={35}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Call Contact</Text>
            </Col>
            <Col
              onPress={() => {
                Linking.openURL(`sms:${phone}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 21 }}
                  name="message1"
                  size={33}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Send a Message</Text>
            </Col>
            <Col
              onPress={() => {
                Linking.openURL(`mailto:${email}`);
              }}
              style={{ marginBottom: 15 }}
            >
              <View style={MaStyles.iconBack}>
                <AntDesign
                  style={{ padding: 20 }}
                  name="mail"
                  size={35}
                  color="#0e4e92"
                />
              </View>
              <Text style={MaStyles.subTextMake}>Send a Email</Text>
            </Col>
          </Row>
        </Grid>
      </Modal>
      
      <Modal
        onBackdropPress={() => setCreateModal(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={createModal}
        style={[
          MaStyles.container,
          {
            maxHeight: 650,
            marginTop: height - 550,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >

          <Grid style={{ marginTop: 5,width:"100%"}}>

          <Row style={{ height: 40, marginTop: 20}}>
            <Grid>
              <Col
                style={{ marginStart: 4,alignItems:"center" }}
               // onPress={() => setModalWantedVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>Add Vehicle</Text>
              </Col>
              <Col 
              //onPress={() => setModalWantedVisible(false)}
              >
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </Row>
       
     
              <Image
              source={require('../../assets/images/placecar.png') }
              resizeMode="cover"
              style={{
                width: "100%",
                height: 140,
                marginTop: 10,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              />

               <View style={{height:0.5,backgroundColor:"#00000020",marginTop:10}}></View>
            
            
            <Row>
              <Text style={MaStyles.TextCardListView}></Text>
            </Row>
            <Row>
              <Text style={MaStyles.menuTitleBox}></Text>
            </Row>
          </Grid>

        </Modal>




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
    </View>
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
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,width:"100%"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: "center"
  },
  modalText: {
    marginStart:-15
  }
});
