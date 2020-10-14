import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment/min/moment-with-locales';

const BrowseScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Using useEffect to listen to 'focus' event and get username (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Getting username from asyncstorage and setting it in state hook
      setUsername(await AsyncStorage.getItem('username'));
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
        //Filtering and saving daily exercises for todays dato
        const todaysExercises = responseData.filter(
          (exercise) =>
            exercise.timeStamp.split(' ')[0] ===
            moment(Date.now()).format('YYYY-MM-DD'),
        );
        setEvents(todaysExercises);
      })
      .catch((error) => console.log(error));
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/HomeScreenBackground.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <Text style={styles.welcomeText}>
          Welcome back <Text style={{fontWeight: 'bold'}}>{username}</Text>
        </Text>

        {/* View that has a header text and a flatlist */}
        <View style={styles.programView}>
          <Text style={styles.header}>Your today´s agenda: </Text>
          {/* Flatlist to show users exercises for today */}
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.itemView}>
                <Text style={styles.itemText}>
                  {item.exercises.name}{' '}
                  <Text style={{fontWeight: 'normal'}}>at</Text>{' '}
                  {item.timeStamp.split(' ')[1]}
                </Text>
              </View>
            )}
          />
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="grey"
            style={styles.indicator}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.7,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'monospace',
    marginTop: '5%',
    color: '#023c3d',
  },
  programView: {
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: '20%',
    width: '80%',
    maxHeight: '50%',
    borderRadius: 30,
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Roboto',
    margin: '1%',
    marginBottom: '5%',
  },
  itemView: {
    marginVertical: '2%',
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
  },
});

export default BrowseScreen;
