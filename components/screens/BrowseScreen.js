import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const BrowseScreen = ({navigation}) => {
  const [username, setUsername] = useState('');

  //Using useEffect to listen to 'focus' event and get username (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Getting username from asyncstorage and setting it in state hook
      setUsername(await AsyncStorage.getItem('username'));
    });

    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/HomeScreenBackground.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <Text style={styles.welcomeText}>
          Welcome back <Text style={{fontWeight: 'bold'}}>{username}</Text>
        </Text>
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
    fontSize: 36,
    fontFamily: 'monospace',
    marginTop: '5%',
    color: '#023c3d',
  },
});

export default BrowseScreen;
