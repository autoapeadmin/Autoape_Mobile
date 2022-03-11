import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import PoliceScreen from "../screens/MenuScreens/PoliceScreen";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";


const Stack = createSharedElementStackNavigator();

const PoliceStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="PoliceCheckScreen"
        component={PoliceScreen}
      />
    </Stack.Navigator>
  );
};

export default PoliceStack;
