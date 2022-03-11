import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View, Image, Platform,Text } from "react-native";

//Global Styles
import MaStyles from "../assets/styles/MaStyles";

import Colors from "../constants/Colors";

import useColorScheme from "../hooks/useColorScheme";
import AddListScreen from "../screens/AddListScreen";
import DealershipDetailsScreen from "../screens/CommonScreens/DealershipDetailsScreen";
import AgentDetailsScreen from "../screens/CommonScreens/AgentDetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import NearbyScreen from "../screens/NearbyScreen";
import SearchScreen from "../screens/SearchScreens/SearchScreen";
import VehicleDetailsScreen from "../screens/SearchScreens/VehicleDetailsScreen";
import {
  BottomTabParamList,
  HomeParamList,
  NearbyParamList,
  AddListParamList,
  SearchParamList,
  MenuParamList,
  NewsParamList,
} from "../types";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import NewsScreen from "../screens/NewsScreen";
import WantedListScreen from "../screens/MenuScreens/WantedListScreen";
import ContactListScreen from "../screens/MenuScreens/ContactListScreen";
import EvChargerScreen from "../screens/MenuScreens/EvChargerScreen";
import MyListingsScreen from "../screens/MenuScreens/MyListingsScreen";
import SalesAgreementScreen from "../screens/MenuScreens/SalesAgreementScreen";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";
import DocumentReportScreen from "../screens/DocumentReportScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  //customer_id
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        showLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={MenuNavigator}
        options={{
          tabBarIcon: ({ color }) =>
          <View>
           <Entypo style={{alignSelf:"center"}}  name="home" size={24} color={color} />
          <Text style={[MaStyles.bottomTextM,{color:color}]}>Home</Text>
          </View>
         
           ,
        }}
      />

      <BottomTab.Screen
        name="Nearby"
        component={NearbyNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
            <MaterialIcons style={{alignSelf:"center"}} name="location-on" size={24} color={color} />
            <Text style={[MaStyles.bottomTextM,{color:color}]}>Nearby</Text>
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="AddList"
        component={AddListNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{width:70,backgroundColor:"transparent",height:70,marginTop:-5,borderRadius:30}}>
            <View style={MaStyles.divNewListing}>
              <Image
                style={MaStyles.buttonNewListing}
                source={require("../assets/images/icons/add.png")}
              />
            </View>
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="News"
        component={NewsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialCommunityIcons style={{alignSelf:"center"}} name="file-document" size={24} color={color} />
          
            <Text style={[MaStyles.bottomTextM,{color:color}]}>Report</Text>
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Menu"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => 
          <View>
          <FontAwesome name="automobile" style={{alignSelf:"center"}} size={24} color={color} />
         <Text style={[MaStyles.bottomTextM,{color:color}]}>My Vehicles</Text>
         </View>,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <AntDesign size={25} style={{ marginBottom: -2 }} {...props} />;
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon2(props: { name: string; color: string }) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIcon3(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator
    //mode="modal"
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="CarDetails"
        component={VehicleDetailsScreen}
      />
    </HomeStack.Navigator>
  );
}

const HomeStack2 = createStackNavigator<HomeParamList>();
function VehicleDetailNavigator() {
  return (
    <HomeStack2.Navigator mode="modal">
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="CarDetails"
        component={VehicleDetailsScreen}
      />
    </HomeStack2.Navigator>
  );
}

const NearbyStack = createStackNavigator<NearbyParamList>();

function NearbyNavigator() {
  return (
    <NearbyStack.Navigator>
      <NearbyStack.Screen
        name="NearbyScreen"
        component={NearbyScreen}
        options={{ headerShown: false }}
      />
      <NearbyStack.Screen
        options={{
          headerShown: false /* cardStyleInterpolator:({current:{progress}})=>{
          return{
            cardStyle:{
              opacity:progress
            }
          }
        } */,
        }}
        name="DealershipDetails"
        component={DealershipDetailsScreen}
      />
      <NearbyStack.Screen
        options={{ headerShown: false }}
        name="CarDetails"
        component={VehicleDetailsScreen}
      />

      <NearbyStack.Screen
        options={{ headerShown: false }}
        name="AgentDetails"
        component={AgentDetailsScreen}
      />
    </NearbyStack.Navigator>
  );
}

const AddListStack = createStackNavigator<AddListParamList>();

function AddListNavigator() {
  return (
    <AddListStack.Navigator screenOptions={{ animationEnabled: false }}>
      <AddListStack.Screen
        name="AddListScreen"
        component={AddListScreen}
        options={{ headerShown: false }}
      />
    </AddListStack.Navigator>
  );
}

const SearchStack = createSharedElementStackNavigator<SearchParamList>();

function SearchNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
}

const NewsStack = createSharedElementStackNavigator<NewsParamList>();

function NewsNavigator() {
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen
        name="NewsScreen"
        component={DocumentReportScreen}
        options={{ headerShown: false }}
      />
    </NewsStack.Navigator>
  );
}

const MenuStack = createStackNavigator<MenuParamList>();

function MenuNavigator() {
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      <MenuStack.Screen
        name="ContactListScreen"
        component={ContactListScreen}
        options={{ headerShown: false }}
      />

              <MenuStack.Screen
        name="MyListing"
        component={MyListingsScreen}
        options={{ headerShown: false }}
      />

<MenuStack.Screen
        name="SalesAgreement"
        component={SalesAgreementScreen}
        options={{ headerShown: false }}
      />

      <MenuStack.Screen
        name="TrafficCamera"
        component={TrafficCameraScreen}
        options={{ headerShown: false }}
      />



      <MenuStack.Screen
        options={{
          headerShown: false /* cardStyleInterpolator:({current:{progress}})=>{
          return{
            cardStyle:{
              opacity:progress
            }
          }
        } */,
        }}
        name="DealershipDetails"
        component={DealershipDetailsScreen}
      />
    </MenuStack.Navigator>
  );
}
