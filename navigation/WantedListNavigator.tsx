import React from "react";
import SearchScreen from "../screens/SearchScreens/SearchScreen";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import SearchResultScreen from "../screens/SearchScreens/SearchResultScreen";
import WantedListScreen from "../screens/MenuScreens/WantedListScreen";
import WantedListCreateScreen from "../screens/MenuScreens/WantedListCreateScreen";

const Stack = createSharedElementStackNavigator();

const WantedListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="WantedListScreen"
        component={WantedListScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WantedCreate"
        component={WantedListCreateScreen}
      />
    </Stack.Navigator>
  );
};

export default WantedListStack;
