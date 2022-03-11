import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

const height = Dimensions.get("window").height;

export default StyleSheet.create({
    loaderContainer:{
        width:"100%",
        height:height-200,
        alignItems:"center",
        alignContent:"center",
        alignSelf:"center"
    },
    loader:{
        width:  60,
        height: 60,
    },
    text:{
        marginStart:-90,marginTop:120,color:colorPrimary,fontFamily:semibold
    }
})