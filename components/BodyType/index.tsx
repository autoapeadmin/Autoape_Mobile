import { Image, TouchableOpacity} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";

type BodyTypeProps = {
    isSelected:boolean;
    imageSrcSelected:string;
    imageSrc:string;
   
}

export default function BodyType(props:BodyTypeProps){

  const renderImage = (imageUri:any) =>{
    console.log(imageUri);
   return(<Image
    style={{ 
      width: "95%",
      height: 80,
      marginVertical: 5,
      borderRadius: 10,
    }}
    source={imageUri}
  />)
}
 
 return (
  props.isSelected ? (
    <TouchableOpacity
      style={{ width: 120 }}
      onPress={props.onPress}
    >
      {renderImage(props.imageSrcSelected)}
    </TouchableOpacity>
  ) : ( <TouchableOpacity  
    style={{ width: 120 }}
    onPress={props.onPress}
  >
   {renderImage(props.imageSrc)}
  </TouchableOpacity>)) 
}