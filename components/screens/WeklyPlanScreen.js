import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import WeeklyTraining from '../weeklyTrainingComponents/weeklyTraining';

const WeeklyPlanScreen = () => {
  const sampleEvents = [
    {start: '2020-09-28', duration: '', note: 'Walk my dog'},
    {start: '2020-09-28 14:00:00', duration: '04:00:00', note: 'Relax'},
    {
      start: '2020-09-28',
      duration: '',
      note: "Doctor's appointment",
    },
    {
      start: '2020-09-29 08:15:00',
      duration: '00:30:00',
      note: 'Morning exercise',
    },
  ];

  return (
    <View>
      <WeeklyTraining events={sampleEvents} style={{height: '100%'}} />
    </View>
  );
};

export default WeeklyPlanScreen;
