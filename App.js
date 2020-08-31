import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from './components/screens/WelcomeScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import HomeScreen from './components/screens/HomeScreen';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
