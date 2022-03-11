import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

const height = Dimensions.get("window").height;

export default StyleSheet.create({
    containerStyle:{
        height:RFValue(60),
        backgroundColor: "white",
    },
    title:{
        fontSize:RFValue(19),
        color: "gray",
        fontFamily: semibold,
        marginTop: RFValue(10),
        lineHeight:30,
        textAlign:"left",
        width:"100%"
    },
    backStyle:{
        width:30
    },
    stepActiveFirst:{
        width:"100%",
        height:10,
        backgroundColor:colorPrimary,borderTopStartRadius:20,borderBottomStartRadius:20
      
    },
    stepDesactiveLast:{
        width:"100%",
        height:10,
        backgroundColor:"#80808066",borderTopEndRadius:20,borderBottomEndRadius:20
      
    },
    stepActiveLast:{
        width:"100%",
        height:10,
        backgroundColor:colorPrimary,borderTopEndRadius:20,borderBottomEndRadius:20
      
    },
    stepActive:{
        width:"100%",
        height:10,
        backgroundColor:colorPrimary,
      
    },
    stepDesactive:{
        width:"100%",
        height:10,
        backgroundColor:"#80808066",
  
    }
})