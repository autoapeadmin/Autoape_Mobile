import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

const height = Dimensions.get("window").height;

export default StyleSheet.create({
    containerStyle:{
        height:40,
        marginHorizontal: 25,
        backgroundColor: "white",
        marginTop:RFValue(50)
    },
    title:{
        fontSize:RFValue(19),
        color: colorPrimary,
        fontFamily: semibold,
        marginTop: 0,
        lineHeight:30,
        textAlign:"left",
        width:"100%"
    },
    backStyle:{
        width:30
    }
})