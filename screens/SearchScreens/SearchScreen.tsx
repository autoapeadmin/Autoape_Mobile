import { AntDesign } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import { AsyncStorage, Dimensions, Platform, ScrollView } from "react-native";
import TextAnimator from "../../utils/TextAnimator";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import MaStyles from "../../assets/styles/MaStyles";
import Globals from "../../constants/Globals";
import { ModalSelectList } from "react-native-modal-select-list";
import Modal from "react-native-modal";
import { RootStackParamList } from "../../types";
import maxAuto from "../../api/maxAuto";

const height = Dimensions.get("window").height;

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const inputRef = React.useRef(null);
  const [listMake, setListMake] = useState([]);
  const [listMakeMoto, setListMakeMoto] = useState([]);
  const [renderMake, setRenderMake] = useState(true);
  const [textFilter, setTextFilter] = useState("");

  const [carFlag, setCarFlag] = useState(true);
  const [flag, setFlat] = useState(0);
  const [checked, idChecked] = useState("0");
  const [srcImg, setSrcImg] = useState("LOGO-ALL");
  const [name, setName] = useState("All Makes");

  const [makeL, setMakeL] = useState("All Makes");
  const [loading, setLoading] = useState(false);
  const [allFlag, setAllFlag] = useState(true);
  const [newFlag, setNewFlag] = useState(false);
  const [useFlag, setUseFlag] = useState(false);
  const [modelLabel, setModelLabel] = useState("All Models");

  const [modelId, setModelId] = useState("0");

  const [listRegion, setRegionList] = useState([]);

  const [regionId, setRegionId] = useState("0");

  const [locationLabel, setLocationLabel] = useState("Location");

  const [isModalVisible, setModalVisible] = useState(false);

  const [idMake, setIdMake] = useState("0");

  const [srcImage, setSrc] = useState("images/logosMake/LOGO-ALL1");

  const [listModel, setListModel] = useState([]);

  const [fromRealSale, setFromRealSale] = useState("0");
  const [toRealSale, setToRealSale] = useState("100000");
  const [fromValue, setFromValue] = useState("Any");
  const [toValue, setToValue] = useState("$100,000+");

  const [fromRealYear, setFromRealYear] = useState("0");
  const [toRealYear, setToRealYear] = useState("2021");
  const [fromYear, setFromYear] = useState("Any");
  const [toYear, setToYear] = useState("2021");

  const [fromRealOdo, setFromRealOdo] = useState("0");
  const [toRealOdo, setToRealOdo] = useState("300000");
  const [fromOdo, setFromOdo] = useState("Any");
  const [toOdo, setToOdo] = useState("Any");
  const [fuelL, setFuelL] = useState("All Types");

  let modalRef3;
  const openModal3 = () => {
    modalRef3.show();
  };

  const saveModalRef3 = (ref3) => (modalRef3 = ref3);
  const onSelectedOption3 = (value) => {
    let res = value.split("|");
    modelSelected(res[0], res[1]);
  };

  const modelSelected = (idMake: string, makeName: string) => {
    setModelLabel(makeName);
    setModelId(idMake);
  };

  const createStaticModalOptions3 = () => {
    const options = [];
    for (let i = 0; i < listModel.length; i++) {
      //console.log(listRegion[i]);
      options.push({
        label: listModel[i].model_desc,
        value: listModel[i].model_id + "|" + listModel[i].model_desc,
      });
    }
    return options;
  };

  const modalOptionsProvider3 = ({ page, pageSize, customFilterKey3 }) => {
    let options = [];
    for (let i = 0; i < listModel.length; i++) {
      //  console.log(listModel[i]);
      options.push({
        label: listModel[i].model_desc,
        value: listModel[i].model_id + "|" + listModel[i].model_desc,
      });
    }
    // console.log(customFilterKey3);
    if (!!customFilterKey3) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey3}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions3 = createStaticModalOptions3();

  useEffect(() => {
    setup();
  }, []);

  //ajhjh klk kld klf  lklkf  fhkj

  const setup = async () => {
    maxAuto.getAllMakeSearch().then((result) => setListMake(result));
    maxAuto.getAllMakeMotoSearch().then((result) => setListMakeMoto(result));
    maxAuto.allPlacesList().then((result) => setRegionList(result));
    setRegionId("0");
    setLocationLabel("All New Zealand");
  };

  const filterMakes = (search_text: String) => {
    setTextFilter(search_text);
    setRenderMake(renderMake!);
  };

  const modelL = () => {
    if (modelLabel == "All Models") {
      return MaStyles.labelPlaceholder;
    } else if (modelLabel == "All Models") {
      return MaStyles.labelPlaceholderUn;
    } else {
      return MaStyles.labelText;
    }
  };

  //select car
  const carButton = () => {
    if (carFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  //select car
  const carLayer = () => {
    if (carFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
    }
  };

  //select motorbike
  const motoButton = () => {
    if (!carFlag) {
      return MaStyles.buttonViewM;
    } else {
      return MaStyles.buttonViewWhiteM;
    }
  };

  //select car
  const motoLayer = () => {
    if (!carFlag) {
      return MaStyles.buttonTextNearM;
    } else {
      return MaStyles.buttonTextWhiteM;
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

  const newButton = () => {
    if (newFlag) {
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

  const styleBox = (id: string) => {
    if (checked == id) {
      return MaStyles.iconBackSelected;
    } else {
      return MaStyles.iconBack;
    }
  };

  const renderFlatMake = (item, index) => {
    //Alvaro
    if (textFilter == "") {
      return (
        <Col
          onPress={() =>
            checkMake(item.make_id, item.make_logo, item.make_description)
          }
          style={{ marginBottom: 15 }}
        >
          <View style={styleBox(item.make_id)}>
            <Image
              source={{
                uri:
                  Globals.BASE_URL +
                  "images/logosMake/" +
                  item.make_logo +
                  ".png",
              }}
              style={{ width: 70, height: 80 }}
            />
          </View>
          <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
        </Col>
      );
    } else {
      if (
        item.make_description.toLowerCase().includes(textFilter.toLowerCase())
      ) {
        return (
          <Col
            onPress={() =>
              checkMake(item.make_id, item.make_logo, item.make_description)
            }
            style={{ marginBottom: 15 }}
          >
            <View style={styleBox(item.make_id)}>
              <Image
                source={{
                  uri:
                    Globals.BASE_URL +
                    "images/logosMake/" +
                    item.make_logo +
                    ".png",
                }}
                style={{ width: 70, height: 80 }}
              />
            </View>
            <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
          </Col>
        );
      } else {
        return <Col style={{ position: "absolute" }}></Col>;
      }
    }
  };

  const renderFlatMakeMoto = (item, index) => {
    if (textFilter == "") {
      return (
        <Col
          onPress={() =>
            checkMake(item.make_id, item.make_logo, item.make_description)
          }
          style={{ marginBottom: 15 }}
        >
          <View style={styleBox(item.make_id)}>
            <Image
              source={{
                uri:
                  Globals.BASE_URL +
                  "images/logosMakeMoto/" +
                  item.make_logo +
                  ".png",
              }}
              style={{ width: 70, height: 80 }}
            />
          </View>
          <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
        </Col>
      );
    } else {
      if (
        item.make_description.toLowerCase().includes(textFilter.toLowerCase())
      ) {
        return (
          <Col
            onPress={() =>
              checkMake(item.make_id, item.make_logo, item.make_description)
            }
            style={{ marginBottom: 15 }}
          >
            <View style={styleBox(item.make_id)}>
              <Image
                source={{
                  uri:
                    Globals.BASE_URL +
                    "images/logosMakeMoto/" +
                    item.make_logo +
                    ".png",
                }}
                style={{ width: 70, height: 80 }}
              />
            </View>
            <Text style={MaStyles.subTextMake}>{item.make_description}</Text>
          </Col>
        );
      } else {
        return <Col style={{ position: "absolute" }}></Col>;
      }
    }
  };

  const regionSelected = (idRegion: string, nameRegion: string) => {
    //console.log(nameRegion)
    //setModalVisible(false);
    setRegionId(idRegion);
    setLocationLabel(nameRegion);
  };

  // Modal con filtro
  let modalRef;
  const openModal = () => modalRef.show();
  const saveModalRef = (ref) => (modalRef = ref);
  const onSelectedOption = (value) => {
    let res = value.split("|");
    regionSelected(res[0], res[1]);
  };

  const createStaticModalOptions = () => {
    const options = [];
    for (let i = 1; i < listRegion.length; i++) {
      //console.log(listRegion[i]);
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
      //console.log(listRegion[i]);
      options.push({
        label: listRegion[i].region_name,
        value: listRegion[i].region_id + "|" + listRegion[i].region_name,
      });
    }
    //console.log(customFilterKey);
    if (!!customFilterKey) {
      options = options.filter((option) =>
        new RegExp(`^.*?(${customFilterKey}).*?$`).test(option.label)
      );
    }
    return new Promise((resolve) => setTimeout(() => resolve(options), 100));
  };

  const staticModalOptions = createStaticModalOptions();

  //style evaluation
  const locationL = () => {
    if (locationLabel == "Location") {
      return MaStyles.labelPlaceholder;
    } else {
      return MaStyles.labelText;
    }
  };

  const searchCar = async () => {
    setLoading(true);
    searchTwo();
  };

  const searchTwo = async () => {
    let urlBodyType = "13a";

    let caror = 0;
    if (carFlag) {
      caror = 0;
    } else {
      caror = 1;
    }

    let urlSaved =
      Globals.BASE_URL +
      "Maxauto/findVehicle/" +
      caror +
      "/" +
      regionId +
      "/" +
      fromRealSale +
      "/" +
      toRealSale +
      "/" +
      urlBodyType +
      "/" +
      idMake +
      "/" +
      modelId +
      "/" +
      fromRealOdo +
      "/" +
      toRealOdo +
      "/" +
      +fromRealYear +
      "/" +
      +toRealYear +
      "/";

    console.log(urlSaved);

    fetch(
      Globals.BASE_URL +
        "Maxauto/findVehicle/" +
        caror +
        "/" +
        regionId +
        "/" +
        fromRealSale +
        "/" +
        toRealSale +
        "/" +
        urlBodyType +
        "/" +
        idMake +
        "/" +
        modelId +
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
        console.log(data.data.count[0].total);
        //setListMake(data.data);
        setLoading(false);
        navigation.navigate("SearchResult", {
          resultSearch: data.data.vehicules,
          urlRequest: urlSaved,
          totalResult: data.data.count[0].total,
          flagVe: caror,
          makeId: idMake,
          modelId: modelId,
          location: regionId,
        });
      });

    console.log(urlSaved);
  };

  /*   const checkMake = (id: string, url: string, name: string) => {
    //Alvaro
    idChecked(id);
    setSrcImg(url);
    setName(name);
    setMakeL(name);

    setModalVisible(false);
    goSearch2(id, url, name);
  };
 */

  const checkMake = (id: string, url: string, name: string) => {
    let urlImg;
    console.log(flag);
    if (carFlag) {
      setIdMake(id);
      urlImg = "images/logosMake/" + url;
      setModelLabel("Select Model");
    } else {
      urlImg = "images/logosMakeMoto/" + url;
      setModelLabel("All Models");
    }
    //Alvaro
    idChecked(id);
    setSrc(urlImg);
    setName(name);
    setName(name);

    setModalVisible(false);
    //goSearch2(id, url, name);

    maxAuto.getModels(id).then((result) => setListModel(result));
  };

  const goSearch2 = async (id: string, url: string, nameL: string) => {
    if (carFlag) {
      await AsyncStorage.setItem("flag", "0");
    } else {
      await AsyncStorage.setItem("flag", "1");
    }
    navigation.navigate("SearchTwo", {
      imageSrc: url,
      checked: id,
      name: nameL,
      regionId: regionId,
    });
  };

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

  return (
    <View
      style={{
        height: height,
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: "white",
      }}
    >
      <View>
        {/* <View style={{display:"none"}}> */}
        <Row style={{ height: 30 }}>
          <Grid>
            <Col onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginTop: 5 }}
                name="left"
                size={21}
                color="#0e4e92"
              />
            </Col>
            <Col onPress={() => navigation.goBack()} size={14}>
              <Text style={MaStyles.textHeaderScreenM}> Vehicle Filters</Text>
            </Col>
          </Grid>
        </Row>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{ height: 70, flexDirection: "row", marginEnd: -15 }}
        >
          <TouchableOpacity
            onPress={() => {
              setModelId("0");
              setName("All Makes");
              setCarFlag(true);
              setSrc("images/logosMake/LOGO-ALL1");
            }}
            style={carButton()}
          >
            <Text style={carLayer()}>Car</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setModelId("0");
              setName("All Makes");
              setCarFlag(false);
              setSrc("images/logosMake/LOGO-ALL1");
            }}
            style={motoButton()}
          >
            <Text style={motoLayer()}>Motorbike</Text>
          </TouchableOpacity>
        </ScrollView>

        {/*      <Text style={MaStyles.textSubHeader}>Condition</Text>
      <Row style={{ height: 90 }}>
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
      </Row> */}

        <Text style={MaStyles.textSubHeader2}>Location</Text>
        <Row style={{ marginTop: 10, height: 40 }}>
          <Col>
            <Text style={locationL()} onPress={(value) => openModal()}>
              {locationLabel}
            </Text>
          </Col>
        </Row>

        <Text style={[MaStyles.textSubHeader, { marginTop: 40 }]}>Make</Text>

        {/*      <Row style={{ marginTop: 15, height: 40, paddingBottom: 60 }}>
        <Col>
          <Text style={locationL()} onPress={() => setModalVisible(true)}>
            {makeL}
          </Text>
          <AntDesign
            size={22}
            style={{
              marginBottom: -3,
              marginTop: 14,
              position: "absolute",
              right: 1,
              paddingEnd: 20,
            }}
            name="search1"
            color="#0e4e92"
          />
        </Col>
      </Row> */}

        <Row style={{ marginTop: 10, height: 90 }}>
          <Col
            onPress={() => setModalVisible(true)}
            style={{ marginBottom: 15 }}
          >
            <View
              style={[MaStyles.iconBackSelected, { width: "90%", height: 50 }]}
            >
              <Image
                resizeMode="contain"
                source={{ uri: Globals.BASE_URL + srcImage + ".png" }}
                style={{ width: 90, height: 50 }}
              />
            </View>
            <Text style={MaStyles.subTextMake}>{name}</Text>
          </Col>
          <Col style={{ marginTop: 5 }} size={2}>
            {idMake == "0" && <Text style={modelL()}>All Models</Text>}

            {idMake != "0" && (
              <Text style={modelL()} onPress={(value) => openModal3()}>
                {modelLabel}
              </Text>
            )}
          </Col>
        </Row>
      </View>

      <Row style={{ marginTop: 15, height: 40 }}>
        <Col>
          <TouchableOpacity
            onPress={() => searchCar()}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              paddingHorizontal: 0,
            }}
          >
            <ImageBackground
              source={require("../../assets/images/gradiantbg.png")}
              style={{ width: "100%", height: 50, alignItems: "center" }}
              imageStyle={{ borderRadius: 200 }}
            >
              <Text style={[MaStyles.buttonTextM]}>Search</Text>
            </ImageBackground>
          </TouchableOpacity>
        </Col>
      </Row>

      <ModalSelectList
        inputName="customFilterKey3"
        ref={saveModalRef3}
        placeholder={"Find Model"}
        closeButtonText={"Back"}
        options={staticModalOptions3}
        onSelectedOption={onSelectedOption3}
        disableTextSearch={false}
        provider={modalOptionsProvider3}
        numberOfLines={3}
      />

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

      <Modal
        deviceHeight={height}
        animationIn={"slideInUp"}
        isVisible={isModalVisible}
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
        <Grid style={{ width: "100%" }}>
          <Row style={{ height: 40, marginTop: 20 }}>
            <Grid>
              <Col
                style={{ marginStart: 4 }}
                onPress={() => setModalVisible(false)}
                size={10}
              >
                <Text style={MaStyles.textHeader}>Select Make</Text>
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

          <Row style={{ marginTop: 20, height: 40 }}>
            <Col>
              <TextInput //onChangeText={text => { setEngineSize(text); }}
                placeholderTextColor={"gray"}
                placeholder={"Quick search"}
                style={MaStyles.textInputRow}
                onChangeText={(text) => filterMakes(text)}
              />
              <AntDesign
                size={22}
                style={{
                  marginBottom: -3,
                  marginTop: 14,
                  position: "absolute",
                  right: 1,
                  paddingEnd: 20,
                }}
                name="search1"
                color="#0e4e92"
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 150, position: "absolute" }}>
            {carFlag && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={listMake}
                style={{
                  alignSelf: "center",
                  marginTop: 0,
                  height: height - 200,
                  paddingBottom: 50,
                }}
                numColumns={4}
                extraData={renderMake}
                renderItem={({ item, index }) => renderFlatMake(item, index)}
              ></FlatList>
            )}

            {!carFlag && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={listMakeMoto}
                style={{
                  alignSelf: "center",
                  marginTop: 0,
                  height: height,
                  paddingBottom: 50,
                }}
                numColumns={4}
                extraData={renderMake}
                renderItem={({ item, index }) =>
                  renderFlatMakeMoto(item, index)
                }
              ></FlatList>
            )}
          </Row>
        </Grid>
      </Modal>

      <Modal
        deviceHeight={height}
        animationIn={"zoomInDown"}
        animationOut={"zoomOutUp"}
        isVisible={loading}
        style={[
          MaStyles.container,
          {
            marginTop: 0,
            maxHeight: height,
            marginHorizontal: 0,
            marginVertical: 0,
            borderTopStartRadius: 0,
            borderTopEndRadius: 0,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0e4e92",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextAnimator
            content="🔍 Searching Vehicles...️️️"
            duration={1000}
            textStyle={MaStyles.textHeaderLoading}
          />
          <Image
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
              marginTop: -30,
            }}
            source={require("../../assets/lottie/loading.gif")}
          />
        </View>
      </Modal>
    </View>
  );
}
