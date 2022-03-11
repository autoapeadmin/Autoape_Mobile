import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import LoginNavigator from './LoginNavigation';
import AddListingNavigator from './AddListingNavigator';
import NewCarNavigator from './NewCarNavigation';
import SearchNavigator from './SearchNavigator';
import AddListingNavigatorMoto from './AddListingNavigatorMoto';
import VehicleDetailsScreen from '../screens/SearchScreens/VehicleDetailsScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import WantedListNavigator from './WantedListNavigator';
import EvChargerNavigator from './EvChargerNavigator';
import TrafficCameraNavigator from './TrafficCameraNavigator';
import SalesAgreementNavigator from './SalesAgreementNavigator';
import PoliceCheckNavigator from './PoliceCheckNavigator';
import OwnerNavigator from './OwnerNavigator';
import MyVehicleNavigator from './MyVehicleNavigator';
import MyVehicleEditNavigator from './MyVehicleEditNavigator';
import NZTANavigator from './NZTANavigator';
import MyDocumentsScreen from '../screens/MenuScreens/MyDocuments';
import MoneyOwingNavigator from './MoneyOwingNavigator';
import WatchListNavigator from './WatchListNavigator';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createSharedElementStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginNavigator} /> 
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NewCar" component={NewCarNavigator} /> 
      <Stack.Screen name="Search" component={SearchNavigator} /> 
      <Stack.Screen name="WantedList" component={WantedListNavigator} /> 
      <Stack.Screen name="EvCharger" component={EvChargerNavigator} />
      <Stack.Screen name="TrafficCamera2" component={TrafficCameraNavigator} />
      <Stack.Screen name="SalesAgreement2" component={SalesAgreementNavigator} />
      <Stack.Screen name="MyVehicles" component={MyVehicleNavigator} />
      <Stack.Screen name="MyVehicleEdit" component={MyVehicleEditNavigator} />
      <Stack.Screen name="Police" component={PoliceCheckNavigator} />
      <Stack.Screen name="Owner" component={OwnerNavigator} />
      <Stack.Screen name="NZTAScreen" component={NZTANavigator} />
      <Stack.Screen name="Money" component={MoneyOwingNavigator} />
      <Stack.Screen name="WatchList" component={WatchListNavigator} />
      <Stack.Screen name="List" component={AddListingNavigator} /> 
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} /> 
      <Stack.Screen name="MyDocuments" component={MyDocumentsScreen} /> 
      <Stack.Screen name="ListMoto" component={AddListingNavigatorMoto} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
