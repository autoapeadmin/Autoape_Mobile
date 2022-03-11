import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import MoneyOwingScreen from "../screens/MenuScreens/MoneyOwingScreen";



const Stack = createSharedElementStackNavigator();

const MoneyOwnerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Money"
        component={MoneyOwingScreen}
      />
    </Stack.Navigator>
  );
};

export default MoneyOwnerStack;
