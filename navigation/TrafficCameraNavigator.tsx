import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";


const Stack = createSharedElementStackNavigator();

const TrafficCameraStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="TrafficCameraScreen"
        component={TrafficCameraScreen}
      />
    </Stack.Navigator>
  );
};

export default TrafficCameraStack;
