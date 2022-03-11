import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

export default StyleSheet.create({
   itemContainer:{
    width:"100%",position:"absolute",bottom:0,backgroundColor:"white",height:110,borderTopColor:"#80808066",borderTopWidth:1
   },
   buttonView: {
    backgroundColor: colorPrimary,
    marginTop: 12,
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 2,
    zIndex: 1000,
    width:100
  },
  buttonText: {
    textAlignVertical: "center",
    color: "white",
    marginTop: 15,
    fontFamily: medium,fontSize:16
  },
  buttonViewBack: {
    backgroundColor: "white",
    marginTop: 12,
    height: 50,
    borderRadius: 5,
    alignItems:"flex-start",
    marginHorizontal: 2,
    zIndex: 1000,
    width:100
  },
  buttonTextBack: {
    textAlignVertical: "center",
    color: "black",
    marginTop: 15,
    fontFamily: medium,fontSize:16,textDecorationLine: 'underline'
  },
})