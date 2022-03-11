import { View,Text,Image, TouchableOpacity, ImageBackground} from "react-native";
import React from "react";
import { Grid, Row } from "react-native-easy-grid";
import styles from "./styles";

type NotFoundScreenProps = {
    titleText:string;
    subTitleText:string;
    uriImage:string
}

export default function NotFoundScreen(props:NotFoundScreenProps){

const renderImage = (imageUri:any) =>{
    console.log(imageUri);
   return(<Image
    style={styles.image}
    source={imageUri}
    resizeMode="cover"
  />)
}

 return (<Grid style={styles.gridContainer}>
    <Row style={styles.imageContainer}>
   {renderImage(props.uriImage)}
    </Row>
    <Row style={styles.titleContainer}>
    <Text style={styles.title}>
          {props.titleText}
        </Text>
    </Row>
    <Row>
    <Text
         style={styles.subtitle}
        >
         {props.subTitleText}
        </Text>
    </Row>
</Grid>)
}