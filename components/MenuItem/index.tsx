import { View,Text,Image, TouchableOpacity, ImageBackground} from "react-native";
import React from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import styles from "./styles";

type MenuItemProps = {
    titleText:string;
    subTitleText:string;
    uriImage:string;
    onPressItem:()=>void;
}

export default function MenuItem(props:MenuItemProps){

const renderImage = (imageUri:any) =>{
    console.log(imageUri);
   return(<Image
    style={styles.image}
    source={imageUri}
  />)
}

 return (
   <Col style={styles.itemContainer}>
      <TouchableOpacity onPress={props.onPressItem} style={styles.touchableView}>
    <View style={styles.itemView}>
    {renderImage(props.uriImage)}
    <View style={styles.textContainer}>
      <Text style={styles.text}>{props.titleText}</Text>
      <Text style={styles.subtitle}>{props.subTitleText}</Text>
    </View>
    </View>
  </TouchableOpacity>
</Col>

  )
}