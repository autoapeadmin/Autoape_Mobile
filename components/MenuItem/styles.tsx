import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

export default StyleSheet.create({
   itemContainer:{
    padding: 8,marginTop:20
   },
   touchableView:{
    backgroundColor: "white",
    height: 160,
    borderRadius: 8
   },
   itemView:{
       height:170,
       backgroundColor:"#eeeeee",
       borderRadius:20
    },
    image:{
        width: 90,
        height: 90,
        margin: 10,
        borderRadius: 8,alignSelf:"center"
    },
    textContainer:{
        marginHorizontal: 10
    },
    text:{
        fontFamily: medium,
        color: "#3e3e3e",
        fontSize:RFValue(13),textAlign:"center"
    },
    subtitle:{
        fontFamily: regular,
        color: "gray",
        textAlign: "center",
        fontSize: 13,
        marginTop:7
    }
})