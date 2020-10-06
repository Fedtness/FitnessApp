import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/min/moment-with-locales';

const AddEvent = ({addEventVisible, close, date}) => {
  const [exercises, setExercises] = useState([]);
  const [choosenExercise, setChoosenExercise] = useState({});
  const [startTime, setStartTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState({hours: 0, minutes: 0});

  const saveTime = (event, time) => {
    if (time !== undefined && event.type == 'set') {
      setShowPicker(false);
      const timeToStart =
        '' + time.getHours() + ':' + time.getMinutes() + ':00';
      setStartTime(timeToStart);
    }
    if (event.type !== 'set') {
      setShowPicker(false);
    }
  };

  //   //Method used to update user data
  //   const saveChanges = async () => {
  //     const userID = await AsyncStorage.getItem('userId');

  //     //Using fetch method to update data into database using API
  //     await fetch('http://10.0.3.101:8009/api/GeneralInfoes/' + userID, {
  //       method: 'PATCH',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         height: Number(newGeneralInfo.height),
  //         weight: Number(newGeneralInfo.weight),
  //         age: Number(newGeneralInfo.age),
  //         gender: newGeneralInfo.gender,
  //       }),
  //     }).catch((error) => console.log(error));

  //     //Calling parent method to close modal
  //     close();
  //   };

  //Method used to get all Exercises from database
  const getAllExercises = async () => {
    //Fetch to get all data from Exercises table in database
    await fetch('http://10.0.3.101:8009/api/Exercises', {
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
    // Modal component which is called from WeeklyPlan screen
    <Modal
      visible={addEventVisible}
      animationType="slide"
      transparent={true}
      onShow={() => getAllExercises()}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Close button to close this modal*/}
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>
            {/* Header text*/}
            <Text style={styles.headerText}>Add exercise</Text>
            {/* Component that displays a dropdown list of all exercises AND has a search bar for searching of specific exercise*/}
            <SearchableDropdown
              onItemSelect={(item) => setChoosenExercise(item)}
              items={exercises}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: 'white',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemsContainerStyle={{maxHeight: 230}}
              onTextChange={(item) => item.name}
              textInputProps={{
                placeholder: 'Choose exercise',
                underlineColorAndroid: 'transparent',
                style: {
                  padding: 12,
                  borderWidth: 2,
                  borderColor: '#ccc',
                  borderRadius: 5,
                },
                onTextChange: (text) => alert(text),
              }}
            />

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}>
              <Text style={styles.timeButtonText}>Choose time</Text>
            </TouchableOpacity>

            {choosenExercise.timerNeeded ? (
              <View>
                <Text>Timer needed</Text>
              </View>
            ) : (
              <Text>Reps needed</Text>
            )}

            {showPicker ? (
              <DateTimePicker
                display="clock"
                is24Hour={true}
                mode="time"
                value={new Date()}
                onChange={saveTime}
              />
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackContainer: {
    backgroundColor: '#000000aa',
    flex: 1,
  },
  modalContainer: {
    alignSelf: 'center',
    marginVertical: '7%',
    backgroundColor: '#ddd',
    width: Dimensions.get('screen').width / 1.15,
    height: Dimensions.get('screen').height / 1.2,
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: '5%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    marginTop: '5%',
  },
  timeButton: {
    marginTop: '5%',
    backgroundColor: '#0ccc',
    padding: 5,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 30,
  },
  timeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddEvent;
