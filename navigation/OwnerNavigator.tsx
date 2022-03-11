import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import OwnerScreen from "../screens/MenuScreens/OwnerScreen";
import PoliceScreen from "../screens/MenuScreens/PoliceScreen";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";


const Stack = createSharedElementStackNavigator();

const OwnerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Owner"
        component={OwnerScreen}
      />
    </Stack.Navigator>
  );
};

export default OwnerStack;
