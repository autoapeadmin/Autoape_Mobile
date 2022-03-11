import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CheckRegoScreen from "../screens/ListCarScreens/CheckRegoScreen";
import CheckRegoScreenMotorBike from "../screens/ListCarScreens/CheckRegoScreenMotorbike";
import PurchaseProduct from "../screens/ListCarScreens/ReactNativeExpoPurchaseProduct";

const Stack = createStackNavigator();

const ListVehiculeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="ListVehicule"
        component={CheckRegoScreen}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="Purchase"
        component={PurchaseProduct}
      />
    </Stack.Navigator>
  );
};

export default ListVehiculeStack;
