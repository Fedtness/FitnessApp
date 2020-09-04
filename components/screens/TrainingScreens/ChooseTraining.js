import React from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

const ChooseTraining = () => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => console.log('Weight training')}>
        <ImageBackground
          source={require('../../../assets/WeightTraining.jpg')}
          style={styles.backgroundImage}>
          <Text style={styles.trainigName}>Weight training</Text>
        </ImageBackground>
      </TouchableHighlight>

      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => console.log('Calisthenics training')}>
        <ImageBackground
          source={require('../../../assets/CalisthenicsTraining.jpg')}
          style={styles.backgroundImage}>
          <Text style={styles.trainigName}>Calisthenics training</Text>
        </ImageBackground>
      </TouchableHighlight>

      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => console.log('Cardio training')}>
        <ImageBackground
          source={require('../../../assets/CardioTraining.jpg')}
          style={styles.backgroundImage}>
          <Text style={styles.trainigName}>Cardio training</Text>
        </ImageBackground>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.7,
    justifyContent: 'flex-end',
  },
  trainigName: {
    color: '#00e69e',
    fontSize: 34,
    fontWeight: 'bold',
    margin: '5%',
    textShadowColor: '#036b4b',
    textShadowRadius: 10,
    textShadowOffset: {width: -5, height: 5},
  },
});

export default ChooseTraining;
