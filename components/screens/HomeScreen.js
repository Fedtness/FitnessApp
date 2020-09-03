import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HomeBottomTabs from '../routes/homeBottomTabs';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <HomeBottomTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002930',
  },
});

export default HomeScreen;
