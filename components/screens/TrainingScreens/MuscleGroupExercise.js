import React from 'react';
import {View, Text} from 'react-native';

const MuscleGroupExercise = ({navigation, route}) => {
  return (
    <View>
      <Text>Muscle Group Exercise Screen</Text>
      <Text>{route.params.id}</Text>
    </View>
  );
};

export default MuscleGroupExercise;
