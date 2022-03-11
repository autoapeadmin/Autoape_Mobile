import { View,Text,Image, TouchableOpacity, ImageBackground, Dimensions} from "react-native";
import React from "react";
import styles from "./styles"
import { Col, Grid, Row } from "react-native-easy-grid";
import LottieView from "lottie-react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";


type VehicleBoxDetailsProps = {
  rego:string;
  year:string;
  make:string;
  model:string;
  isStolen:boolean;
  vin:string;
  onPressButton:()=>void;
  isFind:boolean;
  isPoliceField:boolean;
}


export default function VehicleBoxDetails(props:VehicleBoxDetailsProps){

 return (
  props.isFind? (
    <TouchableOpacity style={{marginTop:15}} onPress={()=>{props.onPressButton()}}>
    
    <Row  style={styles.containerStyle}>
    <Grid style={styles.gridStyle}>
    
      <Row style={{height:30}}>
      <Col style={{width:60}}>
     <View style={{backgroundColor:"gray",borderRadius:150,width:50,height:50,alignItems:"center",marginTop:5}}>
     <FontAwesome style={{marginTop:15}} name="car" size={20} color="white" />
     </View>
      </Col>
      <Col>
      <Text style={styles.title}>{props.year} {props.make} {props.model}</Text>
      <Text style={styles.subtitle}>Plate: {props.rego}</Text>
      </Col>
    
      </Row>
      <Row style={{height:30}}>   
      <View style={{height:0.25,backgroundColor:"#d4d3d9",width:"100%",marginTop:40}}></View>  
      </Row>      
        <Row style={{height:90}}>   
        {
          props.isPoliceField ?
            props.isStolen ?
            <Text style={styles.stolentext}><AntDesign name="warning" size={15} color="#e63131" /> The above vehicle is REPORTED stolen {"\n"} as of {new Date().toLocaleDateString()}</Text>
            :
            <Text style={styles.notstolentext}><AntDesign name="checkcircle" size={15} color="#5fb313" /> The above vehicle is NOT reported stolen {"\n"} as of  {new Date().toLocaleDateString()}</Text>
          :
          <View></View>
        }
       
        </Row>    
     </Grid>
     
    </Row>
    </TouchableOpacity>
    ):(
    <Row  style={{paddingHorizontal: 10, height: 180, marginTop: 15,width:"100%"}}>
    <Grid style={{marginTop:0,height:50,borderColor:"white",borderWidth:0.5,borderRadius:10,width:"100%",flex:1}}>
    
      <Row>
      <Col style={{width:60}}>
     <View style={{backgroundColor:"gray",borderRadius:150,width:50,height:50,alignItems:"center"}}>
     <FontAwesome style={{marginTop:15}} name="car" size={20} color="white" />
     </View>
      </Col>
      <Col size={4}>
      <Text style={styles.title}>Vehicle not found</Text>
      <Text style={styles.subtitle}>Rego is not on NZTA Database</Text>
      </Col>
      </Row>
      <Row>
      <View style={{height:0.25,backgroundColor:"#d4d3d9",width:"100%",marginTop:40}}></View>  
      </Row>    
     </Grid>
    </Row>
    )
)
}