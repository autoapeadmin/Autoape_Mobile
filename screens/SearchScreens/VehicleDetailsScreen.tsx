import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import CachedImage from "react-native-expo-cached-image";
import {
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
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "../../types";
import { useEffect, useState } from "react";
import Globals from "../../constants/Globals";
import { findDaysDiffrent } from "../../utils/DateFunctions";
import { SliderBox } from "react-native-image-slider-box";
import ImageView from "react-native-image-view";
import { Card } from "native-base";
import {
  SharedElement,
  SharedElementsComponentConfig,
} from "react-navigation-shared-element";
import { isLoading } from "expo-font";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function VehicleDetailsScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [carDetails, setCarDetails] = useState([]);
  const [carContact, setCarContact] = useState([]);
  const [carPhotos, setPhotos] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesFull, setImagesFull] = useState([]);

  const [loading, setLoading] = useState(true);
  const [viewPhotos, setViewPhotos] = useState(false);

  const [currentPhoto, setCurrentPhotos] = useState(0);

  useEffect(() => {
    setupPage();
  }, []);

  const setupPage = async () => {
    fetch(Globals.BASE_URL + "Maxauto/findVehicleById/" + route.params.carId)
      .then((response) => response.json())
      .then((data) => {
        setCarDetails(data.data.details);
        setPhotos(data.data.photos);
        setCarContact(data.data.contact);

        console.log(data.data.details);
        data.data.photos.forEach((element) => {
          let urlI = Globals.S3_FULL_URL + element.pic_url;
          //let urlI = "https://www.toyota.co.nz/globalassets/new-vehicles/corolla/2019/corolla-sedan/corolla-sedan-sx-mzesx/corolla-sedan-petrol-infotainment-560x305.jpg?mode=max&scale=downscaleonly&width=1800";
          images.push(urlI);

          let urlIF = {
            source: { uri: urlI },
            title: "Paris",
            width: width,
            height: 260,
          };

          imagesFull.push(urlIF);
        });
        setLoading(false);
      });
  };

  const renderImages = () => {
    if (!loading) {
      return (
        <Image
          source={{ uri: Globals.S3_FULL_URL + carPhotos[0].pic_url }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 300,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      );
    } else {
      return (
        <Image
          source={require("../../assets/images/loading.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 300,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      );
    }
  };

  const renderDetails = () => {
    if (!loading) {
      return (
        <View style={{ height: 41 }}>
          {/*           <View
            style={{
              backgroundColor: "#0e4e92",
              width: 150,
              opacity: 0.9,
              borderRadius: 5,
            }}
          >
            <Text
              style={[
                MaStyles.subText,
                { fontSize: 12, margin: 5, color: "white", marginStart: 10 },
              ]}
            >
              Listed {findDaysDiffrent(carDetails[0].indate)}
            </Text> 
          </View>
          
          <Text style={MaStyles.textHeaderBlack}>
            {carDetails[0].vehicule_year} {carDetails[0].make_description}{" "}
            {carDetails[0].model_desc}
          </Text> */}
        </View>
      );
    }
  };

  const viewDealership = (id) => {
    navigation.navigate("DealershipDetails", { carId: id });
  };

  const renderFinance = () => {
    if (carDetails[0].finance != 0) {
      let type = "";
      if (carDetails[0].finance == 1) {
        type = "PW";
      } else {
        type = "PM";
      }
      return (
        <Text
          style={[
            MaStyles.subText,
            { fontSize: 15, marginTop: 3, color: "black", textAlign: "right" },
          ]}
        >
          Fin. {"$" + format(carDetails[0].finance_price)} {type}
        </Text>
      );
    }
  };

  const renderPrice = () => {
    if (!loading) {
      return (
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <Grid>
            <Row>
              <Col size={2}>
                <Text
                  style={[
                    MaStyles.listingVehicleTextM,
                    { marginTop: 7, color: "#0e4e92" },
                  ]}
                >
                  {carDetails[0].vehicule_year} {carDetails[0].make_description}{" "}
                  {carDetails[0].model_desc}{" "}
                </Text>
              </Col>
              <Col>
                <Text
                  style={[
                    MaStyles.listingPriceBoldM,
                    {
                      textAlign: "right",
                      alignSelf: "flex-end",
                      marginTop: -40,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 20, alignContent: "flex-start" }}>
                    $
                  </Text>
                  {format(carDetails[0].vehicule_price)}{" "}
                </Text>

                {renderFinance()}
              </Col>
            </Row>
          </Grid>

          {/*  <Image
            source={{
              uri:
                Globals.BASE_URL +
                "images/logosMake/" +
                carDetails[0].make_logo +
                ".png",
            }}
            style={{
              width: 70,
              height: 80,
              position: "absolute",
              alignSelf: "flex-end",
            }}
          /> */}
        </View>
      );
    }
  };

  const renderLocation = () => {
    if (!loading) {
      return (
        <View>
          <SharedElement id="dealer">
            <Text style={[MaStyles.listingNameM, { marginTop: -20 }]}>
              {carDetails[0].fk_listing_type == 2
                ? carContact[0].dealership_name
                : carContact[0].customer_name}
            </Text>
            <Text style={MaStyles.listingRegionM}>
              {carDetails[0].region_name} Region Dealership
            </Text>
          </SharedElement>
        </View>
      );
    }
  };

  const renderDetails2 = () => {
    if (!loading) {
      return (
        <Row
          style={{
            height: 30,
            marginTop: 10,
          }}
        >
          <Col>
            <MaterialCommunityIcons
              name="speedometer"
              size={30}
              color="#0e4e92"
            />
          </Col>
          <Col size={2}>
            <Text
              style={[MaStyles.listingNameM, { marginTop: 3, color: "gray" }]}
            >
              {carDetails[0].vehicule_odometer}Km
            </Text>
          </Col>
          <Col>
            <Feather name="settings" size={28} color="#0e4e92" />
          </Col>
          <Col size={2}>
            <Text
              style={[MaStyles.listingNameM, { marginTop: 3, color: "gray" }]}
            >
              {carDetails[0].vehicule_engine == "Not Specified" ? "-"  : carDetails[0].vehicule_engine + "cc"} 
            </Text>
          </Col>
        </Row>
      );
    }
  };

  const renderImages2 = () => {
    if (!loading) {
      return images.length > 0 ? (
        <SliderBox
          currentImageEmitter={(index) => setCurrentPhotos(index)}
          dotStyle={{ marginBottom: 30 }}
          dotColor="#0e4e92"
          sliderBoxHeight={350}
          imageLoadingColor={"#0e4e92"}
          images={images}
          onCurrentImagePressed={(index) => {
            setViewPhotos(true);
          }}
        />
      ) : (
        <Image
          source={require("../../assets/images/placecar.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 350,
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      );
    }
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .slice(0, -2);
  };

  const renderDesc = () => {
    if (!loading) {
      if (carDetails[0].vehicule_desc != "") {
        return (
          <View>
            <View style={{ padding: 20, marginTop: -10 }}>
              <Row>
                <Col>
                  <Text
                    style={[MaStyles.subText, { fontSize: 15, lineHeight: 22 }]}
                  >
                    {carDetails[0].vehicule_desc}
                  </Text>
                </Col>
              </Row>
            </View>
          </View>
        );
      } else {
        return (
          <View>
            <View
              style={{
                height: 5,
                width: "100%",
                backgroundColor: "#3a3b3c17",
                marginTop: 0,
              }}
            ></View>
            <Text
              style={[
                MaStyles.textSubHeader,
                { marginTop: 10, fontSize: 18, paddingHorizontal: 20 },
              ]}
            >
              DESCRIPTION
            </Text>
            <View style={{ padding: 20, marginTop: -10 }}>
              <Row>
                <Col>
                  <Text
                    style={[MaStyles.subText, { fontSize: 15, lineHeight: 22 }]}
                  >
                    {carDetails [0].vehicule_desc}
                  </Text>
                </Col>
              </Row>
            </View>
          </View>
        );
      }
    }
  };

  const renderContactButton = () => {
    if (!loading) {
      return carDetails[0].fk_listing_type == 2 ? (
        <TouchableOpacity
          onPress={() => viewDealership(carDetails[0].fk_dealership_id)}
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 20,
          }}
        >
          <ImageBackground
            source={require("../../assets/images/gradiantbg.png")}
            style={{ width: "100%", height: 50, alignItems: "center" }}
            imageStyle={{ borderRadius: 200 }}
          >
            <Text style={[MaStyles.buttonTextM]}>Visit Dealership</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20 }}
        >
          <ImageBackground
            source={require("../../assets/images/gradiantbg.png")}
            style={{ width: "100%", height: 50, alignItems: "center" }}
            imageStyle={{ borderRadius: 200 }}
          >
            <Text style={[MaStyles.buttonTextM]}>Contact Seller</Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    }
  };

  const renderDetails3 = () => {
    if (!loading) {
      return (
        <View>
          <Row style={{ height: 35, marginTop: 10 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Plate Number: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>
                {carDetails[0].vehicule_rego}
              </Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Body Type: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>
                {carDetails[0].body_type_name}
              </Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Colour: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>Black</Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Transmission: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>Automatic</Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Number of seats: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>5</Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Fuel Type: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>
                {carDetails[0].fuel_desc}
              </Text>
            </Col>
          </Row>

          <Row style={{ height: 35 }}>
            <Col size={1}>
              <Text style={[MaStyles.listingDetailsM]}>Year: </Text>
            </Col>
            <Col style={{ width: "100%" }} size={2}>
              <Text style={[MaStyles.listingDetailsDescM]}>
                {carDetails[0].vehicule_year}
              </Text>
            </Col>
          </Row>
        </View>
      );
    }
  };

  const renderContact = () => {
    if (!loading) {
      //private listing
      if (carDetails[0].fk_listing_type == 1) {
        if (carDetails[0].customer_name) {
          let partName = carDetails[0].customer_name.split(" ");
          let name, lastname;
          if (partName[0]) {
            name = partName[0];
          }
          if (partName[1]) {
            lastname = partName[1];
          }
          return (
            <Row>
              <Col>
                <View
                  style={{
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },

                    shadowOpacity: 0.25,
                    shadowRadius: 4.84,
                  }}
                >
                  <SharedElement id="image">
                    <Image
                      source={{
                        uri: carContact[0].customer_pic,
                      }}
                      resizeMode="cover"
                      style={{
                        width: 70,
                        height: 70,
                        marginTop: -25,
                        borderRadius: 40,
                        borderColor: "white",
                        borderWidth: 3,
                      }}
                    />
                  </SharedElement>
                </View>
              </Col>
              <Col>
                <Text
                  style={[
                    MaStyles.listingTimeM,
                    { textAlign: "right", marginTop: 12 },
                  ]}
                >
                  {findDaysDiffrent(carDetails[0].post_at)}
                </Text>
              </Col>
            </Row>
          );
        }
      }
      //dealership listing
      else {
        return (
          <Row>
            <Col>
              <View
                style={{
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },

                  shadowOpacity: 0.25,
                  shadowRadius: 4.84,
                }}
              >
                <SharedElement id="image">
                  <Image
                    source={{
                      uri: Globals.DEALERSHIP_LOGO + carContact[0].img_base64,
                    }}
                    resizeMode="cover"
                    style={{
                      width: 70,
                      height: 70,
                      marginTop: -25,
                      borderRadius: 40,
                      borderColor: "white",
                      borderWidth: 3,
                    }}
                  />
                </SharedElement>
              </View>
            </Col>
            <Col>
              <Text
                style={[
                  MaStyles.listingTimeM,
                  { textAlign: "right", marginTop: 12 },
                ]}
              >
                {findDaysDiffrent(carDetails[0].post_at)}
              </Text>
            </Col>
          </Row>
        );
      }
    }
  };

  return (
    <View>
      <ScrollView style={{ backgroundColor: "white", height: height }}>
        <View>{renderImages2()}</View>

        {/* <AntDesign name="closecircle" size={30} color="white" style={{ position: "absolute", marginTop: 50, marginStart: 15 }} /> */}

        <Image
          style={{
            height: 110,
            width: "100%",
            position: "absolute",
            opacity: 0.6,
            transform: [{ translateY: 200 }],
          }}
          source={require("../../assets/images/bgoverlay.png")}
        ></Image>

        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 20,
            marginTop: 0,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            transform: [{ translateY: -30 }],
          }}
        >
          {renderContact()}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 0 }}>
          {renderLocation()}
        </View>

        {renderPrice()}

        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          {renderDetails2()}
        </View>

        <View style={{ padding: 20, marginTop: -10 }}>{renderDetails3()}</View>
        {renderDesc()}
        <View style={{ padding: 20, marginTop: -10, paddingBottom: 80 }}>
          <Row style={{ height: 60 }}>
            <Col>
              <Text style={[MaStyles.listingDetailsM, { color: "gray" }]}>
                <FontAwesome name="check-circle" size={18} color="green" /> The
                above vehicle is NOT reported stolen {"\n"} as of{" "}
                {new Date().toLocaleDateString()}
              </Text>
            </Col>
          </Row>
        </View>

        <View style={{ marginTop: 20 }}>
          <ImageView
            animationType={"fade"}
            style={{ paddingTop: 300 }}
            images={imagesFull}
            imageIndex={currentPhoto}
            isVisible={viewPhotos}
            onClose={() => setViewPhotos(false)}
            //renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
          />
        </View>
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
            <Row style={{ marginTop: -25, height: 40 }}>
              <Col style={{ marginHorizontal: 1 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ width: "100%", bottom: 5, alignSelf: "center" }}
                >
                  <View
                    style={[
                      MaStyles.buttonViewWhite,
                      {  height: 50 },
                    ]}
                  >
                    <Text style={MaStyles.buttonTextWhite}>Done</Text>
                  </View>
                </TouchableOpacity>
              </Col>
            </Row>

            <Row style={{ marginTop: 50, position: "absolute" }}>
              <Col style={{ marginBottom: 15 }}>
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
              <Col style={{ marginBottom: 15 }}>
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
              <Col style={{ marginBottom: 15 }}>
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
      </ScrollView>

      <Row
        style={{
          height: 60,
          width: "100%",
          position: "absolute",
          bottom: 0,
          alignSelf: "center",
          backgroundColor: "transparent",
        }}
      >
        {renderContactButton()}
      </Row>
    </View>
  );
}

const sharedElements: SharedElementsComponentConfig = () => {
  return [
    { id: "photos", animation: "fade" },
    { id: "close", animation: "fade-in" },
  ];
};
VehicleDetailsScreen.sharedElements = sharedElements;
