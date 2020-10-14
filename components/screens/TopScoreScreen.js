import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddNewTop from '../topsComponents/AddNewTop';
import EditTop from '../topsComponents/EditTop';

const TopScoreScreen = ({navigation}) => {
  const [tops, setTops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addTopVisible, setAddTopVisible] = useState(false);
  const [editTopVisible, setEditTopVisible] = useState(false);
  const [choosenID, setChoosenID] = useState(null);
  const [choosenName, setChoosenName] = useState('');

  //Using useEffect to listen to 'focus' event and data from API (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Calling method for fetching data
      getUserTops();
    });
    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //Method used to make fetch request for getting user personal best records
  const getUserTops = async () => {
    setIsLoading(true);

    let userID = await AsyncStorage.getItem('userId');

    //Fetch to get info from PersonalBest table in database
    await fetch('http://10.0.3.101:8009/api/PersonalBests/User/' + userID, {
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
        setTops(responseData);
      })
      .catch((error) => console.log(error));

    setIsLoading(false);
  };

  //Method used to close addTop modal and rerendering by calling fetch method
  const closeAddTop = () => {
    setAddTopVisible(false);
    getUserTops();
  };

  //Method used to close edditTop modal and rerendering by calling fetch method
  const closeEditTop = () => {
    setEditTopVisible(false);
    getUserTops();
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* Header text */}
        <Text style={styles.header}>Your personal best</Text>

        {/* TouchableOpacity that works as button to open modal for creating new tops */}
        <TouchableOpacity onPress={() => setAddTopVisible(true)}>
          <Icon
            name="trophy"
            color={'#056357'}
            size={35}
            style={{marginTop: '25%', marginHorizontal: 20}}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          // TouchableOpacity to choose personal best for edditing
          <TouchableOpacity
            key={item.id}
            style={styles.singleItem}
            onPress={() => {
              setEditTopVisible(true),
                setChoosenID(item.id),
                setChoosenName(item.exercises.name);
            }}>
            <Image source={{uri: item.exercises.gif}} style={styles.image} />
            <View style={styles.itemView}>
              <Text style={styles.itemText}>{item.exercises.name}</Text>
              <Text style={styles.itemRecord}>
                Your record:{' '}
                <Text style={{fontStyle: 'italic'}}>{item.record}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <AddNewTop addnewVisible={addTopVisible} close={closeAddTop} />

      <EditTop
        editVisible={editTopVisible}
        close={closeEditTop}
        id={choosenID}
        name={choosenName}
      />

      {isLoading && (
        <ActivityIndicator size="large" color="grey" style={styles.indicator} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    color: '#036b4b',
    fontSize: 24,
    marginVertical: '5%',
    marginLeft: '25%',
    fontWeight: 'bold',
  },
  singleItem: {
    width: '100%',
    marginVertical: '2%',
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
  },
  itemView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: '3%',
  },
  itemText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  itemRecord: {
    textAlign: 'center',
    fontSize: 18,
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
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
  },
});

export default TopScoreScreen;
