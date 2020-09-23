import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AllExercises = ({navigation, route}) => {
  const [exercises, setExercises] = useState([]);

  //Using useEffect to listen to 'focus' event and data from API (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Calling method which has fetch in it
      getExercises();
    });
    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //Method used to fetch all exercises for one muscle group
  const getExercises = async () => {
    await fetch('http://10.0.3.101:8009/api/Exercises/' + route.params.name, {
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
        setExercises(responseData);
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
        <Text style={styles.header}>
          Exercises for{' '}
          <Text style={{fontWeight: 'bold'}}>{route.params.name}</Text>
        </Text>
      </View>

      {/* FlatList to show all exercises */}
      <FlatList
        style={styles.exerciseList}
        data={exercises}
        keyExtractor={(item) => item.exerciseID.toString()}
        renderItem={({item}) => (
          // TouchableOpacity to choose exercise
          <TouchableOpacity
            key={item.exerciseID}
            style={styles.singleItem}
            onPress={() =>
              navigation.navigate('Exercise', {
                id: item.exerciseID,
                name: item.name,
              })
            }>
            <Image source={{uri: item.gif}} style={styles.image} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  header: {
    textAlign: 'center',
    color: '#036b4b',
    fontSize: 24,
    marginVertical: 10,
    marginHorizontal: '5%',
  },
  singleItem: {
    width: '100%',
    marginVertical: '2%',
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
  },
  itemText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    width: '80%',
    paddingHorizontal: '5%',
  },
  image: {
    width: '20%',
    height: '82%',
    alignSelf: 'center',
    borderRadius: 50,
    overlayColor: 'lightgrey',
    marginLeft: '2%',
    backgroundColor: 'lightgrey',
  },
});

export default AllExercises;
