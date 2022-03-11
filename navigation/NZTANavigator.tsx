import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import NZTAScreen from "../screens/MenuScreens/NZTAScreen";
import OwnerScreen from "../screens/MenuScreens/OwnerScreen";
import PoliceScreen from "../screens/MenuScreens/PoliceScreen";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";


const Stack = createSharedElementStackNavigator();

const NZTAStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="NZTA"
        component={NZTAScreen}
      />
    </Stack.Navigator>
  );
};

export default NZTAStack;
