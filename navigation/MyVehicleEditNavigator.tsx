import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditVehicleScreen from "../screens/MyVehiclesScreens/EditVehicleScreen";


const Stack = createStackNavigator();

const MyVehiculeEditStack = () => {
  return (
    <Stack.Navigator>   
            <Stack.Screen
        options={{ headerShown: false }}
        name="EditVehicle1"
        component={EditVehicleScreen}
      />     
    </Stack.Navigator>
  );
};

export default MyVehiculeEditStack;
