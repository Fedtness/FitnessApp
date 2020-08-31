import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/WelcomeBackground.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.mainContainer}>
          <Text style={{fontSize: 36, fontWeight: 'bold', color: 'blue'}}>
            Welcome screen
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    opacity: 1,
    fontSize: 36,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.7,
  },
});

export default WelcomeScreen;
