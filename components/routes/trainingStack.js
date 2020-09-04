import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ChooseTraining from '../screens/TrainingScreens/ChooseTraining';

const TrainingStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ChooseTraining"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChooseTraining" component={ChooseTraining} />
    </Stack.Navigator>
  );
};

export default TrainingStack;
