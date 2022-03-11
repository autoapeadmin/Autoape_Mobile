import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

export default StyleSheet.create({
    linktext:{
    fontFamily: regular,
    color: colorPrimary,
    textAlign: "left",
    fontSize:RFValue(15),
    lineHeight:26,
   }
})