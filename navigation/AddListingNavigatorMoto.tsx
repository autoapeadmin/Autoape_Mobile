import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CheckRegoScreen from '../screens/ListCarScreens/CheckRegoScreen';
import CheckRegoScreenMotorBike from '../screens/ListCarScreens/CheckRegoScreenMotorbike';


const Stack = createStackNavigator();

const ListVehiculeMotoStack = () => {
    return (
        <Stack.Navigator
        >
            <Stack.Screen
                options={{ headerShown: false }}
                name="ListMoto"
                component={CheckRegoScreenMotorBike}
            />
        </Stack.Navigator>
    )
}



export default ListVehiculeMotoStack;

