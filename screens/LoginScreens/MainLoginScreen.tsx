import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  AsyncStorage,
  BackHandler,
} from "react-native";
import MaStyles from "../../assets/styles/MaStyles";

import { LoginStackParamList } from "../../types";

import ScrollingBackground from "react-native-scrolling-images";
import Globals from "../../constants/Globals";

const { width, height } = Dimensions.get("window");

export default function MainLoginScreen({
  navigation,
}: StackScreenProps<LoginStackParamList, "Main">) {
  const [isLoged, setIsLoged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let marginTop;

  if (height < 750) {
    marginTop = 170;
  } else {
    marginTop = 250;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    setupPage();
  }, []);

  const setupPage = async () => {
    const id_customer = await AsyncStorage.getItem("customer_id");
    const is_token = await AsyncStorage.getItem("is_token");
    const logged = await AsyncStorage.getItem("logged");

    if (logged == "true") {
      fetch(
        Globals.BASE_URL +
          "Maxauto/silentLogin?id_customer=" +
          id_customer +
          "&token_id=" +
          is_token
      )
        .then((response) => response.json())
        .then((data) => {
          if ((data.data = "false")) {
            setIsLoged(true);
            navigation.replace("Root");
          } else {
            setIsLoged(false);
            setIsLoading(false);
          }
        });
    } else {
      setIsLoged(false);
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <View
      style={{
        backgroundColor: "#0e4e92",
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: "100%", height: 280, marginTop: -30 }}
        source={require("../../assets/images/logoVertical.png")}
      />
    </View>
  ) : (
    <View>
      <ScrollingBackground
        style={MaStyles.scrollingBackground}
        speed={30}
        direction={"up"}
        images={[require("../../assets/images/bglogin3.jpg")]}
      />
      <View
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          alignSelf: "center",
          width: width - 50,
        }}
      >
        <View style={{ width: "100%", marginTop: 50 }}>
          <Image
            style={{ width: "100%", height: 280, marginTop: 30 }}
            source={require("../../assets/images/logoVertical.png")}
          />
          <Text
            style={{
              bottom: 0,
              marginTop: -40,
              alignSelf: "center",
              fontSize: 30,
              color: "white",
            }}
          >
            Find your next drive...
          </Text>
        </View>

        <View style={{ width: "100%", marginTop: marginTop }}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <View style={MaStyles.buttonView}>
              <Text style={MaStyles.buttonText}>LOG IN</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <View style={MaStyles.buttonViewWhite}>
              <Text style={MaStyles.buttonTextWhite}>CREATE AN ACCOUNT</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
