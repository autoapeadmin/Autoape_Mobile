import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SubModelScreen from '../screens/NewCarScreens/SubModelScreen'
//import LoginScreen from '../screens/LoginScreens/LoginScreen';
//import RegisterScreen from '../screens/LoginScreens/RegisterScreen';


const Stack = createStackNavigator();


const NewCarStack = () => {
    return (
        <Stack.Navigator

        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="SubModelScreen"
                component={SubModelScreen}

            />

            {/*   <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                options={{ headerShown: false }}
                name="Register"
                component={RegisterScreen}
            />
 */}
        </Stack.Navigator>
    )
}



export default NewCarStack;