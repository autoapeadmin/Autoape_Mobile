import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import MoneyOwingScreen from "../screens/MenuScreens/MoneyOwingScreen";
import WatchListScreen from "../screens/MenuScreens/WatchListScreen";



const Stack = createSharedElementStackNavigator();

const WatchListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="WatchList"
        component={WatchListScreen}
      />
    </Stack.Navigator>
  );
};

export default WatchListStack;
