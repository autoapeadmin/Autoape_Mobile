import {
    AntDesign,
    MaterialIcons,
    FontAwesome5,
    FontAwesome,
    Feather,
  } from "@expo/vector-icons";
  import { StackScreenProps } from "@react-navigation/stack";
  import * as React from "react";
  import {
    Animated,
    AsyncStorage,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
  
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  
  export default function SearchResultScreen({
    navigation,
    route,
  }: StackScreenProps<RootStackParamList, "NotFound">) {
    const scrollY = React.useRef(new Animated.Value(0)).current;
  
    const [listCar, setListCar] = useState([]);
    const [page, setPage] = useState(2);
  
    const [fromRealSale, setFromRealSale] = useState("0");
  
    const [customerID, setCustomerId] = useState(0);
    const [logged, setLogged] = useState("false");
  
    const [listView, setListView] = useState(false);
  
    const [refresh, setRefresh] = useState(true);
  
    const [scrollEnabled, setScrollEnabled] = useState(true);
  
    const [isModalVisible, setModalVisible] = useState(false);
  
    const [isModalVisibleCondition, setModalVisibleCondition] = useState(false);
    const [fuelType, setFuelType] = useState(7);
  
    const [urlCall, setUrlCall] = useState("");
    const [checked, idChecked] = useState("0");
  
    const [dw4, setDw4] = useState(false);
  
    const [numberResult, setNumberResult] = useState(0);
  
    const [isModalVisibleFilter, setModalVisibleFilter] = useState(false);
  
    const [count, setCount] = useState(0);
  
    const [flag, setFlag] = useState("0");
  
    const [fromRealYear, setFromRealYear] = useState("0");
    const [toRealYear, setToRealYear] = useState("2021");
    const [fromYear, setFromYear] = useState("Any");
    const [toYear, setToYear] = useState("2021");
  
    const [b00, set00] = useState(true);
    const [b01, set01] = useState(false);
    const [b02, set02] = useState(false);
    const [b03, set03] = useState(false);
    const [b04, set04] = useState(false);
    const [b05, set05] = useState(false);
    const [b06, set06] = useState(false);
    const [b07, set07] = useState(false);
    const [b08, set08] = useState(false);
    const [toRealSale, setToRealSale] = useState("100000");
  
    const [fromRealOdo, setFromRealOdo] = useState("0");
    const [toRealOdo, setToRealOdo] = useState("300000");
    const [fromOdo, setFromOdo] = useState("Any");
    const [toOdo, setToOdo] = useState("Any");
  
    const [makeID, setMakeId] = useState("0");
    const [modelID, setModelId] = useState("0");
    const [regionID, setRegionId] = useState("0");
  
    const salePrices = [
      "0",
      "Any",
      "$1,000",
      "$1,500",
      "$2,000",
      "$2,500",
      "$3,000",
      "$3,500",
      "$4,000",
      "$4,500",
      "$5,000",
      "$5,500",
      "$6,000",
      "$6,500",
      "$7,000",
      "$7,500",
      "$8,000",
      "$8,500",
      "$9,000",
      "$9,500",
      "$10,000",
      "$11,000",
      "$12,000",
      "$13,000",
      "$14,000",
      "$15,000",
      "$20,000",
      "$30,000",
      "$40,000",
      "$50,000",
      "$60,000",
      "$70,000",
      "$100,000+",
    ]; //27
  
    const realSale = [
      "0",
      "0",
      "1000",
      "1500",
      "2000",
      "2500",
      "3000",
      "3500",
      "4000",
      "4500",
      "5000",
      "5500",
      "6000",
      "6500",
      "7000",
      "7500",
      "8000",
      "8500",
      "9000",
      "9500",
      "10000",
      "11000",
      "12000",
      "13000",
      "14000",
      "15000",
      "20000",
      "30000",
      "40000",
      "50000",
      "60000",
      "70000",
      "100000",
    ];
  
    const years = [
      "0",
      "Any",
      "1900",
      "1910",
      "1920",
      "1930",
      "1940",
      "1950",
      "1960",
      "1970",
      "1980",
      "1990",
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
    ];
  
    const realYears = [
      "0",
      "0",
      "1900",
      "1910",
      "1920",
      "1930",
      "1940",
      "1950",
      "1960",
      "1970",
      "1980",
      "1990",
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
    ];
  
    const odometer = [
      "0",
      "Any",
      "100 km",
      "1,000 km",
      "5,000 km",
      "10,000 km",
      "20,000 km",
      "30,000 km",
      "40,000 km",
      "50,000 km",
      "60,000 km",
      "70,000 km",
      "80,000 km",
      "90,000 km",
      "100,000 km",
      "120,000 km",
      "140,000 km",
      "160,000 km",
      "180,000 km",
      "200,000 km",
      "250,000 km",
      "300,000 km+",
    ];
  
    const realOdo = [
      "0",
      "0",
      "100",
      "1000",
      "5000",
      "10000",
      "20000",
      "30000",
      "40000",
      "50000",
      "60000",
      "70000",
      "80000",
      "90000",
      "100000",
      "120000",
      "140000",
      "160000",
      "180000",
      "200000",
      "250000",
      "300000",
    ];
  
    const [fromValue, setFromValue] = useState("Any");
    const [toValue, setToValue] = useState("$100,000+");
  
    useEffect(() => {
      setupPage();
    }, []);
  
    const setupPage = async () => {
      setListCar(route.params.resultSearch);
      setUrlCall(route.params.urlRequest);
      setCount(route.params.totalResult);
      setFlag(route.params.flagVe);
      setMakeId(route.params.makeId);
      setModelId(route.params.modelId);
      setRegionId(route.params.location);
  
      // console.log(route.params.resultSearch);
      //setShowingListing( setShowingListing(paginate(listCar,10,1)););
      const id = await AsyncStorage.getItem("customer_id");
      const logged = await AsyncStorage.getItem("logged");
      setLogged(logged);
      setCustomerId(id);
      //console.log(urlCall);
    };
  
    //Odometer
    //Years
    const sliderOdo = (values) => {
      console.log(values);
      setOdoFrom(values[0]);
      setOdoTo(values[1]);
    };
  
    const setOdoFrom = (value: any) => {
      setFromOdo(odometer[value]);
      setFromRealOdo(realOdo[value]);
    };
  
    const setOdoTo = (value: any) => {
      setToOdo(odometer[value]);
      setToRealOdo(realOdo[value]);
    };
  
    const sliderOneYearChange = (values) => {
      console.log(values);
      setYearFrom(values[0]);
      setYearTo(values[1]);
    };
  
    const setYearFrom = (value: any) => {
      setFromYear(years[value]);
      setFromRealYear(realYears[value]);
    };
  
    const setYearTo = (value: any) => {
      setToYear(years[value]);
      setToRealYear(realYears[value]);
    };
  
    const format = (amount) => {
      return Number(amount)
        .toFixed(1)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        .slice(0, -2);
    };
  
    const formatKm = (amount) => {
      return Number(amount)
        .toFixed(1)
        .replace(/\d(?=(\d{3})+\.)/g, "")
        .slice(0, -2);
    };
  
    const sliderOneValuesChange = (values) => {
      console.log(values);
      setFromSalePrice(values[0]);
      setToSalePrice(values[1]);
    };
  
    const setFromSalePrice = (value: any) => {
      setFromValue(salePrices[value]);
      setFromRealSale(realSale[value]);
    };
  
    const setToSalePrice = (value: any) => {
      setToValue(salePrices[value]);
      setToRealSale(realSale[value]);
    };
  
    const lockSlider = () => {
      if (!dw4) {
        return "#0e4e92";
      } else {
        return "gray";
      }
    };
  
    const returnMarker = () => {
      if (dw4) {
        return CustomMarkerNo;
      } else {
        return CustomMarker;
      }
    };
  
    const searchCar = () => {
      let carFlag = flag;
  
      let caror = 0;
      if (carFlag) {
        caror = 0;
      } else {
        caror = 1;
      }
  
      let urlBodyType = "";
  
      if (b00) urlBodyType += "13a";
      if (b01) urlBodyType += "3a";
      if (b02) urlBodyType += "5a";
      if (b03) urlBodyType += "4a";
      if (b04) urlBodyType += "2a";
      if (b05) urlBodyType += "1a";
      if (b06) urlBodyType += "0a";
      if (b07) urlBodyType += "6a";
      if (b08) urlBodyType += "7";
  
      let urlSaved =
        Globals.BASE_URL +
        "Maxauto/findVehicle/" +
        flag +
        "/" +
        regionID +
        "/" +
        fromRealSale +
        "/" +
        toRealSale +
        "/" +
        urlBodyType +
        "/" +
        makeID +
        "/" +
        modelID +
        "/" +
        fromRealOdo +
        "/" +
        toRealOdo +
        "/" +
        +fromRealYear +
        "/" +
        +toRealYear +
        "/";
  
      fetch(
        Globals.BASE_URL +
          "Maxauto/findVehicle/" +
          flag +
          "/" +
          regionID +
          "/" +
          fromRealSale +
          "/" +
          toRealSale +
          "/" +
          urlBodyType +
          "/" +
          makeID +
          "/" +
          modelID +
          "/" +
          fromRealOdo +
          "/" +
          toRealOdo +
          "/" +
          +fromRealYear +
          "/" +
          +toRealYear +
          "/1/0"
      )
        .then((response) => response.json())
        .then((data) => {
          setListCar(data.data.vehicules);
          setUrlCall(urlSaved);
          setCount(data.data.count[0].total);
          setModalVisibleFilter(false);
        });
    };
  
    const loadMore = () => {
      let ind = page + 1;
      console.log("**************************************** Page :" + ind);
      //console.log(ind);
      //console.log(paginate(showingList, 10, ind));
      // let array = paginate(showingList, 10, ind);
      // setListCar(listCar.concat(array));
      setPage(ind);
  
      // setPage(page + 1)
  
      let datas = urlCall + page + "/" + checked;
      //console.log(datas);
  
      fetch(datas)
        .then((response) => response.json())
        .then((data) => {
          let array = data.data.vehicules;
          array.forEach((element) => {
            // console.log(element.vehicule_price);
            listCar.push(element);
          });
        });
    };
  
    const changeFilter = (id) => {
      setListCar([]);
      setPage(2);
      idChecked(id);
      //console.log(urlCall + page + id);
  
      fetch(urlCall + "1/" + id)
        .then((response) => response.json())
        .then((data) => {
          setListCar(data.data.vehicules);
          setShowingListing(data.data);
          setRefresh(!refresh);
        });
    };
  
    const getDetails = (id: string) => {
      navigation.navigate("CarDetails", { carId: id });
    };
  
    const showList = () => {
      return VehicleListGrid;
    };
  
    const styleBox = (id: string) => {
      if (checked == id) {
        return MaStyles.iconBackSelectedsort;
      } else {
        return MaStyles.iconBacksort;
      }
    };
  
    const selectFilter = (id: string) => {
      idChecked(id);
      changeFilter(id);
    };
  
    function numberWithCommas(x: string) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
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
  
      //setListCar(listCar);
      //maxAuto.addWashList(customerID, id)
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
  
    const fuelTypeButton = (idFuel: number) => {
      if (idFuel == fuelType) {
        return MaStyles.buttonLigthView;
      } else {
        return MaStyles.buttonLigthViewNo;
      }
    };
  
    const fuelTypeLayer = (idFuel: number) => {
      if (idFuel == fuelType) {
        return MaStyles.buttonTextLight;
      } else {
        return MaStyles.buttonTextLightNo;
      }
    };
  
  
    const [allFlag, setAllFlag] = useState(true);
    const [newFlag, setNewFlag] = useState(false);
    const [useFlag, setUseFlag] = useState(false);
  
    const selectAll = () => {
      setAllFlag(true);
      setNewFlag(false);
      setUseFlag(false);
    };
  
    //style evaluation
    const selectNew = () => {
      setAllFlag(false);
      setNewFlag(true);
      setUseFlag(false);
    };
  
    //style evaluation
    const selectUsed = () => {
      setAllFlag(false);
      setNewFlag(false);
      setUseFlag(true);
    };
  
  
    const newButton = () => {
      if (newFlag) {
        return MaStyles.buttonLigthView;
      } else {
        return MaStyles.buttonLigthViewNo;
      }
    };
  
      //select all
      const allButton = () => {
        if (allFlag) {
          return MaStyles.buttonLigthView;
        } else {
          return MaStyles.buttonLigthViewNo;
        }
      };
    
  
    const usedButton = () => {
      if (useFlag) {
        return MaStyles.buttonLigthView;
      } else {
        return MaStyles.buttonLigthViewNo;
      }
    };
  
    const allLa = () => {
      if (allFlag) {
        return MaStyles.buttonTextLight;
      } else {
        return MaStyles.buttonTextLightNo;
      }
    };
  
    const newLa = () => {
      if (newFlag) {
        return MaStyles.buttonTextLight;
      } else {
        return MaStyles.buttonTextLightNo;
      }
    };
  
    const useLa = () => {
      if (useFlag) {
        return MaStyles.buttonTextLight;
      } else {
        return MaStyles.buttonTextLightNo;
      }
    };
  
  
    return (
      <View style={[MaStyles.container, { marginHorizontal: 0 }]}>
        <Grid>
          <Row style={{ height: 40, width: "100%" }}>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 5 }}
                name="left"
                size={24}
                color="#0e4e92"
              />
            </Col>
            <Col size={8}>
              <Text style={MaStyles.textHeader}>Search Result</Text>
            </Col>
            <Col
              size={2}
              onPress={() => setModalVisible(true)}
              style={{ marginEnd: -20, alignContent: "flex-end" }}
            >
              <MaterialIcons
                style={{ marginTop: 6 }}
                name="sort"
                size={28}
                color="#0e4e92"
              />
            </Col>
            <Col size={2} style={{ marginEnd: -20, alignContent: "flex-end" }}>
              {listView && (
                <MaterialIcons
                  onPress={() => setListView(false)}
                  style={{ marginTop: 2 }}
                  name="view-list"
                  size={35}
                  color="#0e4e92"
                />
              )}
              {!listView && (
                <Feather
                  onPress={() => setListView(true)}
                  style={{
                    transform: [
                      {
                        translateY: 8,
                      },
                    ],
                  }}
                  name="grid"
                  size={24}
                  color="#0e4e92"
                />
              )}
            </Col>
          </Row>
  
          <Row style={{ height: 30, marginTop: 0, borderBottomColor: "gray" }}>
            <Col>
              <Row style={{ marginTop: -20 }}>
                <View
                  style={{ height: 80, flexDirection: "row", marginEnd: -15 }}
                >
                  <TouchableOpacity
                    onPress={() => setModalVisibleFilter(true)}
                    style={MaStyles.buttonViewN}
                  >
                    <FontAwesome5
                      style={MaStyles.iconN}
                      name="filter"
                      size={16}
                    />
                    <Text style={MaStyles.buttonTextNear}> Refine</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    onPress={() => setModalVisibleCondition(true)}
                    style={MaStyles.buttonViewWhiteN}
                  >
                    <FontAwesome5
                      style={MaStyles.iconNW}
                      name="car-alt"
                      size={16}
                    />
                    <Text style={MaStyles.buttonTextWhiteN}> Condition</Text>
                  </TouchableOpacity>
                </View>
              </Row>
            </Col>
            <Col>
              <Text
                style={[MaStyles.subText, { textAlign: "right", marginTop: 8 }]}
              >
                {count} listings.
              </Text>
            </Col>
          </Row>
  
          <Row style={{ marginTop: 18 }} size={15}>
            {listView && (
              <FlatList
                style={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                data={listCar}
                numColumns={2}
                onEndReached={loadMore}
                extraData={refresh}
                //keyExtractor={item => item.vehicule_id}
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      width: width / 2 - 25,
                      margin: 5,
                      borderRadius: 5,
                      marginBottom: 15,
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
                          <FontAwesome
                            name="bookmark"
                            size={20}
                            color="white"
                            style={{ textAlign: "center", marginTop: 5 }}
                          />
                        </TouchableOpacity>
                      )}
  
                      <CachedImage
                        source={{ uri: Globals.S3_THUMB_URL + item.pic_url }}
                        resizeMode="cover"
                        style={{
                          width: "100%",
                          height: 100,
                          marginTop: 0,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                        }}
                      />
                      <View style={{ margin: 8, marginBottom: 15 }}>
                        <Text style={MaStyles.TextCard}>
                          {item.vehicule_id} % {item.vehicule_year}{" "}
                          {item.make_description} {item.model_desc}
                        </Text>
                        <Text style={MaStyles.subTextCard}>
                          ${format(item.vehicule_price)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )}
              />
            )}
            {!listView && (
              <Animated.FlatList
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                style={{ marginBottom: 30 }}
                showsVerticalScrollIndicator={false}
                data={listCar}
                onEndReached={loadMore}
                extraData={refresh}
                numColumns={1}
                keyExtractor={(item) => item.vehicule_id}
                renderItem={({ item, index }) => {
                  const inputRange = [-1, 0, 275 * index, 275 * (index + 2)];
  
                  const opacityInputRange = [
                    -1,
                    0,
                    275 * index,
                    275 * (index + 1),
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
                        width: width - 40,
                        margin: 8,
                        borderRadius: 5,
                        transform: [{ scale }],
                        opacity,
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
                              size={20}
                              color="#ffbf00"
                              style={{ textAlign: "center", marginTop: 5 }}
                            />
                          </TouchableOpacity>
                        )}
  
                        <CachedImage
                          source={{ uri: Globals.S3_THUMB_URL + item.pic_url }}
                          resizeMode="cover"
                          style={{
                            width: "100%",
                            height: 175,
                            marginTop: 0,
                            borderRadius: 8,
                          }}
                        />
  
                        <View
                          style={{
                            margin: 8,
                            marginBottom: 15,
                            height: 60,
                            paddingTop: 5,
                          }}
                        >
                          <Grid>
                            <Col>
                              <Text style={MaStyles.TextCardListView}>
                                {item.make_description} {item.model_desc}{" "}
                                {item.vehicule_year}
                              </Text>
                            </Col>
                            <Col>
                              <Text style={MaStyles.SubTextCardListView}>
                                ${format(item.vehicule_price)}
                              </Text>
                            </Col>
                          </Grid>
                          <Grid style={{ marginTop: -4 }}>
                            <Col size={10}>
                              <Feather
                                name="map-pin"
                                size={11}
                                color={"gray"}
                                style={{ position: "absolute", marginTop: 3 }}
                              />
                              <Text style={MaStyles.subTextMakeList}>
                                {item.region_name} /{" "}
                                {numberWithCommas(item.vehicule_odometer)} km /
                                Listed {findDaysDiffrent(item.indate)}
                              </Text>
                            </Col>
                            <Col>
                              {item.rec_img_base64 != "" && (
                                <CachedImage
                                  style={{
                                    width: width / 5 - 20,
                                    height: 20,
                                    marginEnd: -6,
                                    zIndex: 20000,
                                    marginTop: -2,
                                    borderRadius: 5,
                                    alignSelf: "flex-end",
                                  }}
                                  source={{
                                    uri:
                                      Globals.DEALERSHIP_LOGO +
                                      item.rec_img_base64,
                                  }}
                                  resizeMode="stretch"
                                />
                              )}
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
  
        <Modal
          deviceHeight={height}
          animationIn={"slideInUp"}
          isVisible={isModalVisibleFilter}
          style={[
            MaStyles.container,
            {
              marginHorizontal: 0,
              marginVertical: 0,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              flexDirection: "column",
              justifyContent: "space-between",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Grid style={{ width: "99%" }}>
              <Row style={{ height: 30, marginTop: 20 }}>
                <Grid>
                  <Col onPress={() => setModalVisibleFilter(false)} size={10}>
                    <Text style={MaStyles.textHeader}>Refine result</Text>
                  </Col>
                  <Col onPress={() => setModalVisibleFilter(false)}>
                    <AntDesign
                      style={{ marginTop: 5 }}
                      name="close"
                      size={22}
                      color="#0e4e92"
                    />
                  </Col>
                </Grid>
              </Row>
              <Row style={{ height: 40 }}>
                {flag == "0" && (
                  <Text style={[MaStyles.textSubHeader, { marginTop: 15 }]}>
                    Body Type
                  </Text>
                )}
              </Row>
              <Row style={{ height: 110 }}>
                {flag == "0" && (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={{ marginTop: 15, marginEnd: -15 }}
                  >
                    {b00 && (
                      <TouchableOpacity
                        style={{ width: 120, marginTop: 23 }}
                        onPress={() => set00(!b00)}
                      >
                        <MaterialIcons
                          name="check-box"
                          size={30}
                          color="#0e4e92"
                          style={{ alignSelf: "center", paddingBottom: 0 }}
                        />
                        <Text style={MaStyles.lottieSub}>Select all</Text>
                      </TouchableOpacity>
                    )}
                    {!b00 && (
                      <TouchableOpacity
                        style={{ width: 120, marginTop: 23 }}
                        onPress={() => set00(!b00)}
                      >
                        <MaterialIcons
                          name="check-box-outline-blank"
                          size={30}
                          color="#0e4e92"
                          style={{ alignSelf: "center", paddingBottom: 0 }}
                        />
                        <Text style={MaStyles.lottieSub}>Select all</Text>
                      </TouchableOpacity>
                    )}
  
                    {b01 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set01(!b01)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/01s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {!b01 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set01(!b01);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/01.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {b02 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set02(!b02)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/02s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {!b02 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set02(!b02);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/02.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {b03 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set03(!b03)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/03s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b03 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set03(!b03);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/03.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {b04 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set04(!b04)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/04s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b04 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set04(!b04);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/04.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {b05 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set05(!b05)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/05s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b05 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set05(!b05);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/05.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
  
                    {b06 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set06(!b06)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/06s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b06 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set06(!b06);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/06.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {b07 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set07(!b07)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/07s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b07 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set07(!b07);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/07.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {b08 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => set08(!b08)}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/08s.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {!b08 && (
                      <TouchableOpacity
                        style={{ width: 120 }}
                        onPress={() => {
                          set08(!b08);
                          set00(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/images/bodyImg/08.png")}
                          style={{
                            width: "95%",
                            height: 80,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                )}
              </Row>
              <Row style={{ height: 50 }}>
                <Col>
                  <Text style={[MaStyles.textSubHeader, { marginTop: 15 }]}>
                    Price
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={[
                      MaStyles.subTextMake,
                      {
                        marginTop: 17,
                        textAlign: "right",
                        marginEnd: 10,
                        color: "#0e4e92",
                      },
                    ]}
                  >
                    {fromValue} - {toValue}
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col style={{ marginStart: 10 }}>
                  <MultiSlider
                    containerStyle={{ width: 500, marginStart: 4 }}
                    min={1}
                    max={33}
                    step={1}
                    values={[1, 33]}
                    enabledOne={true}
                    enabledTwo={true}
                    sliderLength={width - 60}
                    onValuesChange={sliderOneValuesChange}
                    onValuesChangeStart={() => setScrollEnabled(false)}
                    onValuesChangeFinish={() => setScrollEnabled(true)}
                    selectedStyle={{
                      backgroundColor: "#0e4e92",
                    }}
                    trackStyle={{
                      height: 3,
                      marginTop: 2,
                    }}
                    customMarker={CustomMarker}
                    touchDimensions={{
                      height: 180,
                      width: 180,
                      borderRadius: 20,
                      slipDisplacement: 40,
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col>
                  <Text style={[MaStyles.textSubHeader, { marginTop: 25 }]}>
                    Year
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={[
                      MaStyles.subTextMake,
                      {
                        marginTop: 30,
                        textAlign: "right",
                        marginEnd: 10,
                        color: "#0e4e92",
                      },
                    ]}
                  >
                    {fromYear} - {toYear}
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col style={{ marginStart: 10 }}>
                  <MultiSlider
                    containerStyle={{ width: 500, marginStart: 4 }}
                    min={1}
                    max={33}
                    step={1}
                    values={[1, 33]}
                    enabledOne={!dw4}
                    enabledTwo={!dw4}
                    sliderLength={width - 60}
                    onValuesChange={sliderOneYearChange}
                    onValuesChangeStart={() => setScrollEnabled(false)}
                    onValuesChangeFinish={() => setScrollEnabled(true)}
                    selectedStyle={{
                      backgroundColor: lockSlider(),
                    }}
                    trackStyle={{
                      height: 3,
                      marginTop: 2,
                    }}
                    customMarker={returnMarker()}
                    touchDimensions={{
                      height: 180,
                      width: 180,
                      borderRadius: 20,
                      slipDisplacement: 40,
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col>
                  <Text style={[MaStyles.textSubHeader, { marginTop: 25 }]}>
                    Odometer
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={[
                      MaStyles.subTextMake,
                      {
                        marginTop: 17,
                        textAlign: "right",
                        marginEnd: 10,
                        color: "#0e4e92",
                      },
                    ]}
                  >
                    {fromOdo} - {toOdo}
                  </Text>
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Col style={{ marginStart: 10 }}>
                  <MultiSlider
                    containerStyle={{ width: 500, marginStart: 4 }}
                    min={1}
                    max={21}
                    step={1}
                    values={[1, 21]}
                    enabledOne={!dw4}
                    enabledTwo={!dw4}
                    sliderLength={width - 60}
                    onValuesChange={sliderOdo}
                    onValuesChangeStart={() => setScrollEnabled(false)}
                    onValuesChangeFinish={() => setScrollEnabled(true)}
                    selectedStyle={{
                      backgroundColor: lockSlider(),
                    }}
                    trackStyle={{
                      height: 3,
                      marginTop: 2,
                    }}
                    customMarker={returnMarker()}
                    touchDimensions={{
                      height: 180,
                      width: 180,
                      borderRadius: 20,
                      slipDisplacement: 40,
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ height: 50 }}>
                <Text style={[MaStyles.textSubHeader, { marginTop: 15 }]}>
                  Fuel Type
                </Text>
              </Row>
              <Row style={{ height: 60 }}>
                <Col onPress={() => setFuelType(7)}>
                  <View style={fuelTypeButton(7)}>
                    <Text style={fuelTypeLayer(7)}>All</Text>
                  </View>
                </Col>
  
                <Col onPress={() => setFuelType(1)}>
                  <View style={fuelTypeButton(1)}>
                    <Text style={fuelTypeLayer(1)}>Diesel</Text>
                  </View>
                </Col>
  
                <Col onPress={() => setFuelType(0)}>
                  <View style={fuelTypeButton(0)}>
                    <Text style={fuelTypeLayer(0)}>Petrol</Text>
                  </View>
                </Col>
              </Row>
              <Row style={{ height: 60 }}>
                <Col onPress={() => setFuelType(2)}>
                  <View style={fuelTypeButton(2)}>
                    <Text style={fuelTypeLayer(2)}>Hybrid</Text>
                  </View>
                </Col>
  
                <Col onPress={() => setFuelType(3)}>
                  <View style={fuelTypeButton(3)}>
                    <Text style={fuelTypeLayer(3)}>Plug-in hybrid</Text>
                  </View>
                </Col>
  
                <Col onPress={() => setFuelType(4)}>
                  <View style={fuelTypeButton(4)}>
                    <Text style={fuelTypeLayer(4)}>Electric</Text>
                  </View>
                </Col>
              </Row>
              <Row style={{ height: 70 }}>
                <Col onPress={() => setFuelType(5)}>
                  <View style={fuelTypeButton(5)}>
                    <Text style={fuelTypeLayer(5)}>LPG</Text>
                  </View>
                </Col>
  
                <Col onPress={() => setFuelType(6)}>
                  <View style={fuelTypeButton(6)}>
                    <Text style={fuelTypeLayer(6)}>Alternative</Text>
                  </View>
                </Col>
  
                <Col size={1}>
                  <View></View>
                </Col>
              </Row>
              <Row
                // onPress={() => searchCar()}
                style={{ height: 120, width: "99%" }}
              >
                <TouchableOpacity
                  // onPress={() => searchCar()}
                  style={MaStyles.buttonViewC}
                >
                  <Text  style={MaStyles.buttonTextC}>
                    Search
                  </Text>
                </TouchableOpacity>
              </Row>
            </Grid>
          </ScrollView>
        </Modal>
  
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
            <Row style={{ height: 40, marginTop: 20 }}>
              <Grid>
                <Col
                  style={{ marginStart: 4 }}
                  onPress={() => setModalVisible(false)}
                  size={10}
                >
                  <Text style={MaStyles.textHeader}>Filters</Text>
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
  
            <Row style={{ marginTop: 80, position: "absolute" }}>
              <Col onPress={() => selectFilter("0")} style={{ marginBottom: 15 }}>
                <View style={styleBox("0")}>
                  <AntDesign
                    style={{ padding: 20 }}
                    name="calendar"
                    size={35}
                    color="black"
                  />
                </View>
                <Text style={MaStyles.subTextMake}>Latest listings </Text>
              </Col>
              <Col onPress={() => selectFilter("1")} style={{ marginBottom: 15 }}>
                <View style={styleBox("1")}>
                  <FontAwesome
                    style={{ padding: 20 }}
                    name="dollar"
                    size={35}
                    color="black"
                  />
                </View>
                <Text style={MaStyles.subTextMake}>Lowest price</Text>
              </Col>
              <Col onPress={() => selectFilter("2")} style={{ marginBottom: 15 }}>
                <View style={styleBox("2")}>
                  <FontAwesome
                    style={{ padding: 20 }}
                    name="sort-alpha-asc"
                    size={35}
                    color="black"
                  />
                </View>
                <Text style={MaStyles.subTextMake}>Make & model (A-Z)</Text>
              </Col>
            </Row>
          </Grid>
        </Modal>
  
        <Modal
          deviceHeight={height}
          animationIn={"slideInUp"}
          isVisible={isModalVisibleCondition}
          style={[
            MaStyles.container,
            {
              maxHeight: 150,
              marginTop: height - 150,
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
            <Row style={{ height: 40, marginTop: 20 }}>
              <Grid>
                <Col
                  style={{ marginStart: 4 }}
                  onPress={() => setModalVisibleCondition(false)}
                  size={10}
                >
                  <Text style={MaStyles.textHeader}>Condition</Text>
                </Col>
                <Col onPress={() => setModalVisibleCondition(false)}>
                  <AntDesign
                    style={{ marginTop: 5 }}
                    name="close"
                    size={22}
                    color="#0e4e92"
                  />
                </Col>
              </Grid>
            </Row>
  
            <Row style={{ marginTop:50,position:"absolute" }}>
              <Col onPress={() => selectAll()}>
                <View style={allButton()}>
                  <Text style={allLa()}>All</Text>
                </View>
              </Col>
  
              <Col onPress={() => selectNew()}>
                <View style={newButton()}>
                  <Text style={newLa()}>New</Text>
                </View>
              </Col>
  
              <Col onPress={() => selectUsed()}>
                <View style={usedButton()}>
                  <Text style={useLa()}>Used</Text>
                </View>
              </Col>
            </Row>
          </Grid>
        </Modal>
      </View>
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
  