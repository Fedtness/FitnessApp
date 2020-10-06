import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import WeeklyTraining from '../weeklyTrainingComponents/weeklyTraining';
import AsyncStorage from '@react-native-community/async-storage';

import AddEvent from '../weeklyTrainingComponents/AddEvent';

const WeeklyPlanScreen = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [addEventVisible, setAddEventVisible] = useState(false);

  //Using useEffect to listen to 'focus' event and data from API (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Getting username from asyncstorage and setting it in state hook
      getUserExercises();
    });
    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //Method used to make fetch request for getting user daily exercises
  const getUserExercises = async () => {
    setIsLoading(true);

    let userID = await AsyncStorage.getItem('userId');

    //First fetch to get info from DailyExercises table in database
    await fetch('http://10.0.3.101:8009/api/DailyExercises/' + userID, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      // Return response as JSON
      .then((response) => {
        return response.json();
      })
      //Set response data in state hook
      .then(async (responseData) => {
        setEvents(responseData);
      })
      .catch((error) => console.log(error));

    setIsLoading(false);
  };

  //Method used to create new events (weekly plan / exercises)
  const addEvent = (date) => {
    setDate(date);
    setAddEventVisible(true);
  };

  const closeAddEvent = () => {
    setAddEventVisible(false);
    getUserExercises();
  };

  //Method to see full event info (weekly plan / exercise)
  const seeEvent = (id, name) => {
    console.log('Id: ' + id + ', Name: ' + name);
  };

  //Method to edit event (weekly plan / exercise)
  const editEvent = (id) => {
    console.log('Long press on: ' + id);
  };

  return (
    <View>
      <WeeklyTraining
        addEvent={addEvent}
        seeEvent={seeEvent}
        editEvent={editEvent}
        events={events}
        style={{height: '100%'}}
      />

      <AddEvent
        addEventVisible={addEventVisible}
        close={closeAddEvent}
        date={date}
      />

      {isLoading && (
        <ActivityIndicator size="large" color="grey" style={styles.indicator} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
  },
});

export default WeeklyPlanScreen;
