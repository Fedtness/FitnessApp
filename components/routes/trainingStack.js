import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ChooseTraining from '../screens/TrainingScreens/ChooseTraining';
import ChooseAreaType from '../screens/TrainingScreens/ChooseAreaType';
import MuscleGroupExercise from '../screens/TrainingScreens/MuscleGroupExercise';

const TrainingStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ChooseTraining"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChooseTraining" component={ChooseTraining} />
      <Stack.Screen name="ChooseAreaType" component={ChooseAreaType} />
      <Stack.Screen
        name="MuscleGroupExercise"
        component={MuscleGroupExercise}
      />
    </Stack.Navigator>
  );
};

export default TrainingStack;
