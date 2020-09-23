import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Exercise = ({navigation, route}) => {
  const [exercise, setExercise] = useState({});

  //Using useEffect to listen to 'focus' event and data from API (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Calling method which has fetch in it
      getExercise();
    });
    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //Method used to fetch all exercises for one muscle group
  const getExercise = async () => {
    await fetch('http://10.0.3.101:8009/api/Exercises/' + route.params.id, {
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
        setExercise(responseData);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        {/* TouchableOpacity that works as button to go back to previous screen */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            color={'#056357'}
            size={30}
            style={{marginVertical: 10, marginHorizontal: 20}}
          />
        </TouchableOpacity>
        {/* Header text */}
        <Text style={styles.header}>{route.params.name}</Text>
      </View>

      {/* Gif image for exercise*/}
      <Image source={{uri: exercise.gif}} style={styles.gif} />

      <Text style={styles.descriptionHeader}>Description</Text>

      {/* View with scrollview inside that holds description/steps for exercise*/}
      <View
        style={{
          marginHorizontal: '5%',
          maxHeight: '30%',
          paddingBottom: '5%',
        }}>
        <ScrollView style={{flexGrow: 1}}>
          <Text style={styles.descriptionText}>{exercise.description}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#036b4b',
    fontSize: 24,
    marginVertical: 10,
    width: '80%',
  },
  gif: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  descriptionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: '5%',
  },
  descriptionText: {
    fontSize: 16,
  },
});

export default Exercise;
