import { View,Text,Image, TouchableOpacity, ImageBackground, Dimensions} from "react-native";
import React from "react";
import styles from "./styles"
import { Col, Grid, Row } from "react-native-easy-grid";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";


type ProgressBarProps = {
  stepActive:number;
  titleText:string;
}

export default function ProgressBar(props:ProgressBarProps){

  const getColor = (step:number,number:number,isLast:boolean=false) => {
    if(step>=number){
      if(isLast){
        return styles.stepActiveLast
      }else{
        return styles.stepActive
      }
    
    }
    else{
      if(isLast){
        return styles.stepDesactiveLast
      }else{
        return styles.stepDesactive
      }
    }
  }

 return (<Grid style={styles.containerStyle} >
   <Row style={{height:50}}>
   <Text style={styles.title}>{props.titleText}</Text>
   </Row>
   <Row>
   <Col>
    <View style={styles.stepActiveFirst}></View>
   </Col>
   <Col>
   <View style={getColor(props.stepActive,1)}></View>
   </Col>
   <Col>
   <View style={getColor(props.stepActive,2)}></View>
   </Col>
   <Col>
   <View style={getColor(props.stepActive,3,true)}></View>
   </Col>
   </Row>
 </Grid>
)
}