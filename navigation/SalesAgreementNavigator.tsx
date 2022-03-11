import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import SalesAgreementScreen from "../screens/MenuScreens/SalesAgreementScreen";
import TrafficCameraScreen from "../screens/MenuScreens/TrafficCameraScreen";


const Stack = createSharedElementStackNavigator();

const SalesAgremmentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="SalesAgreementScreen"
        component={SalesAgreementScreen}
      />
    </Stack.Navigator>
  );
};

export default SalesAgremmentStack;
