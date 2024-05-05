// In MainNavigator.js in a new project

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SginupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import auth from '@react-native-firebase/auth';


const Stack = createNativeStackNavigator();

function MainNavigator() {
    const [isUserLogin, setIsUserLogin] = useState(false);

    auth().onAuthStateChanged((user) => {
        if (user && user !== null) {
            setIsUserLogin(true);
        } else {
            setIsUserLogin(false);
        }
    })

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isUserLogin ? null : <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />}
                {isUserLogin ? <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> : null}
                {isUserLogin ? null : <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainNavigator;