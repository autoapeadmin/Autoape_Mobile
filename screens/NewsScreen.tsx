import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {
  Animated,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView,
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
import {Col, Grid, Row} from "react-native-easy-grid";
import MaStyles from "../assets/styles/MaStyles";
import {ModalSelectList} from "react-native-modal-select-list";
import Modal from "react-native-modal";
import CachedImage from "react-native-expo-cached-image";
import {Card} from "react-native-shadow-cards";
import {RootStackParamList} from "../types";
import {useEffect, useState} from "react";
import Globals from "../constants/Globals";
import VehicleListGrid from "../components/VehicleComponents/VehicleListGrid";
import maxAuto from "../api/maxAuto";
import {findDaysDiffrent} from "../utils/DateFunctions";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../components/CustomMarker";
import {SliderBox} from "react-native-image-slider-box";
import {SharedElement} from "react-navigation-shared-element";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function NewsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [listCar, setListCar] = useState([]);
  const [page, setPage] = useState(1);

  const [fromRealSale, setFromRealSale] = useState("0");

  const [customerID, setCustomerId] = useState("");
  const [logged, setLogged] = useState("false");

  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setPage(1);
    setRefreshing(true);
    setupPage();
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    setupPage();
  }, []);

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
    setCustomerId(idCustomer);
    console.log(logged);

    setLogged(logged);

    if (logged == "false") {
    } else {
      maxAuto.getNews(page).then((result) => {
        console.log(result);
        setListCar(result);
        setLoading(false);
      });
    }
  };

  const getDetails = (id: string) => {
    navigation.navigate("CarDetails", {carId: id});
  };

  const addLike = (item: string, index) => {
    if (logged == "true") {
      maxAuto.addLike(customerID, item.vehicule_id);
      let targetItem = listCar[index];
      targetItem.is_likes = 1;
      targetItem.likes = +1;
      listCar[index] = targetItem;
      setRefresh(!refresh);
    } else {
      navigation.navigate("Login");
    }
  };

  const remLike = (item: string, index) => {
    maxAuto.removeLike(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_likes = 0;
    targetItem.likes = targetItem.likes - 1;
    console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
  };

  const addVeh = (item: string, index) => {
    if (logged == "true") {
      maxAuto.addWashList(customerID, item.vehicule_id);
      let targetItem = listCar[index];
      targetItem.is_added = 1;
      console.log(targetItem);
      listCar[index] = targetItem;
      setRefresh(!refresh);
    } else {
      navigation.navigate("Login");
    }
  };

  const reVeh = (item: string, index) => {
    maxAuto.removeWashList(customerID, item.vehicule_id);
    let targetItem = listCar[index];
    targetItem.is_added = 0;
    console.log(targetItem);
    listCar[index] = targetItem;
    setRefresh(!refresh);
    //setListCar(listCar);
  };

  const loadMore = () => {
    let ind = page + 1;
    console.log("**************************************** Page :" + ind);
    setPage(ind);
    maxAuto.getNews(ind).then((result) => {
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
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .slice(0, -2);
  };
  function numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const renderImages = (url) => {
    if (!loading) {
      return (
        <View style={{marginTop: 10}}>
          <CachedImage
            style={{
              width: "100%",
              height: 165,
              zIndex: 20000,
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

  return (
    <View
      style={[MaStyles.container, {marginHorizontal: 0, paddingHorizontal: 0}]}
    >
      <Grid>
        <Row style={{height: 40, width: "100%", paddingHorizontal: 15}}>
          <Col size={5}>
            <Text style={MaStyles.textHeader}>Feeds</Text>
          </Col>
        </Row>
        <Row style={{paddingHorizontal: 15}}>
          <Col>
            <Text
              style={[MaStyles.subTextMake, {marginTop: 0, textAlign: "left"}]}
            >
              News from your favorite dealership
            </Text>
          </Col>
        </Row>
        <Row style={{marginTop: 0}} size={18}>
          {!loading && (
            <Animated.FlatList
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {useNativeDriver: true}
              )}
              style={{marginBottom: 30}}
              showsVerticalScrollIndicator={false}
              data={listCar}
              onEndReached={loadMore}
              extraData={refresh}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              numColumns={1}
              keyExtractor={(item) => item.vehicule_id}
              renderItem={({item, index}) => {
                const inputRange = [-1, 0, 286 * index, 286 * (index + 2)];

                const opacityInputRange = [
                  -1,
                  0,
                  286 * index,
                  286 * (index + 1),
                ];
                const scale = scrollY.interpolate({
                  inputRange,
                  outputRange: [1, 1, 1, 0],
                });
                const opacity = scrollY.interpolate({
                  inputRange: opacityInputRange,
                  outputRange: [1, 1, 1, 0],
                });

                return (
                  <Animated.View
                    style={{
                      width: width,
                      margin: 0,
                      transform: [{scale}],
                      opacity,
                      backgroundColor: "white",

                      paddingVertical: 12,
                      elevation: 3,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      marginBottom: 5,
                    }}
                  >
                    <TouchableOpacity>
                      <Grid style={{marginStart: 15}}>
                        <Col size={1}>
                          {item.img_base64 != "" && (
                            <View
                              style={{
                                elevation: 4,
                                backgroundColor: "white",
                                width: 38,
                                height: 38,
                                borderColor: "white",
                                borderWidth: 1,
                                borderRadius: 40,
                                shadowColor: "#000",
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                              }}
                            >
                              <CachedImage
                                style={{
                                  width: 38,
                                  height: 38,
                                  marginEnd: -6,
                                  zIndex: 20000,
                                  marginTop: -2,
                                  borderRadius: 5,
                                  alignSelf: "flex-start",
                                }}
                                source={{
                                  uri:
                                    Globals.DEALERSHIP_LOGO + item.img_base64,
                                }}
                                resizeMode="stretch"
                              />
                            </View>
                          )}
                        </Col>
                        <Col size={4}>
                          <Text style={MaStyles.dealerNameSearch}>
                            {item.dealership_name}
                          </Text>
                          <Text style={MaStyles.dealerRegionSearch}>
                            {item.region_name} Region Dealership
                          </Text>
                        </Col>
                        <Col style={{marginEnd: 10, marginTop: 24}} size={2}>
                          <Text style={MaStyles.daysAgoSearch}>
                            {findDaysDiffrent(item.post_at)}
                          </Text>
                        </Col>
                      </Grid>

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
                            marginTop: 55,
                            marginEnd: 15,
                          }}
                        >
                          <AntDesign
                            name="staro"
                            size={20}
                            color="white"
                            style={{textAlign: "center", marginTop: 5}}
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
                            marginTop: 55,
                            marginEnd: 15,
                          }}
                        >
                          <AntDesign
                            name="star"
                            size={20}
                            color="#ffbf00"
                            style={{textAlign: "center", marginTop: 5}}
                          />
                        </TouchableOpacity>
                      )}

                      {renderImages(item.pic_url)}

                      <View
                        style={{
                          margin: 8,
                          marginBottom: 15,
                          height: 30,
                          paddingTop: 5,
                        }}
                      >
                        <Grid>
                          <Col style={{height: 30}}>
                            <Text style={MaStyles.TextCardListView}>
                              {item.vehicule_year} {item.make_description}{" "}
                              {item.model_desc}
                            </Text>
                          </Col>
                          <Col style={{height: 30}}>
                            <Text style={MaStyles.SubTextCardListView}>
                              ${format(item.vehicule_price)}
                            </Text>
                          </Col>
                        </Grid>
                        <Grid style={{marginTop: 20}}>
                          <Col style={{height: 30}} size={1}>
                            <Row>
                              <Col size={2}>
                                <FontAwesome
                                  style={{position: "absolute", marginTop: 1}}
                                  name="tachometer"
                                  size={19}
                                  color="gray"
                                />
                              </Col>
                              <Col size={8}>
                                <Text style={MaStyles.subTextMakeList2}>
                                  {numberWithCommas(item.vehicule_odometer)} km
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                          <Col style={{height: 30}} size={1}>
                            <Row>
                              <Col size={2}>
                                <MaterialCommunityIcons
                                  name="gas-station-outline"
                                  size={19}
                                  color={"gray"}
                                  style={{position: "absolute", marginTop: 2}}
                                />
                              </Col>
                              <Col size={8}>
                                <Text style={MaStyles.subTextMakeList2}>
                                  {item.fuel_desc}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                          <Col style={{height: 30, marginTop: 3}}></Col>
                        </Grid>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 0.5,
                          marginHorizontal: 10,
                          borderColor: "#8080803d",
                        }}
                      ></View>

                      <View
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <Grid style={{marginTop: 0}}>
                          {item.is_likes == 0 ? (
                            <Col onPress={() => addLike(item, index)}>
                              <Text style={MaStyles.newsButtons}>
                                <AntDesign
                                  name="like2"
                                  size={19}
                                  color="gray"
                                />{" "}
                                {item.likes} Likes
                              </Text>
                            </Col>
                          ) : (
                            <Col onPress={() => remLike(item, index)}>
                              <Text style={MaStyles.newsButtonsLiked}>
                                <AntDesign
                                  name="like1"
                                  size={19}
                                  color="#0e4e92"
                                />{" "}
                                {item.likes} Likes
                              </Text>
                            </Col>
                          )}

                          <Col onPress={() => getDetails(item.vehicule_id)}>
                            <Text style={MaStyles.newsButtons}>
                              <AntDesign
                                name="arrowright"
                                size={19}
                                color="gray"
                              />
                              {"  "}
                              View Vehicle
                            </Text>
                          </Col>
                          <Col onPress={onShare}>
                            <Text style={MaStyles.newsButtons}>
                              <AntDesign
                                name="sharealt"
                                size={19}
                                color="gray"
                              />
                              {"  "}
                              Share
                            </Text>
                          </Col>
                        </Grid>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
          )}
        </Row>
      </Grid>
    </View>
  );
}
