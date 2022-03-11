import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../screens/SearchScreens/SearchScreen";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import SearchResultScreen from "../screens/SearchScreens/SearchResultScreen";
import VehicleDetailsScreen from "../screens/SearchScreens/VehicleDetailsScreen";
import { LogBox, Easing } from "react-native";
import DealershipDetailsScreen from "../screens/CommonScreens/DealershipDetailsScreen";

const Stack = createSharedElementStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Search"
        component={SearchScreen}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="SearchResult"
        component={SearchResultScreen}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="DealershipDetails"
        component={DealershipDetailsScreen}
      />

      <Stack.Screen
        name="CarDetails"
        component={VehicleDetailsScreen}
        options={{
          headerShown: false,
          /*           transitionSpec: {a
            open: {
              animation: "timing",
              config: { duration: 400, easing: Easing.inOut(Easing.ease) },
            },
            close: {
              animation: "timing",
              config: { duration: 400, easing: Easing.inOut(Easing.ease) },
            },
          },
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          }, */
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
