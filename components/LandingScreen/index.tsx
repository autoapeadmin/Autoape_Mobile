import { View,Text,Image, TouchableOpacity, ImageBackground} from "react-native";
import React from "react";
import styles from "./styles"
import { Grid, Row } from "react-native-easy-grid";

type LandingScreenProps = {
    titleText:string;
    subTitleText:string;
    onPressButton:()=>void;
    buttonText:string;
    uriImage:string
}

export default function LandingScreen(props:LandingScreenProps){

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

    <TouchableOpacity
    onPress={props.onPressButton}
    style={styles.buttonContainer}
    >
    <ImageBackground
                source={require('../../assets/images/gradiantbg.png')}  
                style={styles.button} imageStyle={{borderRadius:200}}
                >
                    <Text style={styles.buttonText}>{props.buttonText}</Text>
                </ImageBackground>

    </TouchableOpacity>
</Grid>)
}