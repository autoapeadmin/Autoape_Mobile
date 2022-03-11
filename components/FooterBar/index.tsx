import { View,Text,Image, TouchableOpacity, ImageBackground} from "react-native";
import React from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

type FooterBarProps = {
    nextTitle:string;
    backTitle:string;
    onPressItemNext:()=>void;
    onPressItemBack:()=>void;
    isBackButton:boolean;
    isVisible:boolean;
}

export default function FooterBar(props:FooterBarProps){

 return (
   props.isVisible ?
   <View style={styles.itemContainer}>
      <Row>
        <Col>
        <TouchableOpacity
                    style={{alignItems:"flex-start",marginStart:20}}
                    onPress={props.onPressItemBack}
                  >
                    <View style={styles.buttonViewBack}>
                      <Text style={styles.buttonTextBack}>{props.backTitle}</Text>
                    </View>
                  </TouchableOpacity>
        </Col>
        <Col>
        <TouchableOpacity
                    style={{alignItems:"flex-end",marginEnd:20}}
                    onPress={props.onPressItemNext}
                  >
                    <View style={styles.buttonView}>
                      <Text style={styles.buttonText}>{props.nextTitle}</Text>
                    </View>
                  </TouchableOpacity>
        </Col>
      </Row>
  </View> : <View></View>
  )
}