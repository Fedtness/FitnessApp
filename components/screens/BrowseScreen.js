import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';

const BrowseScreen = () => {
  return (
    <ImageBackground
      source={require('../../assets/HomeScreenBackground.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <Text style={styles.welcomeText}>Welcome back [USERNAME]</Text>
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
    fontWeight: 'bold',
    marginTop: '5%',
    color: '#023c3d',
  },
});

export default BrowseScreen;
