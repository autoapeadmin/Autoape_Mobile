import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

const height = Dimensions.get("window").height;

export default StyleSheet.create({
    containerStyle:{
        paddingHorizontal: 10,
        height: 180,
        marginTop: 25,
        width:"100%"
    },
    gridStyle:{
        marginTop:0,
        height:50,
        borderColor:"white",
        borderWidth:0.5,
        borderRadius:10,
        width:"100%",
        flex:1
    },
    title:{
        fontFamily: medium,
        color: "gray",
        marginHorizontal: 5,
        fontSize:RFValue(13),
        marginTop:5
    },
    subtitle:{
        fontFamily: medium,
        marginHorizontal: 5,
        fontSize:RFValue(13),
        marginTop:5,
        color:"gray"
    },
    stolentext:{
        fontFamily: medium,
        marginHorizontal: 5,
        fontSize:RFValue(13),
        marginTop:30,
        color:"#e63131",
        textAlign:"center",
        width:"100%"
    },
    notstolentext:{
        fontFamily: medium,
        marginHorizontal: 5,
        fontSize:RFValue(13),
        marginTop:30,
        color:"#5fb313",
        textAlign:"center",
        width:"100%"
    }
})