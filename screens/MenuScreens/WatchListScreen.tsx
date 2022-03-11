import {
    AntDesign,
    Feather,
    FontAwesome,
    FontAwesome5,
  } from "@expo/vector-icons";
  import { useFocusEffect } from "@react-navigation/native";
  import { StackScreenProps } from "@react-navigation/stack";
  import LottieView from "lottie-react-native";
  import * as React from "react";
  import { useEffect } from "react";
  import { useState } from "react";
  import Modal from "react-native-modal";
  import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    AsyncStorage,
    Dimensions
  } from "react-native";
  import { Col, Grid, Row } from "react-native-easy-grid";
  import { BaseButton, ScrollView } from "react-native-gesture-handler";
  import MaStyles from "../../assets/styles/MaStyles";
  import Globals from "../../constants/Globals";
  import CachedImage from "react-native-expo-cached-image";
  
  import { RootStackParamList } from "../../types";
  
  import { Card } from "react-native-shadow-cards";
  import maxAuto from "../../api/maxAuto";
  import { findDaysDiffrent } from "../../utils/DateFunctions";
  import { SharedElement } from "react-navigation-shared-element";
import NotFoundScreen from "../../components/NotFoundScreen";
  
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  
  export default function WatchListScreen({
    navigation,
  }: StackScreenProps<RootStackParamList, "NotFound">) {
    const [listCar, setListCar] = useState([]);
    const [customerID, setCustomerId] = useState(null);
    const [logg, setLogg] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [isModalVisible, setModal] = useState(true);
    
  
    useEffect(() => {
      getCar();
    }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        getCar();
      }, [])
    );
  
    const format = (amount) => {
      return Number(amount)
        .toFixed(0)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    };
  
    const getCar = async () => {
  
      const logged = await AsyncStorage.getItem('logged');
      const idCustomer = await AsyncStorage.getItem('customer_id');
      setCustomerId(idCustomer);
      console.log(logged);
      setLogg(logged);
      if(logged == "false"){
  
      }else{
        maxAuto.getWashlist().then((result) => setListCar(result));
      }
          
    };
  
    const renderImage = (url) => {
      console.log(url);
      return (
        <CachedImage
          style={{
            width: width / 2 - 30,
            height: 50,
            zIndex: 20000,
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
          }}
          source={{
            uri: Globals.DEALERSHIP_LOGO + url,
          }}
          resizeMode="stretch"
        />
      );
    };
  
  
    const openSearch = async (flag: string) => {
      //console.log("flag");
      await AsyncStorage.setItem("flag", flag);
      navigation.navigate("Search");
    };
  
    const getDetails = (id: string) => {
      navigation.navigate("VehicleDetails", {
        carId: id,
      });
      //
    };
  
    const addVeh = (item: string, index) => {
      maxAuto.addWashList(customerID, item.vehicule_id);
      let targetItem = listCar[index];
      targetItem.is_added = 1;
      console.log(targetItem);
      listCar[index] = targetItem;
      setRefresh(!refresh);
      //setListCar(listCar);
      //maxAuto.addWashList(customerID, id)
    };
  
    const reVeh = (item: string, index) => {
      console.log(item.vehicule_id + ' - ' + customerID);
      maxAuto.removeWashList(customerID, item.vehicule_id);
      let targetItem = listCar[index];
      targetItem.is_added = 0;
      //console.log(targetItem);
      listCar[index] = targetItem;
      setRefresh(!refresh);
      //setListCar(listCar);
    };
  
    return (
      // <View style={MaStyles.containerFullScreen}>
      <View
      style={[
        MaStyles.containerWhite,
        {marginHorizontal: 0, paddingHorizontal: 0},
      ]}
    >
        <Grid style={{width:"100%",height:"100%"}}>
        {
listCar.length > 0 ? (
            <FlatList
              style={{ paddingBottom: 30,paddingTop:60 }}
              showsVerticalScrollIndicator={false}
              data={listCar}
              
              numColumns={2}
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
                    onPress={() => getDetails(item.vehicule_id)}
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
                   

                      <Text style={MaStyles.titleListingM}>
                        {item.vehicule_year} {item.make_description}{" "}
                        {item.model_desc}
                      </Text>
                      <Grid style={{marginTop:5}}>
                        <Col size={2}>
                          <Text style={MaStyles.subTitleListingM}>
                            ${format(item.vehicule_price)} 
                          </Text>
                        </Col>
                        <Col size={4}>
                          <Text style={MaStyles.smallTitleListingM}>
                            {(item.distance + " km away")}
                          </Text>
                        </Col>
                      </Grid>
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
            <Row style={{ marginTop: 18 }} size={15}>
            <NotFoundScreen 
            titleText={"Empty Watchlist"}
            subTitleText={"You don’t have any Saved vehicles \n in your watchlist"}
            uriImage={require('../../assets/images/splash/empty.png')}
            />  
            </Row>
          )}

          </Grid>
</View>
    );
  }
  
  //function
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    linkText: {
      fontSize: 14,
      color: "#2e78b7",
    },
  });
  