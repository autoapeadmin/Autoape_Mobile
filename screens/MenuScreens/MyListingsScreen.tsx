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
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { Alert } from "react-native";
import NotFoundScreen from "../../components/NotFoundScreen";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function MyListingsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalWantedVisible, setModalWantedVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const [listListings, setListListing] = useState([]);
  const [wantedList, setWantedList] = useState([]);

  const [targetListing, setTargetListing] = useState([]);

  const [carFlag, setCarFlag] = useState(true);
  const [dealerFlag, setDealerFlag] = useState(false);
  const [salesFlag, setSalesFlag] = useState(false);

  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [odo, setOdo] = useState("");
  const [engine, setEngine] = useState("");
  const [desc, setDesc] = useState("");

  const [id, setId] = useState("");
  const [idWanted, setIdWanted] = useState("");

  useEffect(() => {
    setupPage();
  }, []);

  const setupPage = async () => {
    maxAuto.getMyListings().then((result) => {
      console.log(result);
      setListListing(result.objListing);
      setWantedList(result.objWantedListing);
      setLoading(false);
    });
  };

  const changeTab = (id: number) => {
    if (id == 1) {
      setCarFlag(true);
      setDealerFlag(false);
    }
    if (id == 2) {
      setCarFlag(false);
      setDealerFlag(true);
    }
  };

  //select car
  const vehicleB = () => {
    if (carFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  //select car
  const dealerB = () => {
    if (dealerFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  const vehicleLayer = () => {
    if (carFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  //select car
  const dealerLayer = () => {
    if (dealerFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const openListingModal = (targetId) => {
    console.log(targetId);
    let objList = listListings[targetId];
    console.log(objList);
    
    //
    setPrice(objList.vehicule_price);
    setYear(objList.vehicule_year);
    setOdo(objList.vehicule_odometer);
    setEngine(objList.vehicule_engine);
    setDesc(objList.vehicule_desc)
    setId(objList.vehicule_id)
    
    setModalVisible(true);
    setTargetListing(objList);



  };

  const openWantedModal = (targetId) => {
    let objList = wantedList[targetId];
    setIdWanted(objList.wanted_id);
    console.log(objList);
    setModalWantedVisible(true);
    setTargetListing(objList);
  
  };

  const updateWantedStatus = () =>{

    console.log(idWanted);
    fetch(Globals.BASE_URL + "Maxauto/updateListingStatus/" + idWanted + "/1")
      .then(response => response.json())
      .then(data => {
        Alert.alert(
          'Removed',
          'Wanted Listing has been removed',
          [{text: 'OK', onPress: () => {setupPage();setModalVisible(false)}}],
          {cancelable: false},
        );
      }); 
  }

  const updateStatus = () =>{
    fetch(Globals.BASE_URL + "Maxauto/updateListingStatus/" + id + "/1")
      .then(response => response.json())
      .then(data => {
        Alert.alert(
          'Removed',
          'Listing has been removed',
          [{text: 'OK', onPress: () => {setupPage();setModalVisible(false)}}],
          {cancelable: false},
        );
      }); 
  }

  const editListing = () =>{
    fetch(Globals.BASE_URL + "Maxauto/editListing", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        
          priceF: price,
          yearF: year,
          odoF: odo,
          engiF: engine,
          descF: desc,
          idVeh: id
      })
  })
      .then(response => response.json())
      .then(data => {
        Alert.alert(
          'Updated',
          'Listing has been updated',
          [{text: 'OK', onPress: () => {setupPage();setModalVisible(false)}}],
          {cancelable: false},
        );
      }); 
  }


  return (
    <View
      style={[
        MaStyles.container2,
        { marginHorizontal: 0, paddingHorizontal: 0,backgroundColor:"white" },
      ]}
    >
      <Grid>
      <Row style={{ paddingHorizontal: 10, height: 40 }}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 3 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={10}>
              <Text style={MaStyles.textHeaderScreenM}>My Listings</Text>
            </Col>
          </Grid>
        </Row>
       
{/*         <Row style={{ marginTop: -12, paddingHorizontal: 10 }} size={2}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
          >
            <TouchableOpacity onPress={() => changeTab(1)} style={vehicleB()}>
              <Text style={vehicleLayer()}>Sale listings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeTab(2)} style={dealerB()}>
              <Text style={dealerLayer()}>Wanted listing</Text>
            </TouchableOpacity>

          </ScrollView>
        </Row> */}

        <Row style={{marginTop:-12,width:"100%"}} size={14}>

            <View style={{width:"100%"}}>
              {carFlag ? 
                            (listListings.length > 0 ? (
                              <FlatList
                                style={{ paddingBottom: 30 }}
                                showsVerticalScrollIndicator={false}
                                data={listListings}
                                
                                numColumns={2}
                                //onEndReached={loadMore}
                                extraData={refresh}
                                keyExtractor={(item) => item.vehicule_id}
                                renderItem={({ item, index }) => (
                                  <View
                                    style={{
                                      width: width / 2 - 4 ,
                                      margin: 8,
                                      marginStart:0,
                                      borderRadius: 5,marginBottom:0,
                                      backgroundColor: "white",
                                    }}
                                  >
                                    <TouchableOpacity
                                      onPress={() => openListingModal(index)}
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
              
              {item.pic_url ?
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
              :
              <Image
              source={require('../../assets/images/placecar.png') }
              resizeMode="cover"
              style={{
                width: "100%",
                height: 140,
                marginTop: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              />
              }
                                      <View style={{ margin: 8, marginBottom: 15 }}>
                                        <Grid>
                                          <Col>
                                            <Text style={MaStyles.subTextCardVehicle}>
                                              ${format(item.vehicule_price)}
                                            </Text>
                                          </Col>
                                          <Col>
                                            <Text style={MaStyles.TextCardVehicleDate}>
                                            <Text style={MaStyles.TextCardVehicleDate}>{findDaysDiffrent(item.indate)}</Text>
                                            </Text>
                                          </Col>
                                        </Grid>
              
                                        <Text style={MaStyles.TextCardVehicle}>
                                          {item.vehicule_year} {item.make_description}{" "}
                                          {item.model_desc}
                                        </Text>

{item.delete_flag == 0 
?
<Text style={[MaStyles.TextCardVehicle,{color:"green"}]}>
Active
</Text>
:
<Text style={[MaStyles.TextCardVehicle,{color:"red"}]}>
Non active
</Text>}
                                     
                                      </View>
                                      {item.rec_img_base64 ? (
                                        <View
                                          style={{
                                            flex: 1,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: 0,
                                            borderBottomEndRadius: 5,
                                            borderBottomStartRadius: 5,
                                          }}
                                        >
                                          {renderImage(item.rec_img_base64)}
                                         
                                        </View>
                                      ):
                                      <View
                                          style={{
                                            flex: 1,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: 0,
                                            borderBottomEndRadius: 5,
                                            borderBottomStartRadius: 5,
                                          }}
                                        >
                                          <Image
                      style={{
                        width: width / 2 - 30,
                        height: 0,
                        zIndex: 20000,
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5,
                      }}
                      source={require('../../assets/images/placebanner.png') }
                      resizeMode="stretch"
                    />
                                        </View>
                                      }
                                    </TouchableOpacity>
                                  </View>
                                )}
                              />
                            ) : (
                              <NotFoundScreen 
                titleText={"No Listing Here"}
                subTitleText={"Looks like you haven’t created any vehicle listings yet."}
                uriImage={require('../../assets/images/splash/emptylisting.png')}
                />  
                            )) 
              :
              (wantedList.length > 0 ? (
                <FlatList
               // onEndReached={loadMore}
                ListFooterComponent={<View style={{ margin: 0 }} />}
                style={{ paddingBottom: 30, marginStart: 0, marginTop: 0 }}
                showsVerticalScrollIndicator={false}
                extraData={refresh}
                data={wantedList}
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
                                      onPress={() => openWantedModal(index)}
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
                      <View style={{ margin: 8, marginBottom: 15 }}>
                        <Grid>
                          <Col size={5}>
                            <Text style={MaStyles.subTextCardVehicle}>
                              {item.wanted_price}
                            </Text>
                          </Col>
                        </Grid>
   
                        <Text style={MaStyles.TextCardVehicle}>
                          {item.vehicule_year} {item.make_description}{" "}
                          {item.model_desc}
                        </Text>
                        <Row>
                          <Col>
                            <Text style={MaStyles.TextCardVehicle}>
                              {""} {item.wanted_year}
                            </Text>
                          </Col>
                          <Col>
                            <Text style={MaStyles.TextCardVehicleDate}>
                              {findDaysDiffrent(item.wanted_indate)}
                            </Text>
                          </Col>
                        </Row>
                        {item.wanted_deleted == 0 
?
<Text style={[MaStyles.TextCardVehicle,{color:"green"}]}>
Active
</Text>
:
<Text style={[MaStyles.TextCardVehicle,{color:"red"}]}>
Non active
</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
              ) : (
                <NotFoundScreen 
                titleText={"Empty Watchlist"}
                subTitleText={"You don’t have any Saved vehicles in your watchlist"}
                uriImage={require('../../assets/images/splash/empty.png')}
                />  
              ))   
              }
              
            </View>

        </Row>
      </Grid>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        deviceHeight={height}
       
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: height,
            marginTop:50,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        ]}
      >

<Grid style={{ marginTop: -35,width:"100%"}}>

<Row style={{ height: 40, marginTop: 0}}>
  <Grid>
    <Col
      style={{ marginStart: 4,alignItems:"center" }}
      onPress={() => setModalVisible(false)}
      size={10}
    >
      <Text style={MaStyles.textHeaderScreenM}>View listing</Text>
    </Col>
    <Col onPress={() => setModalVisible(false)}>
      <AntDesign
        style={{ marginTop: 5 }}
        name="close"
        size={22}
        color="#0e4e92"
      />
    </Col>
  </Grid>
</Row>

       <ScrollView showsVerticalScrollIndicator={false}>
          {targetListing.pic_url ?
               <CachedImage
               source={{ uri: Globals.S3_THUMB_GRID_500 + targetListing.pic_url }}
               resizeMode="cover"
               style={{
                 width: "100%",
                 height: 200,
                 marginTop: 10,
               }}
              />
              :
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
              }
              
              
              <Text
                 style={[
                  MaStyles.textHeader,
                  { marginTop: 12, fontSize: 25, color: "#0000009c",textAlign:"center" },
                ]}
                >
                                          {targetListing.make_description}{" "}
                                          {targetListing.model_desc}
                                        </Text>
                                      
               <View style={{height:0.5,backgroundColor:"#00000020",marginTop:10}}></View>

               <Row style={{height:70,marginTop:5}}>
                 <Col>
                 <Text style={[MaStyles.titleInput3]}>Price</Text>
                 <TextInput  onChangeText={text => { setPrice(text); }} value={price} keyboardType={'number-pad'} placeholderTextColor={'gray'} style={MaStyles.textInputRow2}/>
                 </Col>
                 <Col>
                 <Text style={[MaStyles.titleInput3]}>Year</Text>
                 <TextInput onChangeText={text => { setYear(text); }} value={year} keyboardType={'number-pad'} placeholderTextColor={'gray'} style={MaStyles.textInputRow2}/>
                 </Col>
              </Row>

              <Row style={{height:70}}>
                 <Col>
                 <Text style={[MaStyles.titleInput3]}>Odometer</Text>
                 <TextInput onChangeText={text => { setOdo(text); }} value={odo}  keyboardType={'number-pad'} placeholderTextColor={'gray'} style={MaStyles.textInputRow2}/>
                 </Col>
                 <Col>
                 <Text style={[MaStyles.titleInput3]}>Engine size (cc)</Text>
                 <TextInput onChangeText={text => { setEngine(text); }} value={engine} keyboardType={'number-pad'} placeholderTextColor={'gray'} style={MaStyles.textInputRow2}/>
                 </Col>
              </Row>

              <Row style={{height:260}}>
                 <Col>
                 <Text style={[MaStyles.titleInput3]}>Description</Text>
                 <TextInput multiline={true} onChangeText={text => { setDesc(text); }} value={desc} keyboardType={'number-pad'} placeholderTextColor={'gray'} style={MaStyles.textInputdescUpdate}/>
                 </Col>
              </Row>

              <Row style={{height:100}}>
              <Col>
                 </Col>
              </Row>
      </ScrollView>
      
 {targetListing.delete_flag == 0 &&
      <Row style={{position:"absolute",bottom:0,marginBottom:60}}> 
<Col style={{paddingHorizontal:3}}><TouchableOpacity
onPress={()=>updateStatus()}
        style={MaStyles.viewDealerUpdateRed}
      >
        <Text style={MaStyles.buttonTextC}>Withdraw listing</Text>
      </TouchableOpacity></Col>

      <Col style={{paddingHorizontal:3}}><TouchableOpacity
      onPress={()=>editListing()}
        style={MaStyles.viewDealerUpdate}
      >
        <Text style={MaStyles.buttonTextC}>Update listing</Text>
      </TouchableOpacity></Col>
</Row>
    }
    
    </Grid>
        </Modal>

        <Modal
        onBackdropPress={() => setModalWantedVisible(false)}
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalWantedVisible}
        style={[
          MaStyles.container,
          {
            maxHeight: 550,
            marginTop: height - 450,
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
                onPress={() => setModalWantedVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>View listing</Text>
              </Col>
              <Col onPress={() => setModalWantedVisible(false)}>
                <AntDesign
                  style={{ marginTop: 5 }}
                  name="close"
                  size={22}
                  color="#0e4e92"
                />
              </Col>
            </Grid>
          </Row>
       
          {targetListing.pic_url ?
               <CachedImage
               source={{ uri: Globals.S3_THUMB_GRID_500 + targetListing.pic_url }}
               resizeMode="cover"
               style={{
                 width: "100%",
                 height: 200,
                 marginTop: 10,
               }}
              />
              :
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
              }
            
              <Text
                  style={[
                    MaStyles.textHeader,
                    { marginTop: 12, fontSize: 25, color: "#0000009c",textAlign:"center" },
                  ]}
                >
                                          {targetListing.make_description}{" "}
                                          {targetListing.model_desc}
               </Text>

                  
              <Text
                  style={[
                    MaStyles.textHeader,
                    { marginTop: 0, fontSize: 15, color: "#00000070",textAlign:"center" },
                  ]}
                >
                                          {targetListing.wanted_price} / {targetListing.wanted_year}{" "}
                                        
               </Text>

               <View style={{height:0.5,backgroundColor:"#00000020",marginTop:10}}></View>
            
            
            <Row>
              <Text style={MaStyles.TextCardListView}></Text>
            </Row>
            <Row>
              <Text style={MaStyles.menuTitleBox}></Text>
            </Row>
          </Grid>

          {targetListing.wanted_deleted == 0 &&
          <Row
        style={{
          height: 60,
          paddingHorizontal: 15,
          width: "100%",
          bottom: 0,
          alignSelf: "center",
          backgroundColor: "transparent",
          marginBottom: "15%",
        }}
      >
        <TouchableOpacity
          style={MaStyles.viewDealerUpdateRed}
          onPress = {()=> updateWantedStatus()}
        >
          <Text style={MaStyles.buttonTextC}>Withdraw listing</Text>
        </TouchableOpacity>
      </Row>
   }
        </Modal>


      <Modal
        onBackdropPress={() => setModalVisible(false)}
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

          <Grid style={{ marginTop: 100, position: "absolute" }}>
            <Row>
              <Text style={MaStyles.TextCardListView}></Text>
            </Row>
            <Row>
              <Text style={MaStyles.menuTitleBox}></Text>
            </Row>
          </Grid>
        </Grid>
      </Modal>
    </View>
  );
}
