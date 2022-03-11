import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const colorPrimary = "#0e4e92"; //blue
const semibold = "cereal_medium";
const regular = "cereal_regular";
const medium = "cereal_medium";

export default StyleSheet.create({
    gridContainer:{
        backgroundColor:"white",width:"100%",paddingTop:RFValue(10),paddingHorizontal:20
    },
    imageContainer:{
        height:RFValue(300)
    },
    image:{
        width: "100%",
        height: RFValue(250),
        alignSelf: "center",
        resizeMode: "contain",
        overflow: "visible",
    },
    titleContainer:{
        height:RFValue(80),width:"100%"
    },
    title:{
        textAlign:"center",
        marginTop:RFValue(40),
        fontSize:RFValue(19),
        color: colorPrimary,
        fontFamily: semibold,
        lineHeight:30,
        width:"100%",
        
    },
    subtitle:{
        textAlign:"center",
        fontFamily: regular,
        color: "gray",
        fontSize:RFValue(15),
        lineHeight:26,width:"100%",height:40
    },
    buttonContainer:{
        flex: 1,
        backgroundColor: "white",
        position:"absolute",
        bottom:40,
        width:"100%",
        alignSelf:"center"
    },
    button:{
        width:"100%",
        height:55,
        alignItems:"center"
    },
    buttonText:{
        textAlignVertical: "center",
        color: "white",
        fontSize: 18,
        marginTop: 15,
        fontFamily: medium,
    }
})