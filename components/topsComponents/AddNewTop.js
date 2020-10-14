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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';

const AddNewTop = ({addnewVisible, close}) => {
  const [exercises, setExercises] = useState([]);
  const [choosenExercise, setChoosenExercise] = useState({});
  const [record, setRecord] = useState('');
  const [saveErrors, setSaveErrors] = useState({
    exerciseError: '',
    recordError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  //Method used to set all state hooks back to initial state
  const closingModal = () => {
    setRecord('');
    setChoosenExercise({});
    setSaveErrors({
      exerciseError: '',
      recordError: '',
    });
  };

  //   //Method used to validate user inputs
  const validate = () => {
    let exerciseError = '';
    let recordError = '';

    //User must choose exercise
    if (choosenExercise.exerciseID === undefined) {
      exerciseError = 'Please choose exercise';
    }

    //User must choose starting time
    if (record === '') {
      recordError = 'Please input your personal record';
    }

    //If there is some error then return false
    if (exerciseError || recordError) {
      //If there is some errors then set them in state hooks
      setSaveErrors({
        exerciseError,
        recordError,
      });
      return false;
    }

    //Else return true
    return true;
  };

  //Method used to save user data
  const saveTop = async () => {
    if (validate()) {
      setIsLoading(true);

      const userID = await AsyncStorage.getItem('userId');

      //Using fetch method to update data into database using API
      await fetch('http://10.0.3.101:8009/api/PersonalBests', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: Number(userID),
          ExerciseID: Number(choosenExercise.exerciseID),
          record: record,
        }),
      }).catch((error) => console.log(error));

      setIsLoading(false);
      close();
      closingModal();
    }
  };

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
      visible={addnewVisible}
      animationType="slide"
      transparent={true}
      onShow={() => getAllExercises()}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Close button to close this modal*/}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                close(), closingModal();
              }}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>
            {/* Header text*/}
            <Text style={styles.headerText}>Add new personal best</Text>
            {/* Component that displays a dropdown list of all exercises AND has a search bar for searching of specific exercise*/}
            <SearchableDropdown
              onItemSelect={(item) => {
                setChoosenExercise(item),
                  setSaveErrors({
                    ...saveErrors,
                    exerciseError: '',
                  });
              }}
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
            {/* Error message that displays it if not empty */}
            <Text style={styles.errorMsg}>{saveErrors.exerciseError}</Text>

            {/* Check if choosen exercise is picked before showing this view */}
            {choosenExercise.name !== undefined ? (
              //View that has a label and textinput for user to write down his record
              <View style={{marginVertical: '7%'}}>
                <Text style={styles.inputHeader}>
                  Your personal record for this exercise:
                </Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={(value) => {
                    setRecord(value),
                      setSaveErrors({
                        ...saveErrors,
                        recordError: '',
                      });
                  }}
                  value={record}
                />
                {/* Error message that displays it if not empty */}
                <Text style={styles.errorMsg}>{saveErrors.recordError}</Text>
              </View>
            ) : null}

            {/* Button that has onPress event to call save method to save personal best record */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveTop()}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            {/* Loading indicator is shown when isLoading is true */}
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="grey"
                style={styles.indicator}
              />
            )}
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
    marginVertical: '20%',
    backgroundColor: '#ddd',
    width: Dimensions.get('screen').width / 1.15,
    height: Dimensions.get('screen').height / 1.5,
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
    margin: '7%',
  },
  inputHeader: {
    marginVertical: '5%',
    textAlign: 'center',
    fontSize: 18,
  },
  inputBox: {
    height: 35,
    borderBottomWidth: 2,
    fontSize: 20,
    paddingVertical: 2,
    paddingHorizontal: 15,
    width: '80%',
    alignSelf: 'center',
  },
  saveButton: {
    backgroundColor: 'darkcyan',
    borderRadius: 30,
    padding: '5%',
    width: '40%',
    alignSelf: 'center',
    marginVertical: '5%',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMsg: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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

export default AddNewTop;
