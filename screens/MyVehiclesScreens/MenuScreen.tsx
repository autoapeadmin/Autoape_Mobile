//asdf jkl  lkajdf kajsdlfa lhfsfhlhfsfhk
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  Linking,
  ScrollView,
} from "react-native";
import { Text, TouchableOpacity, View, Image } from "react-native";
import MaStyles from "../assets/styles/MaStyles";
import { RootStackParamList } from "../types";
import { AntDesign, Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { ModalSelectList } from "react-native-modal-select-list";
import { Col, Grid, Row } from "react-native-easy-grid";
import maxAuto from "../api/maxAuto";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Globals from "../constants/Globals";
import {
  animatedStyles,
  scrollInterpolators,
} from "../assets/styles/CarouselAnimation";
import { RFValue } from "react-native-responsive-fontsize";
import MenuItem from "../components/MenuItem";
const HEADER_EXPANDED_HEIGHT = 150;
const HEADER_COLLAPSED_HEIGHT = 50;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function MenuScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [picProfile, setPicProfile] = useState("");
  const [profileName, setNameProfile] = useState("");
  const [email, setEmail] = useState("");
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const [scrollEnable, setScrollEnable] = useState(true);
  const [scrollEnable2, setScrollEnable2] = useState(true);

  const [isScrollCarousel, setScrollCaroulse] = useState(true);

  const [maxHeight, setMaxHeigth] = useState(1280);
  const [optionSelected, setOptionSelected] = useState(0);

  const [number, setNumber] = useState([]);

  const [pdfNumber, setPdfNumber] = useState("0 saved");
  const [watchNumber, setWatchNumber] = useState("0 saved");
  useEffect(() => {
    setupScreen();
  }, []);

  //Alvaro
  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.setItem("logged", "false");
            await AsyncStorage.setItem("customer_id", "0");

            fetch(Globals.BASE_URL + "Maxauto/signOut")
              .then((response) => response.json())
              .then((data) => {
                //setListMake(data.data);
              });

            navigation.replace("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setupScreen = async () => {
    let image = await AsyncStorage.getItem("customer_pic");
    let name = await AsyncStorage.getItem("customer_name");
    let email = await AsyncStorage.getItem("customer_email");
    let id = await AsyncStorage.getItem("customer_id");

    maxAuto.getBanners().then(async (result) => {
      setListBanner(result.banners);
    });
    maxAuto.getDashboardNumber().then(async (result) => {
      //console.log(result);
      setNumber(result);
      setPdfNumber(result.pdf + " saved");
      setWatchNumber(result.watch + " saved");
    });

    //get my car list jdsf  lk 18-16-16-11 ->
    ////console.log(image);
    setPicProfile(image);
    setNameProfile(name);
    setEmail(email);
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  let exampleItems = [
    {
      title: "all",
    },
    {
      title: "profile",
    },
    {
      title: "checks",
    },
    {
      title: "tools",
    },
  ];

  let cRef;
  const carouselRef = (ref) => (cRef = ref);

  let cRef2;
  const carouselRef2 = (ref) => (cRef2 = ref);

  const actionBanner = (actionType, action, actionScreen) => {
    ////console.log(actionType);
    if (actionType === "0") {
      navigation.navigate(actionScreen);
    } else {
      Linking.openURL("https://" + action);
    }
  };

  //console.log(width);

  const renderItemBanner = ({ item, index }) => {
    let url = Globals.S3_THUMB_URL_BANNER_FULL + item.bg_image;
    let urlImage = Globals.S3_THUMB_URL_BANNER + item.image;
    let urlBtImage = Globals.S3_THUMB_URL_BANNER + item.button_image;

    return (
      <TouchableOpacity
        style={{ width: "100%", marginTop: 14, height: 200, borderRadius: 20 }}
      >
        <TouchableOpacity
          onPress={() =>
            actionBanner(item.type_action, item.action, item.action_screen)
          }
        >
          <ImageBackground
            resizeMode={"cover"}
            imageStyle={{ borderRadius: 10 }}
            style={{
              height: 120,
              width: "100%",
              overflow: "hidden",
              marginTop: 20,
            }}
            source={{ uri: url }}
          >
            <Text
              style={[
                MaStyles.TextCardListView,
                {
                  color: item.title_color,
                  fontSize: 18,
                  marginTop: 20,
                  marginStart: 20,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                MaStyles.TextCardListView,
                {
                  color: item.title_color,
                  fontSize: 18,
                  marginTop: 3,
                  marginStart: 20,
                },
              ]}
            >
              {item.subtitle}
            </Text>
            <Text
              style={[
                MaStyles.TextCardListView,
                {
                  color: item.title_color,
                  fontSize: 15,
                  marginTop: 13,
                  marginStart: 20,
                },
              ]}
            >
              {item.button_text}{" "}
              <AntDesign name="arrowright" size={13} color="white" />
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const navigateTo = (navigate: string) => {
    navigation.navigate(navigate);
  };

  const renderItem = ({ item, index }) => {
    switch (item.title) {
      case "all":
        return (
          <Grid style={{ marginTop: RFValue(30) }}>
            <Row>
              <MenuItem
                titleText={"Full Vehicle History     Report"}
                subTitleText={""}
                uriImage={require("../assets/images/splash/vehiclereport.png")}
                onPressItem={() => {
                  navigateTo("News");
                }}
              />
              <MenuItem
                titleText={"My Documents"}
                subTitleText={pdfNumber}
                uriImage={require("../assets/images/splash/pdfIcon.png")}
                onPressItem={() => {
                  navigateTo("MyDocuments");
                }}
              />
            </Row>
            <Row>
              <MenuItem
                titleText={"Verify Ownership"}
                subTitleText={"Vehicle owner check"}
                uriImage={require("../assets/images/splash/owner.png")}
                onPressItem={() => {
                  navigateTo("Owner");
                }}
              />
              <MenuItem
                titleText={"Charging Stations"}
                subTitleText={"Locator"}
                uriImage={require("../assets/images/splash/ev.png")}
                onPressItem={() => {
                  navigateTo("EvCharger");
                }}
              />
            </Row>
            <Row>
              <MenuItem
                titleText={"My Listings"}
                subTitleText={"0 vehicles listed"}
                uriImage={require("../assets/images/splash/mylisting.png")}
                onPressItem={() => {
                  navigateTo("MyListing");
                }}
              />
              <MenuItem
                titleText={"Sales Agreement"}
                subTitleText={"Document generator"}
                uriImage={require("../assets/images/splash/sales.png")}
                onPressItem={() => {
                  navigateTo("SalesAgreement2");
                }}
              />
            </Row>
            <Row>
              <MenuItem
                titleText={"Traffic Camera"}
                subTitleText={"Over 100 key locations"}
                uriImage={require("../assets/images/splash/trafic.png")}
                onPressItem={() => {
                  navigateTo("TrafficCamera2");
                }}
              />

              <MenuItem
                titleText={"Stolen Vehicle"}
                subTitleText={"Police Check"}
                uriImage={require("../assets/images/splash/stol.png")}
                onPressItem={() => {
                  navigateTo("Police");
                }}
              />
            </Row>
            <Row>
              <MenuItem
                titleText={"Money Owing"}
                subTitleText={"Finance Check"}
                uriImage={require("../assets/images/splash/mon.png")}
                onPressItem={() => {
                  navigateTo("Money");
                }}
              />

              <MenuItem
                titleText={"NZTA"}
                subTitleText={"Online Services"}
                uriImage={require("../assets/images/splash/nzta.png")}
                onPressItem={() => {
                  navigateTo("NZTAScreen");
                }}
              />
            </Row>
            <Row>
              <MenuItem
                titleText={"Watchlist"}
                subTitleText={watchNumber}
                uriImage={require("../assets/images/splash/watchlist.png")}
                onPressItem={() => {
                  navigateTo("WatchList");
                }}
              />
              <Col></Col>
            </Row>
          </Grid>
        );
      case "profile":
        return (
          <Grid style={{ marginTop: RFValue(30) }}>
            <Row style={{ height: 200 }}>
              <MenuItem
                titleText={"My Listings"}
                subTitleText={"0 vehicles listed"}
                uriImage={require("../assets/images/splash/mylisting.png")}
                onPressItem={() => {
                  navigateTo("MyListing");
                }}
              />
              <MenuItem
                titleText={"Watchlist"}
                subTitleText={watchNumber}
                uriImage={require("../assets/images/splash/watchlist.png")}
                onPressItem={() => {
                  navigateTo("WatchList");
                }}
              />
            </Row>
            <Row style={{ height: 250 }}>
              <MenuItem
                titleText={"My Documents"}
                subTitleText={pdfNumber}
                uriImage={require("../assets/images/splash/pdfIcon.png")}
                onPressItem={() => {
                  navigateTo("MyDocuments");
                }}
              />
              <MenuItem
                titleText={"Logout"}
                subTitleText={""}
                uriImage={require("../assets/images/splash/logout.png")}
                onPressItem={() => {
                  logout();
                }}
              />
            </Row>
          </Grid>
        );

      case "checks":
        return (
          <Grid style={{ marginTop: RFValue(30) }}>
            <Row style={{ height: 200 }}>
              <MenuItem
                titleText={"Stolen Vehicle"}
                subTitleText={"Police Check"}
                uriImage={require("../assets/images/splash/stol.png")}
                onPressItem={() => {
                  navigateTo("Police");
                }}
              />

              <MenuItem
                titleText={"Comprehensive Vehicle Report"}
                subTitleText={""}
                uriImage={require("../assets/images/splash/vehiclereport.png")}
                onPressItem={() => {
                  navigateTo("News");
                }}
              />
            </Row>

            <Row style={{ height: 200 }}>
              <MenuItem
                titleText={"Verify Ownership"}
                subTitleText={"Vehicle owner check"}
                uriImage={require("../assets/images/splash/owner.png")}
                onPressItem={() => {
                  navigateTo("Owner");
                }}
              />

              <MenuItem
                titleText={"Money Owing"}
                subTitleText={"Finance Check"}
                uriImage={require("../assets/images/splash/mon.png")}
                onPressItem={() => {
                  navigateTo("Money");
                }}
              />
            </Row>
          </Grid>
        );

      case "tools":
        return (
          <Grid style={{ marginTop: RFValue(30) }}>
            <Row style={{ height: 200 }}>
              <MenuItem
                titleText={"Traffic Camera"}
                subTitleText={"Over 100 key locations"}
                uriImage={require("../assets/images/splash/trafic.png")}
                onPressItem={() => {
                  navigateTo("TrafficCamera2");
                }}
              />

              <MenuItem
                titleText={"Charging Stations"}
                subTitleText={"Locator"}
                uriImage={require("../assets/images/splash/ev.png")}
                onPressItem={() => {
                  navigateTo("EvCharger");
                }}
              />
            </Row>

            <Row style={{ height: 170 }}>
              <MenuItem
                titleText={"Sales Agreement"}
                subTitleText={"Document generator"}
                uriImage={require("../assets/images/splash/sales.png")}
                onPressItem={() => {
                  navigateTo("SalesAgreement2");
                }}
              />

              <MenuItem
                titleText={"NZTA"}
                subTitleText={"Online Services"}
                uriImage={require("../assets/images/splash/nzta.png")}
                onPressItem={() => {
                  navigateTo("NZTAScreen");
                }}
              />
            </Row>
          </Grid>
        );

      case "nzqa":
        break;
    }
  };

  const renderImage = () => {
    if (picProfile != "") {
      return (
        <View
          style={{ width: "100%", height: 280 }}
          source={require("../assets/images/gradiantbg.png")}
        >
          <Grid
            style={{ paddingHorizontal: 20, paddingTop: 38, marginTop: 30 }}
          >
            <Row style={{ height: 90 }}>
              <Col size={4}>
                <Text style={MaStyles.textHeaderScreenMBalck}>
                  Find Your Next Ride
                </Text>
                <Text style={MaStyles.textHeaderScreenMBalck}>
                  With <Text style={MaStyles.textHeaderScreenM}>AutoApe</Text>
                </Text>
              </Col>
              <Col>
                <Image
                  source={{ uri: picProfile }}
                  resizeMode="cover"
                  style={{
                    width: 50,
                    height: 50,

                    borderRadius: 190,
                    borderColor: "white",
                    borderWidth: 1,
                    alignSelf: "flex-end",
                  }}
                />
              </Col>
            </Row>
          </Grid>
        </View>
      );
    } else {
    }
  };

  const [regionId, setRegionId] = useState("0");
  const [listRegion, setRegionList] = useState([]);
  const [listBanner, setListBanner] = useState([]);
  const [locationLabel, setLocationLabel] = useState("All New Zealand");

  const createStaticModalOptions = () => {
    const options = [];
    for (let i = 1; i < listRegion.length; i++) {
      ////console.log(listRegion[i]);
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
      ////console.log(listRegion[i]);
      options.push({
        label: listRegion[i].region_name,
        value: listRegion[i].region_id + "|" + listRegion[i].region_name,
      });
    }
    ////console.log(customFilterKey);
    if (!!customFilterKey) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions = createStaticModalOptions();

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

  const regionSelected = async (idRegion: string, nameRegion: string) => {
    ////console.log(nameRegion)
    //setModalVisible(false);
    await AsyncStorage.setItem("region_default", nameRegion);
    await AsyncStorage.setItem("region_default_id", idRegion);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const menuStyle = (menu) => {
    if (optionSelected === menu) {
      return MaStyles.categoryTextSelectedM;
    } else {
      return MaStyles.categoryTextM;
    }
  };

  const selectOption = (option) => {
    cRef.snapToItem(option);
    setOptionSelected(option);

    if (option == 0) {
      setScrollEnable(true);
      setScrollEnable(true);
      setMaxHeigth(1280);
    } else {
      setScrollEnable(true);
      setScrollEnable2(false);
      setMaxHeigth(630);
    }
  };

  return (
    <Animated.View style={{ backgroundColor: "white" }}>
      <Animated.View
        style={{
          width: "100%",
          borderBottomStartRadius: 50,
          height: headerHeight,
        }}
      >
        {renderImage()}
      </Animated.View>

      <View
        style={{
          height: 90,
          paddingHorizontal: 15,
          borderBottomRightRadius: 100,
          backgroundColor: "white",
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={{ flex: 1, paddingHorizontal: 0, height: 80 }}
        >
          <View
            style={{
              width: "100%",
              height: 50,
              alignItems: "flex-start",
              backgroundColor: "#eeeeee",
              borderRadius: 20,
              paddingStart: 20,
            }}
          >
            <Text style={[MaStyles.buttonTextM2]}>
              <FontAwesome5 name="search" size={17} color="#808080bf" /> Search
              Vehicles
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        scrollEventThrottle={4}
        scrollEnabled={isScrollCarousel}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ])}
        style={{ width: "100%", backgroundColor: "white" }}
      >
        <Carousel
          data={listBanner}
          renderItem={renderItemBanner}
          sliderWidth={width}
          itemWidth={width - 55}
          contentContainerCustomStyle={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: -20,
          }}
        />

        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <Grid style={{ marginTop: -10 }}>
            <Row>
              <Col
                onPress={() => {
                  selectOption(0);
                }}
              >
                <Text style={menuStyle(0)}>All</Text>
              </Col>
              <Col
                onPress={() => {
                  selectOption(1);
                }}
              >
                <Text style={menuStyle(1)}>Profile</Text>
              </Col>
              <Col
                onPress={() => {
                  selectOption(2);
                }}
              >
                <Text style={menuStyle(2)}>Checks</Text>
              </Col>
              <Col
                onPress={() => {
                  selectOption(3);
                }}
              >
                <Text style={menuStyle(3)}>Tools</Text>
              </Col>
            </Row>
          </Grid>
        </ScrollView>

        <Grid>
          <Carousel
            activeSlideOffset={0}
            ref={carouselRef}
            layout={"default"}
            data={exampleItems}
            renderItem={renderItem}
            containerCustomStyle={{ marginTop: -20, height: maxHeight }}
            sliderWidth={width}
            itemWidth={width - 20}
            onSnapToItem={(index: number) => {
              selectOption(index);
            }}
            // scrollInterpolator={scrollInterpolators.scrollInterpolator2}
            //slideInterpolatedStyle={animatedStyles.animatedStyles2}
          />
        </Grid>

        {/* 650 */}

        <View style={{ height: 160 }}></View>
      </ScrollView>

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
    </Animated.View>
  );
}
