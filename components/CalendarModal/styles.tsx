import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: "flex-start",
    paddingHorizontal: 15,
    backgroundColor: "white",
    maxHeight: 400,
    marginTop: height/4.5,
    marginHorizontal: 5,
    marginVertical: 0,
    borderTopStartRadius: 30,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: medium,
    color: "#3e3e3e",
    fontSize: RFValue(13),
  },
  calendar: {
    marginBottom: 10,
    width: width - 40,
  },
});
