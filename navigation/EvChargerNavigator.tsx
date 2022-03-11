import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import EvChargerScreen from "../screens/MenuScreens/EvChargerScreen";


const Stack = createSharedElementStackNavigator();

const EvChargerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="EvChargerScreen"
        component={EvChargerScreen}
      />
    </Stack.Navigator>
  );
};

export default EvChargerStack;
