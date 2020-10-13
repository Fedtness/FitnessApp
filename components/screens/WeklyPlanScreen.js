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
import EditEvent from '../weeklyTrainingComponents/EditEvent';
import SeeEvent from '../weeklyTrainingComponents/SeeEvent';

const WeeklyPlanScreen = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [editEventVisible, setEditEventVisible] = useState(false);
  const [seeEventVisible, setSeeEventVisible] = useState(false);
  const [exerciseID, setExerciseID] = useState('');
  const [exerciseName, setExerciseName] = useState('');

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
    await fetch('http://10.0.3.101:8009/api/DailyExercises/User/' + userID, {
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

  //Method used to open modal for creating new events (weekly plan / exercises)
  const addEvent = (date) => {
    setDate(date);
    setAddEventVisible(true);
  };

  //Method used to close modal for createing new events and rerendering this (getting all user exercises again)
  const closeAddEvent = () => {
    setAddEventVisible(false);
    getUserExercises();
  };

  //Method to see full event info (weekly plan / exercise)
  const seeEvent = (id, name) => {
    setExerciseID(id);
    setExerciseName(name);
    setSeeEventVisible(true);
  };

  //Method used to close seeEvent modal
  const closeSeeEvent = () => {
    setSeeEventVisible(false);
  };

  //Method to edit event (weekly plan / exercise)
  const editEvent = (id, name) => {
    setExerciseID(id);
    setExerciseName(name);
    setEditEventVisible(true);
  };

  //Method used to close edit event modal and rerendering users weekly exercises
  const closeEditEvent = () => {
    setEditEventVisible(false);
    getUserExercises();
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

      <EditEvent
        editEventVisible={editEventVisible}
        close={closeEditEvent}
        exerciseID={exerciseID}
        exerciseName={exerciseName}
      />

      <SeeEvent
        seeEventVisible={seeEventVisible}
        close={closeSeeEvent}
        exerciseID={exerciseID}
        exerciseName={exerciseName}
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
