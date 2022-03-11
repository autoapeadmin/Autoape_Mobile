import { View,Text,Image, TouchableOpacity, ImageBackground, Linking} from "react-native";
import React from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";

type LinkTextProps = {
    linkText:string;
    url:string;
}

export default function LinkText(props:LinkTextProps){


 return (
  <Row style={{marginTop:30}}>
    <Col style={{width:40}}>
    <FontAwesome style={{marginTop:3}} name="arrow-circle-right" size={20} color="#059688" />
    </Col>
    <Col>
    <Text onPress={()=>{Linking.openURL(props.url)}} style={styles.linktext}>
      {props.linkText}
    </Text>
    </Col>
  </Row>
  )
}