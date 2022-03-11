import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  AsyncStorage,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import MaStyles from "../assets/styles/MaStyles";
import {
  scrollInterpolators,
  animatedStyles,
} from "../assets/styles/CarouselAnimation";

import { Grid, Col, Row } from "react-native-easy-grid";
import { AddListParamList, RootStackParamList } from "../types";
import { Card } from "react-native-elements";
import { AntDesign, Feather } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import HomeScreen from "../screens/HomeScreen";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const width = Dimensions.get("window").width;

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

export default function AddListScreen({
  navigation,
}: StackScreenProps<AddListParamList, "AddListScreen">) {
  //checkLogin
  const [logged, setLogged] = useState(false);
  const [priceCar, setPriceCar] = useState("");
  const [priceMoto, setPriceMoto] = useState("");
  const [carDiscount, setCarDiscount] = useState("");
  const [motoDiscount, setMotoDiscount] = useState("");
  const [loading, setLoading] = useState(false);

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

  const isFocused = useIsFocused();

  const [isIphone, setIsIphone] = useState(true);

  const [itemCard, setItemCard] = useState([]);

  const checkRego = () => {
    console.log(activeIndex);
    if (activeIndex === 0) {
      createListing(true);
    } else {
      createListingMotorbike(true);
    }
  };

  //checklogin
  useEffect(() => {
    checkLogin();
  }, [isFocused]);

  const checkLogin = async () => {
    if (isFocused) {
      //getMaxList Sales
      const logged = await AsyncStorage.getItem("logged");
      //getPrice

      if (logged == "true") {
        setLogged(true);
      } else {
        setLogged(false);
      }
    } else {
    }

    if (Platform.OS == "android") {
      setIsIphone(false);
    }

    const priceCar1 = await AsyncStorage.getItem("priceCar");
    const priceMoto2 = await AsyncStorage.getItem("priceMoto");

    const priceCarDis1 = await AsyncStorage.getItem("priceCarDisc");
    const priceMotoDisc2 = await AsyncStorage.getItem("priceMotoDisc");

    setPriceCar(priceCar1);
    setPriceMoto(priceMoto2);
    setCarDiscount(priceCarDis1);
    setMotoDiscount(priceMotoDisc2);
  };

  const createListing = async (flag: boolean) => {
    const logged = await AsyncStorage.getItem("logged");
    const id = await AsyncStorage.getItem("customer_id");

    if (id == null) {
      navigation.navigate("Login");
    } else {
      if (logged == "true") {
        navigation.navigate("List");
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const createListingMotorbike = async (flag: boolean) => {
    const logged = await AsyncStorage.getItem("logged");
    const id = await AsyncStorage.getItem("customer_id");

    if (id == null) {
      navigation.navigate("Login");
    } else {
      if (logged == "true") {
        console.log(flag);

        navigation.navigate("ListMoto");
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .slice(0, -2);
  };

  const renderItem = ({ item, index }) => {
    if (item.title == "Car") {
      return (
        <View
          style={{
            marginTop: 30,
            paddingHorizontal: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              borderColor: "#a2b0ce",
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#a2b0ce",
                height: 130,
                width: "100%",
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  marginTop: 20,
                  textAlign: "center",
                  fontSize: 30,
                }}
              >
                CAR
              </Text>
            </View>

            <View>
              <Image
                style={{
                  marginTop: -110,
                  width: "70%",
                  height: 200,
                  alignSelf: "center",
                  resizeMode: "contain",
                  overflow: "visible",
                }}
                source={require("../assets/images/splash/mylisting.png")}
                resizeMode="cover"
              />

              <Grid style={{ marginStart: 20, marginTop: -50, height: 250 }}>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/bluecheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>65 Days listing</Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/bluecheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>15 Image uploads</Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/bluecheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>
                      Appear on Nearby Listing
                    </Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/bluecheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>
                      Basic background check
                    </Text>
                  </Col>
                </Row>
              </Grid>

              <TouchableOpacity
                onPress={() => checkRego()}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  marginTop: 20,
                  width: "100%",
                }}
              >
                <ImageBackground
                  source={require("../assets/images/gradiantbg.png")}
                  style={{ width: "100%", height: 50, alignItems: "center" }}
                  imageStyle={{ borderRadius: 200 }}
                >
                  <Text style={[MaStyles.buttonTextM]}>
                    Free - Limited Time
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            marginTop: 30,
            paddingHorizontal: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              borderColor: "#acd1af",
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#acd1af",
                height: 130,
                width: "100%",
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  marginTop: 20,
                  textAlign: "center",
                  fontSize: 30,
                }}
              >
                MOTORCYCLE
              </Text>
            </View>

            <View>
              <Image
                style={{
                  marginTop: -110,
                  width: "70%",
                  height: 200,
                  alignSelf: "center",
                  resizeMode: "contain",
                  overflow: "visible",
                }}
                source={require("../assets/images/splash/moto2.png")}
                resizeMode="cover"
              />

              <Grid style={{ marginStart: 20, marginTop: -50, height: 250 }}>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/greencheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>65 Days listing</Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/greencheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>15 Image uploads</Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/greencheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>
                      Appear on Nearby Listing
                    </Text>
                  </Col>
                </Row>
                <Row style={{ height: 60 }}>
                  <Col style={{ width: 40 }}>
                    <Image
                      style={{ width: 30, height: 30, marginTop: 28 }}
                      source={require("../assets/images/splash/greencheck.png")}
                    ></Image>
                  </Col>
                  <Col>
                    <Text style={MaStyles.textSubM}>
                      Basic background check
                    </Text>
                  </Col>
                </Row>
              </Grid>

              <TouchableOpacity
                onPress={() => checkRego()}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  marginTop: 20,
                  width: "100%",
                }}
              >
                <ImageBackground
                  source={require("../assets/images/gradiantbg.png")}
                  style={{ width: "100%", height: 50, alignItems: "center" }}
                  imageStyle={{ borderRadius: 200 }}
                >
                  <Text style={[MaStyles.buttonTextM]}>
                    Free - Limited Time
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    //Pigments
  };

  const renderItem2 = ({ item, index }) => {
    if (item.title == "Car") {
      item.price = "$" + priceCar + ".00";
      if (carDiscount != "0") {
        item.priceDiscount = "$" + carDiscount + ".00";
      } else {
        item.priceDiscount = "Free";
      }
    } else {
      item.price = "$" + priceMoto + ".00";

      if (motoDiscount != "0") {
        item.priceDiscount = "$" + motoDiscount + ".00";
      } else {
        item.priceDiscount = "Free";
      }
    }
    //item.price = "80";

    // console.log(item);
    if (Platform.OS == "android") {
      return (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 15,
            height: 420,
            marginStart: -40,
            marginLeft: -45,
            marginRight: 0,
          }}
        >
          <View>
            <Image
              style={{
                width: "100%",
                height: 200,
                alignSelf: "flex-start",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
              source={
                item.flag
                  ? require("../assets/images/car1.png")
                  : require("../assets/images/photo1.png")
              }
            />
          </View>
          <View
            style={{ transform: [{ translateY: -180 }], paddingHorizontal: 60 }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>
              {item.title}
            </Text>

            {item.priceDiscount != "" ? (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                    textDecorationLine: "line-through",
                    marginTop: 5,
                  }}
                >
                  {item.price}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 45,
                    marginTop: -5,
                  }}
                >
                  {item.priceDiscount}
                </Text>
              </View>
            ) : (
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 45 }}
              >
                {item.price}
              </Text>
            )}
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 10 }}>
              {item.text}
            </Text>
          </View>

          <View style={{ padding: 30, height: 280, marginTop: -100 }}>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc1}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc3}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc4}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc5}
            </Text>
            <TouchableOpacity onPress={() => createListing(item.flag)}>
              <View style={MaStyles.buttonView}>
                <Text style={MaStyles.buttonText}>Create</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 15,
            height: 395,
            marginStart: -40,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View>
            <Image
              style={{
                width: "100%",
                height: 200,
                alignSelf: "flex-start",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
              source={
                item.flag
                  ? require("../assets/images/car1.png")
                  : require("../assets/images/photo1.png")
              }
            />
          </View>
          <View
            style={{ transform: [{ translateY: -180 }], paddingHorizontal: 60 }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>
              {item.title}
            </Text>
            {item.priceDiscount != "" ? (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                    textDecorationLine: "line-through",
                    marginTop: 5,
                  }}
                >
                  {item.price}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 45,
                    marginTop: -5,
                  }}
                >
                  {item.priceDiscount}
                </Text>
              </View>
            ) : (
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 45 }}
              >
                {item.price}
              </Text>
            )}
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 10 }}>
              {" "}
              {item.text}
            </Text>
          </View>

          <View style={{ padding: 30, height: 280, marginTop: -100 }}>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc1}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc3}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc4}
            </Text>
            <Text>
              <AntDesign name="checkcircleo" size={14} color="#0e4e92" />{" "}
              {item.desc5}
            </Text>
            <TouchableOpacity onPress={() => createListing(item.flag)}>
              <View style={MaStyles.buttonView}>
                <Text style={MaStyles.buttonText}>Create</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    //Pigments
  };

  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <Text style={MaStyles.textHeaderMCenter2}>Place a listing</Text>
      <Text style={[MaStyles.textSubMCenter2]}>
        Sell your vehicle on NZ's newest marketplace
      </Text>

      <View style={{ flex: 7, marginTop: 20 }}>
        {!loading && (
          <Carousel
            data={exampleItems}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 100}
            contentContainerCustomStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onSnapToItem={(index: number) => setActiveIndex(index)}
          />
        )}
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
          containerStyle={{ marginTop: 0 }}
        />
      </View>
    </ScrollView>
  );
}

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
  pagiIOS: {
    transform: [
      {
        translateY: -80,
      },
    ],
  },
  pagiAndroid: {
    transform: [
      {
        translateY: -40,
      },
    ],
  },
});
