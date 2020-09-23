import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChooseAreaType = ({navigation}) => {
  const [areaType, setAreaType] = useState([
    {
      id: 1,
      name: 'Abdomen',
      image: require('../../../assets/MuscleGroupIcons/AbdomenTraining.jpg'),
    },
    {
      id: 2,
      name: 'Back',
      image: require('../../../assets/MuscleGroupIcons/BackTraining.jpg'),
    },
    {
      id: 3,
      name: 'Chest',
      image: require('../../../assets/MuscleGroupIcons/ChestTraining.jpg'),
    },
    {
      id: 4,
      name: 'Biceps',
      image: require('../../../assets/MuscleGroupIcons/BicepsTraining.jpg'),
    },
    {
      id: 5,
      name: 'Triceps',
      image: require('../../../assets/MuscleGroupIcons/TricepsTraining.jpg'),
    },
    {
      id: 6,
      name: 'Shoulders',
      image: require('../../../assets/MuscleGroupIcons/ShoulderTraining.jpg'),
    },
    {
      id: 7,
      name: 'Quads',
      image: require('../../../assets/MuscleGroupIcons/QuadsTraining.jpg'),
    },
    {
      id: 8,
      name: 'Hamstrings',
      image: require('../../../assets/MuscleGroupIcons/HamstringsTraining.jpg'),
    },
    {
      id: 9,
      name: 'Calves',
      image: require('../../../assets/MuscleGroupIcons/CalvesTraining.jpg'),
    },
  ]);

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
        <Text style={styles.header}>Choose muscle goup to train</Text>
      </View>

      {/* FlatList to show all elements */}
      <FlatList
        style={styles.areaTypeItems}
        data={areaType}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={{alignItems: 'space-between'}}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          // TouchableOpacity to choose and go find all exercises for muscle group
          <TouchableOpacity
            key={item.id}
            style={styles.singleItem}
            onPress={() =>
              navigation.navigate('MuscleGroupExercise', {
                id: item.id,
                name: item.name,
              })
            }>
            <Image source={item.image} style={styles.areaTypeImage} />
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
    fontWeight: 'bold',
    color: '#036b4b',
    fontSize: 24,
    marginVertical: 10,
  },
  singleItem: {
    margin: '7%',
  },
  areaTypeImage: {
    borderRadius: 100,
  },
  itemText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ChooseAreaType;
