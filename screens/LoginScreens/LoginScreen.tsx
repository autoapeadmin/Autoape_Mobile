import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  AsyncStorage,
} from "react-native";
import MaStyles from "../../assets/styles/MaStyles";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import { Alert } from "react-native";

import { LoginStackParamList } from "../../types";
import Globals from "../../constants/Globals";
import { AntDesign } from "@expo/vector-icons";
import { Col, Grid } from "react-native-easy-grid";

import Toast from "react-native-toast-message";
import firebase from "firebase/app";

export default function LoginScreen({
  navigation,
}: StackScreenProps<LoginStackParamList, "Login">) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [customer_id, setCustomerId] = useState("");
  const [isToken, setToken] = useState("");
  const [customer_email, setEmail] = useState("");
  const [customer_name, setName] = useState("");
  const { goBack } = navigation;

  const handleSignInResult = async (result: Google.LogInResult) => {
    console.log(result);

    let name = "Welcome back " + result.user.name;
    //console.log(result);
    fetch(
      Globals.BASE_URL +
        "Maxauto/signInGoogle?social_id=" +
        result.user.id +
        "&social_name=" +
        result.user.name +
        "&social_email=" +
        result.user.email +
        "&access_token=1030" +
        "&customer_photo=" +
        result.user.photoUrl
    )
      .then((response) => response.json())
      .then(async (data) => {
        setCustomerId(data.data.customer_id);
        setToken(data.data.is_token);
        setEmail(data.data.customer_email);
        setName(data.data.customer_name);

        await AsyncStorage.setItem("customer_id", data.data.customer_id);
        await AsyncStorage.setItem("is_token", data.data.is_token);
        await AsyncStorage.setItem("customer_email", data.data.customer_email);
        await AsyncStorage.setItem("customer_name", data.data.customer_name);
        await AsyncStorage.setItem("logged", "true");
        await AsyncStorage.setItem("customer_pic", data.data.customer_pic);
      });

    navigation.replace("Root");

    Toast.show({
      type: "success",
      position: "top",
      text1: "Login successful",
      text2: name,
      topOffset: 50,
    });
  };

  const handleSignInEmail = async () => {
    //console.log(result);
    fetch(
      Globals.BASE_URL +
        "Maxauto/signInEmail?email=" +
        user +
        "&password=" +
        password +
        "&access_token=1030"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.errorcode == 1) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Login",
            text2: data.errormsg,
            topOffset: 50,
          });
        } else {
          console.log(data);
          setCustomerId(data.data.customer_id);
          setToken(data.data.is_token);
          setEmail(data.data.customer_email);
          setName(data.data.customer_name);
          //goBack();
          saveInfoEmail();
        }
      });
  };

  const saveInfoEmail = async () => {
    console.log("aqui");
    await AsyncStorage.setItem("customer_id", customer_id);
    await AsyncStorage.setItem("is_token", isToken);
    await AsyncStorage.setItem("customer_email", customer_email);
    await AsyncStorage.setItem("customer_name", customer_name);
    await AsyncStorage.setItem("logged", "true");
    navigation.replace("Root");
    //redirect to
  };

  const handleSignInFacebook = async (id, name2, email, photoUrl) => {
    let name = "Welcome back " + name2;
    //console.log(result);
    fetch(
      Globals.BASE_URL +
        "Maxauto/signInGoogle?social_id=" +
        id +
        "&social_name=" +
        name2 +
        "&social_email=" +
        email +
        "&access_token=1030"
    )
      .then((response) => response.json())
      .then(async (data) => {
        setCustomerId(data.data.customer_id);
        setToken(data.data.is_token);
        setEmail(data.data.customer_email);
        setName(data.data.customer_name);

        await AsyncStorage.setItem("customer_id", data.data.customer_id);
        await AsyncStorage.setItem("is_token", data.data.is_token);
        await AsyncStorage.setItem("customer_email", data.data.customer_email);
        await AsyncStorage.setItem("customer_name", data.data.customer_name);
        await AsyncStorage.setItem("logged", "true");
        await AsyncStorage.setItem("customer_pic", photoUrl);
      });

    navigation.replace("Root");

    Toast.show({
      type: "success",
      position: "top",
      text1: "Login successful",
      text2: name,
      topOffset: 50,
    });
  };

  const signInAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "210955108243-4gcovdsa11l5c9jaj6omhc4t13pnn85h.apps.googleusercontent.com",
        iosClientId:
          "210955108243-4n9m00tcu995pophga98u2qf7rsp06a9.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        console.log(result);
        handleSignInResult(result);
      } else {
        return { cancelled: true };
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  async function loginWithFacebook() {
    await Facebook.initializeAsync("285038205957351");

    const { type, token }: any = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
    });

    if (type === "success") {
      // Build Firebase credential with the Facebook access token.
      const response = await fetch(
        `https://graph.facebook.com/me/?fields=id,name,email&access_token=${token}`
      ); //<- use the token you got in your request
      const userInfo = await response.json();
      console.log(userInfo);
      handleSignInFacebook(
        userInfo.id,
        userInfo.name,
        userInfo.email,
        "http://graph.facebook.com/" + userInfo.id + "/picture"
      );
    }
  }

  const loginFacebook = () => {
    loginWithFacebook();
  };

  const loginGoogle = () => {
    signInAsync();
  };

  const loginEmail = () => {
    handleSignInEmail();
  };

  return (
    <View style={MaStyles.container}>
      <View style={{ flex: 1 }}>
        <Text style={MaStyles.textHeader}>Welcome Back</Text>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          autoCompleteType={"email"}
          placeholderTextColor={"gray"}
          placeholder={"Enter your email"}
          style={MaStyles.textInput}
          onChangeText={(text) => setUser(text)}
        />
        <TextInput
          placeholderTextColor={"gray"}
          secureTextEntry={true}
          placeholder={"Enter your password"}
          style={[MaStyles.textInput, { marginTop: 25 }]}
          onChangeText={(text) => setPassword(text)}
        />

        <Text
          style={[
            MaStyles.subText,
            { marginTop: 15, marginHorizontal: 4, alignSelf: "flex-end" },
          ]}
        >
          Forgot Password?
        </Text>
      </View>

      <View style={{ flex: 8, width: "100%" }}>
        <TouchableOpacity
          style={{ marginTop: 80 }}
          onPress={() => loginEmail()}
        >
          <View style={MaStyles.buttonView}>
            <Text style={MaStyles.buttonText}>LOG IN</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 50, width: "100%" }}>
          <Text style={{ alignSelf: "center" }}>Or</Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={{ marginTop: 0 }}
            onPress={() => loginFacebook()}
          >
            <View style={MaStyles.buttonView}>
              <Grid>
                <Col>
                  <AntDesign
                    name="facebook-square"
                    size={20}
                    color="white"
                    style={{
                      alignSelf: "flex-end",
                      marginTop: 13,
                      marginEnd: 5,
                    }}
                  />
                </Col>
                <Col size={2}>
                  <Text style={MaStyles.buttonText}>
                    Continue with facebook
                  </Text>
                </Col>
              </Grid>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 0 }}
            onPress={() => loginGoogle()}
          >
            <View style={MaStyles.buttonViewWhite}>
              <Grid>
                <Col>
                  <AntDesign
                    name="google"
                    size={20}
                    color="#0e4e92"
                    style={{
                      alignSelf: "flex-end",
                      marginTop: 13,
                      marginEnd: 5,
                    }}
                  />
                </Col>
                <Col size={2}>
                  <Text style={MaStyles.buttonTextWhite}>
                    Continue with google
                  </Text>
                </Col>
              </Grid>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
