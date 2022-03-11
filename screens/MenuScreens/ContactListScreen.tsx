import {
    AntDesign
  } from "@expo/vector-icons";
  import { StackScreenProps } from "@react-navigation/stack";
  import LottieView from "lottie-react-native";
  import * as React from "react";
  import {
    Animated,
    Dimensions
  } from "react-native";
  import {
    FlatList,
    Text,
    TouchableOpacity,
    View
  } from "react-native";
  import { Col, Grid, Row } from "react-native-easy-grid";
  import MaStyles from "../../assets/styles/MaStyles";
  import CachedImage from "react-native-expo-cached-image";
  import { RootStackParamList } from "../../types";
  import { useEffect, useState } from "react";
  import maxAuto from "../../api/maxAuto";
  import { SharedElement } from "react-navigation-shared-element";
import Globals from "../../constants/Globals";
  
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  
  export default function ContactListScreen({
    navigation,
    route,
  }: StackScreenProps<RootStackParamList, "NotFound">) {
    const scrollY = React.useRef(new Animated.Value(0)).current;
  
    const [listCar, setListCar] = useState([]);
    const [page, setPage] = useState(1);
  
    const [isModalVisible, setModalVisible] = useState(false);
  
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
  
    const [logged, setLogged] = useState("false");
  
    const [refresh, setRefresh] = useState(true);
  
    const [loading, setLoading] = useState(true);
  
    const [refreshing, setRefreshing] = React.useState(false);
    const [regionId, setRegionId] = useState("0");
    const [listRegion, setRegionList] = useState([]);

    

  
    const onRefresh = React.useCallback(async () => {

      setRefreshing(true);
      setupPage();
      setRefreshing(false);
    }, [refreshing]);
  
    useEffect(() => {
      setupPage();
    }, []);
  
  
    const setupPage = async () => {
      setPage(1);

      maxAuto.silentLogin().then((result) => {
        maxAuto.getContactList().then((result) => {
          console.log(result);
          setListCar(result);
          setLoading(false);
        });
      });
    };
  
    const getDetailsDealership = (id: string, distance: string) => {
        navigation.navigate("DealershipDetails", { carId: id, dist: distance });
      };

    return (
      <View
        style={[
          MaStyles.container,
          { marginHorizontal: 0, paddingHorizontal: 0,width:"100%" },
        ]}
      >
        <Grid>
        <Row style={{ paddingHorizontal: 10, height: 40,width:"100%" }}>
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
              <Text style={MaStyles.textHeaderScreenM}>My Contacts </Text>
            </Col>
          </Grid>
        </Row>
          <Row style={{ paddingHorizontal: 15,width:"100%" }}>
            <Col>
              <Text
                style={[
                  MaStyles.TextCardListView,
                  { marginTop: 10, textAlign: "left"},
                ]}
              >
                {listCar.length} Businesses
              </Text>
            </Col>
          </Row>


          {listCar.length != 0 ? 
           <Row style={{ marginTop: 0 }} size={16}>
           {!loading && (
             <FlatList
               ListFooterComponent={<View style={{ margin: 0 }} />}
               style={{ paddingBottom: 30, marginStart: 0, marginTop: 0 }}
               showsVerticalScrollIndicator={false}
               extraData={refresh}
               data={listCar}
               numColumns={1}
               //onEndReached={loadMore}
               //extraData={refresh}
               keyExtractor={(item) => item.dealership_id}
               renderItem={({ item, index }) => (
                 <View
                 style={{
                    width: width - 20,
                    margin: 8,
                    borderRadius: 8,
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 12,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84
                  }}
                 >
                   <TouchableOpacity
                     onPress={() =>  getDetailsDealership(item.dealership_id)}
                   >
                        <Grid>
                          <Col size={1}>
                            {item.customer_pic != "" && (
                              <SharedElement id="profilePhoto">
                                <View
                             style={{
                               shadowColor: "#000",
                               shadowOffset: {
                                 width: 0,
                                 height: 2,
                               },
                               shadowOpacity: 0.25,
                               shadowRadius: 3.84,
                               backgroundColor: "#0000",
                             }}
                           >
                                <CachedImage
                                  style={{
                                    width: 70,
                                    height:70,
                                    marginEnd: -6,
                                    zIndex: 20000,
                                    marginTop: -2,
                                    borderRadius: 100,
                                    alignSelf: "flex-start",
                                  }}
                                  source={{
                                    uri: Globals.DEALERSHIP_LOGO + item.img_base64,
                                  }}
                                  resizeMode="stretch"
                                />
                                </View>
                              </SharedElement>
                            )}
                          </Col>
                          <Col style={{marginTop:3}} size={2.5}>
                            <Text style={MaStyles.contactNameSearch}>
                              {item.dealership_name}
                            </Text>
                            <Text style={MaStyles.contactRegionSearch}>
                              {item.region_name} Region Dealership
                            </Text>
                            <Row style={{marginTop:4}}>
                            <Col><Text style={MaStyles.emailcontactRegionSearch}>
                              {item.dealership_email}
                            </Text></Col>
                            </Row>
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
            <TouchableOpacity onPress={(value) => openModal()} style={{paddingHorizontal:15}}>
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
  

      </View>
    );
  }
  