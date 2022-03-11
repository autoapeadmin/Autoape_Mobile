import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MainLoginScreen from '../screens/LoginScreens/MainLoginScreen';
import LoginScreen from '../screens/LoginScreens/LoginScreen';
import RegisterScreen from '../screens/LoginScreens/RegisterScreen';


const Stack = createStackNavigator();


const LoginStack = () => {
    return (
        <Stack.Navigator

        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="Main"
                component={MainLoginScreen}

            />

            <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                options={{ headerShown: false }}
                name="Register"
                component={RegisterScreen}
            />

        </Stack.Navigator>
    )
}



export default LoginStack;