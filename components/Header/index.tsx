import { View,Text,Image, TouchableOpacity, ImageBackground, Dimensions} from "react-native";
import React from "react";
import styles from "./styles"
import { Col, Grid, Row } from "react-native-easy-grid";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";


type HeaderProps = {
  titleText:string;
  onPressButton:()=>void;
}


export default function Header(props:HeaderProps){

 return (<Row style={styles.containerStyle} >
   <Col style={styles.backStyle}>
   <AntDesign
 onPress={props.onPressButton}
             style={{marginTop: 5}}
             name="left"
             size={20}
             color="#0e4e92"
           />
   </Col>
   <Col>
   <Text style={styles.title}>
  {props.titleText}
   </Text>
   </Col>

 </Row>
)
}