import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CheckRegoScreen from "../screens/ListCarScreens/CheckRegoScreen";
import MyVehicleListScreen from "../screens/MyVehiclesScreens/MyVehicleListScreen";
import AddVehicleScreen from "../screens/MyVehiclesScreens/AddVehicleScreen";
import EditVehicleScreen from "../screens/MyVehiclesScreens/EditVehicleScreen";


const Stack = createStackNavigator();

const MyVehiculeStack = () => {
  return (
    <Stack.Navigator>
            <Stack.Screen
        options={{ headerShown: false }}
        name="MyVehicleAdd"
        component={AddVehicleScreen}
      />     
            <Stack.Screen
        options={{ headerShown: false }}
        name="EditVehicle"
        component={EditVehicleScreen}
      />     
    </Stack.Navigator>
  );
};

export default MyVehiculeStack;
