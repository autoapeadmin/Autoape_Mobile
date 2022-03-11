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

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function WantedListScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);

  const [isModalVisible, setModalVisible] = useState(false);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [fromRealSale, setFromRealSale] = useState("0");

  const [customerID, setCustomerId] = useState("");
  const [logged, setLogged] = useState("false");

  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);
  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [locationLabel, setLocationLabel] = useState("All New Zealand");

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
    <View
      style={[
        MaStyles.container,
        { marginHorizontal: 0, paddingHorizontal: 0 },
      ]}
    >
      <Grid>
      <Row style={{ paddingHorizontal: 10, height: 40,marginTop:0 }}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 5 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={10}>
              <Text style={MaStyles.textHeader}>Wanted List</Text>
            </Col>
          </Grid>
        </Row>
       
        <Row style={{ paddingHorizontal: 5, marginTop: -10 }}>
          <TouchableOpacity
            onPress={(value) => openModal()}
            style={MaStyles.buttonViewM}
          >
            <Text style={MaStyles.buttonTextNearM}>{locationLabel}</Text>
          </TouchableOpacity>
        </Row>
        {listCar.length != 0 ? 
         <Row style={{ marginTop: 10 }} size={16}>
         {!loading && (
           <FlatList
             onEndReached={loadMore}
             ListFooterComponent={<View style={{ height: 150 }} />}
             style={{ marginStart: 0, marginTop: 16,width:"100%" }}
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
                  
                         <Text style={MaStyles.smallTitleListingM}>
                           {findDaysDiffrent(item.post_at)}
                         </Text>
                      
                
                     <Text style={MaStyles.titleListingM}>
                 {item.make_description}{" "}
                       {item.model_desc}
                     </Text>
                     <Text style={MaStyles.titleListingM}>
                  {item.wanted_year}
                     </Text>

                   
                   
                     <Grid>
                       <Col style={{marginTop:5}} size={5}>
                         <Text style={MaStyles.subTitleListingM}>
                         Between
                         </Text>
                         <Text style={MaStyles.subTitleListingM}>
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

      <Row
        style={{
          height: 60,
          paddingHorizontal: 15,
          width: "100%",
          bottom: 0,
          alignSelf: "center",
          backgroundColor: "transparent",
          marginBottom: "15%",position:"absolute"
        }}
      >

<TouchableOpacity
       onPress={() => createList()}
  style={{ flex: 1, paddingHorizontal: 20 }}
>

<ImageBackground
             source={require('../../assets/images/gradiantbg.png')}  
            
           style={{width:"100%",height:50, alignItems: "center",}} imageStyle={{borderRadius:200}}
              >
                <Text style={[MaStyles.buttonTextM]}>Create wanted listing</Text>
              </ImageBackground>

</TouchableOpacity>

  
      </Row>

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
