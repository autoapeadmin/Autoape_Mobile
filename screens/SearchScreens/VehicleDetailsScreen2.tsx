import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
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
        setLoading(false);

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
      });
  };

  const renderImages = () => {
    console.log(carDetails);
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
        <View>
          <View
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
          </Text>
        </View>
      );
    }
  };

  const renderPrice = () => {
    if (!loading) {
      return (
        <View>
          <Text style={[MaStyles.textHeader, { marginTop: 20, fontSize: 30 }]}>
            ${format(carDetails[0].vehicule_price)}{" "}
          </Text>
          <Image
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
          />
        </View>
      );
    }
  };

  const renderLocation = () => {
    if (!loading) {
      return (
        <View>
          <Text style={[MaStyles.subText, { fontSize: 15 }]}>
            <FontAwesome5 name="location-arrow" size={11} color="gray" />{" "}
            {carDetails[0].region_name} region.
          </Text>
        </View>
      );
    }
  };

  const renderDetails2 = () => {
    if (!loading) {
      return (
        <Row style={{ height: 30, marginTop: 20 }}>
          <Col>
            <MaterialCommunityIcons
              style={{ alignSelf: "center" }}
              name="engine"
              size={28}
              color="#0e4e92"
            />
            <Text
              style={[
                MaStyles.subTextCard,
                { textAlign: "center", marginTop: 10 },
              ]}
            >
              {carDetails[0].vehicule_engine} cc
            </Text>
          </Col>
          <Col>
            <MaterialCommunityIcons
              style={{ alignSelf: "center" }}
              name="car-cruise-control"
              size={28}
              color="#0e4e92"
            />
            <Text
              style={[
                MaStyles.subTextCard,
                { textAlign: "center", marginTop: 11 },
              ]}
            >
              {carDetails[0].vehicule_odometer}Km
            </Text>
          </Col>
          <Col>
            <MaterialCommunityIcons
              style={{ alignSelf: "center" }}
              name="fuel"
              size={28}
              color="#0e4e92"
            />
            <Text
              style={[
                MaStyles.subTextCard,
                { textAlign: "center", marginTop: 10 },
              ]}
            >
              Fuel Type
            </Text>
          </Col>
        </Row>
      );
    }
  };

  const renderImages2 = () => {
    if (!loading) {
      return (
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
      );
    }
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const renderDesc = () => {
    if (!loading) {
      return (
        <View>
          <Row>
            <Col>
              <Text style={[MaStyles.subText, { fontSize: 15 }]}>
                {carDetails[0].vehicule_desc}
              </Text>
            </Col>
          </Row>
        </View>
      );
    }
  };

  const renderDetails3 = () => {
    if (!loading) {
      return (
        <View>
          <Row style={{ height: 20 }}>
            <Col>
              <Text style={[MaStyles.subText, { fontSize: 15 }]}>
                Number Plate:{" "}
              </Text>
            </Col>
            <Col>
              <Text style={[MaStyles.subTextDetails, { fontSize: 15 }]}>
                {carDetails[0].vehicule_rego}
              </Text>
            </Col>
          </Row>

          <Row style={{ height: 20 }}>
            <Col>
              <Text style={[MaStyles.subText, { fontSize: 15 }]}>
                Body Style:{" "}
              </Text>
            </Col>
            <Col>
              <Text style={[MaStyles.subTextDetails, { fontSize: 15 }]}>
                {carDetails[0].body_type_name}
              </Text>
            </Col>
          </Row>

          <Row style={{ height: 20 }}>
            <Col>
              <Text style={[MaStyles.subText, { fontSize: 15 }]}>
                Engine size:{" "}
              </Text>
            </Col>
            <Col>
              <Text style={[MaStyles.subTextDetails, { fontSize: 15 }]}>
                {carDetails[0].vehicule_engine} cc
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
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Card
                style={{
                  width: "100%",
                  margin: 5,
                  borderRadius: 5,
                  marginBottom: 30,
                  height: 140,
                }}
              >
                <TouchableOpacity>
                  <Row style={{ height: 100, padding: 20 }}>
                    <Col onPress={() => setModalVisible(true)}>
                      <View
                        style={{
                          backgroundColor: "#0e4e92",
                          padding: 20,
                          height: 100,
                          width: 100,
                          borderRadius: 50,
                        }}
                      >
                        <Text style={MaStyles.contactText}>
                          {name.charAt(0)} {lastname.charAt(0)}
                        </Text>
                      </View>
                    </Col>
                    <Col onPress={() => setModalVisible(true)} size={1.5}>
                      <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                        {carDetails[0].customer_name}
                      </Text>
                      <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                        {carDetails[0].email_contact}
                      </Text>
                      <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                        {carDetails[0].phone_contact}
                      </Text>
                    </Col>
                  </Row>
                </TouchableOpacity>
              </Card>
            </TouchableOpacity>
          );
        }
      }
      //dealership listing
      else {
        return (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Card
              style={{
                width: "100%",
                margin: 5,
                borderRadius: 5,
                marginBottom: 30,
                height: 140,
              }}
            >
              <Row style={{ height: 100, padding: 20 }}>
                <Col onPress={() => setModalVisible(true)}>
                  <Image
                    source={{
                      uri:
                        Globals.DEALERSHIP_LOGO + carContact[0].dealership_logo,
                    }}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: 40,
                      marginTop: 30,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                  />
                </Col>
                <Col
                  onPress={() => setModalVisible(true)}
                  style={{ marginStart: 20 }}
                  size={1.5}
                >
                  <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                    {carContact[0].dealership_name}
                  </Text>
                  <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                    {carContact[0].dealership_email}
                  </Text>
                  <Text style={[MaStyles.subTextCard, { marginTop: 11 }]}>
                    {carContact[0].dealership_phone}
                  </Text>
                </Col>
              </Row>
            </Card>
          </TouchableOpacity>
        );
      }
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white", display: "none" }}>
      <View>{renderImages2()}</View>

      {/* <AntDesign name="closecircle" size={30} color="white" style={{ position: "absolute", marginTop: 50, marginStart: 15 }} /> */}

      <Image
        style={{
          height: 120,
          width: "100%",
          position: "absolute",
          opacity: 0.6,
          transform: [{ translateY: 230 }],
        }}
        source={require("../../assets/images/bgoverlay.png")}
      ></Image>

      <View
        style={{
          padding: 20,
          marginTop: -30,
          transform: [{ translateY: -100 }],
        }}
      >
        {renderDetails()}
      </View>
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          marginTop: -10,
          transform: [{ translateY: -80 }],
        }}
      >
        {renderPrice()}
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: -70 }}>
        {renderLocation()}
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        {renderDetails2()}
      </View>
      <Text
        style={[
          MaStyles.textSubHeader,
          { marginTop: 50, fontSize: 18, paddingHorizontal: 20 },
        ]}
      >
        VEHICLE INFORMATIONS
      </Text>
      <View style={{ padding: 20, marginTop: -10 }}>{renderDetails3()}</View>
      <Text
        style={[
          MaStyles.textSubHeader,
          { marginTop: 0, fontSize: 18, paddingHorizontal: 20 },
        ]}
      >
        DESCRIPTION
      </Text>
      <View style={{ padding: 20, marginTop: -10 }}>{renderDesc()}</View>
      <Text
        style={[
          MaStyles.textSubHeader,
          { marginTop: 0, fontSize: 18, paddingHorizontal: 20 },
        ]}
      >
        VEHICLE BACKGROUND
      </Text>
      <View style={{ padding: 20, marginTop: -10 }}>
        <Row style={{ height: 20 }}>
          <Col>
            <Text style={[MaStyles.subText, { fontSize: 15 }]}>
              Vehicle reporter stolen:{" "}
            </Text>
          </Col>
          <Col>
            <Text style={[MaStyles.textSubHeader, { fontSize: 15 }]}>NO</Text>
          </Col>
        </Row>
      </View>
      <Text
        style={[
          MaStyles.textSubHeader,
          { marginTop: 0, fontSize: 18, paddingHorizontal: 20 },
        ]}
      >
        CONTACT
      </Text>
      <View style={{ paddingHorizontal: 20, marginTop: 13 }}>
        {renderContact()}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textPrimary: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "600",
    color: "gray",
  },
  textSecundary: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    fontWeight: "400",
    color: "gray",
  },
  textSecundaryDistance: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "400",
    color: "gray",
  },
});
