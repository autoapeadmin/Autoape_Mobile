import { View,Text,Image, TouchableOpacity, ImageBackground, Dimensions} from "react-native";
import React from "react";
import styles from "./styles"
import { Grid, Row } from "react-native-easy-grid";
import LottieView from "lottie-react-native";


type LoaderProps = {
  title?:string
}


export default function Loader(props:LoaderProps){

 return (<Row style={styles.loaderContainer}>
 <LottieView 
       autoPlay={true}
       loop={true}
       style={styles.loader}
       source={require("../../assets/lottie/newloader.json")}
     />
     <Text style={styles.text}>{props.title}</Text>
</Row>)
}