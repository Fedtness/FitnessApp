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
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  HoursPicker,
  MinutesPicker,
} from '../weeklyTrainingComponents/durationPicker';

const EditEvent = ({editEventVisible, close, exerciseID, exerciseName}) => {
  const [isComplete, setIsComplete] = useState(undefined);
  const [startTime, setStartTime] = useState('');
  const [date, setDate] = useState('');
  const [timerNeeded, setTimerNeeded] = useState(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [trainingCount, setTrainingCount] = useState({sets: '', reps: ''});
  const [saveErrors, setSaveErrors] = useState({
    timeError: '',
    durationError: '',
    repsError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  //method used to make number to 2 digit - like if we have 1 make it 01
  const makeTwoDigit = (time) => {
    const timeString = time.toString();
    if (timeString.length === 2) return time;
    return '0' + time.toString();
  };

  //Method used to remove durationError
  const removeDurationError = () => {
    setSaveErrors({
      ...saveErrors,
      durationError: '',
    });
  };

  //Method used to get hours and minutes from timer and set them together to get timestamp like 00:00:00 and set it into state
  const saveTime = (event, time) => {
    if (time !== undefined && event.type == 'set') {
      setShowPicker(false);
      const timeToStart =
        '' +
        makeTwoDigit(time.getHours()) +
        ':' +
        makeTwoDigit(time.getMinutes()) +
        ':00';
      setStartTime(timeToStart);
      setSaveErrors({
        ...saveErrors,
        timeError: '',
      });
    }
    if (event.type !== 'set') {
      setShowPicker(false);
    }
  };

  //Method used to validate user inputs
  const validate = () => {
    let timeError = '';
    let durationError = '';
    let repsError = '';

    //If exercise need timer then check for duration to not be empty
    if (timerNeeded) {
      if (hours == '00' && minutes == '00') {
        durationError = 'Please choose a duration for exercise';
      }
    }
    //If exercise doesnt need timer then check for reps and sets
    else {
      if (trainingCount.reps === '' || trainingCount.sets === '') {
        repsError = 'Please choose a count of sets and reps';
      }
    }

    //User must choose starting time
    if (startTime === '') {
      timeError = 'Please choose a start time';
    }

    //If there is some error then return false
    if (timeError || durationError || repsError) {
      //If there is some errors then set them in state hooks
      setSaveErrors({
        timeError,
        durationError,
        repsError,
      });
      return false;
    }

    //Else return true
    return true;
  };

  const deleteEvent = async () => {
    setIsLoading(true);
    //Fetch to get dailyExercise date from database
    await fetch('http://10.0.3.101:8009/api/DailyExercises/' + exerciseID, {
      method: 'DELETE',
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
    }).catch((error) => console.log(error));
    setIsLoading(false);
    close();
  };

  //Method used to update user data
  const saveChanges = async () => {
    if (validate()) {
      setIsLoading(true);

      const userID = await AsyncStorage.getItem('userId');

      //Using fetch method to update data into database using API
      await fetch('http://10.0.3.101:8009/api/DailyExercises/' + exerciseID, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isComplete: isComplete,
          timeStamp: date + ' ' + startTime,
          duration: hours + ':' + minutes + ':00',
          reps: trainingCount.sets + ' ' + trainingCount.reps,
        }),
      }).catch((error) => console.log(error));

      setIsLoading(false);
      close();
    }
  };

  //Method used to get dailyExercise data from database
  const getDailyExercise = async () => {
    setIsLoading(true);
    //Fetch to get dailyExercise date from database
    await fetch('http://10.0.3.101:8009/api/DailyExercises/' + exerciseID, {
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
        setTrainingCount({
          sets: responseData[0].reps.split(' ')[0],
          reps: responseData[0].reps.split(' ')[1],
        });
        setHours(responseData[0].duration.split(':')[0]);
        setMinutes(responseData[0].duration.split(':')[1]);
        setTimerNeeded(responseData[0].exercises.timerNeeded);
        setDate(responseData[0].timeStamp.split(' ')[0]);
        setStartTime(responseData[0].timeStamp.split(' ')[1]);
        setIsComplete(responseData[0].isComplete);
      })
      .catch((error) => console.log(error));
    setIsLoading(false);
  };

  return (
    // Modal component which is called from WeeklyPlan screen
    <Modal
      visible={editEventVisible}
      animationType="slide"
      transparent={true}
      onShow={() => getDailyExercise()}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Checking for is exercise complete and show button according to it which either sets it to true or false */}
            {isComplete !== undefined ? (
              isComplete ? (
                <TouchableOpacity
                  onPress={() => setIsComplete(false)}
                  style={{
                    backgroundColor: 'lightgreen',
                    width: 40,
                    height: 40,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="check" color={'green'} size={30} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsComplete(true)}
                  style={{
                    backgroundColor: '#ccc',
                    width: 40,
                    height: 40,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="check" color={'grey'} size={30} />
                </TouchableOpacity>
              )
            ) : null}

            {/* Close button to close this modal*/}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                close(),
                  setSaveErrors({
                    exerciseError: '',
                    timeError: '',
                    durationError: '',
                    repsError: '',
                  });
              }}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>
            {/* Header text*/}
            <Text style={styles.headerText}>Edit exercise</Text>

            {/* View that has a text with exercise name */}
            <View style={styles.exerciseView}>
              <Text style={styles.exerciseText}>{exerciseName}</Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}>
              <Text style={styles.timeButtonText}>Choose new time</Text>
            </TouchableOpacity>
            {/* Error message that displays it if not empty */}
            <Text style={styles.errorMsg}>{saveErrors.timeError}</Text>

            {/* If startTime is not empty then show time stamp with date and start time for choosen exercise after user picked time*/}
            <View style={styles.startTimeView}>
              <Text style={styles.startTimeText}>
                Exercise date and start time:
              </Text>
              <Text style={styles.startTimeStart}>
                {date + ' ' + startTime}
              </Text>
            </View>

            {/* If  timer is needed for choosen exercise then show view with 2 pickers to choose hours and minutes*/}
            {/* Else show view with 2 textinputs for sets and reps for choosen exercise*/}
            {timerNeeded !== undefined ? (
              timerNeeded ? (
                <View>
                  <Text style={styles.durationHeader}>
                    Choose exercise new duration
                  </Text>

                  <View style={styles.pickerRow}>
                    <View style={styles.pickerItem}>
                      <Text style={styles.pickerItemText}>Hours: </Text>
                      <HoursPicker
                        selected={hours}
                        setHours={setHours}
                        removeDurationError={removeDurationError}
                      />
                    </View>

                    <View style={styles.pickerItem}>
                      <Text style={styles.pickerItemText}>Minutes: </Text>
                      <MinutesPicker
                        selected={minutes}
                        setMinutes={setMinutes}
                        removeDurationError={removeDurationError}
                      />
                    </View>
                  </View>
                  {/* Error message that displays it if not empty */}
                  <Text style={styles.errorMsg}>
                    {saveErrors.durationError}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.durationHeader}>
                    Choose sets and reps
                  </Text>

                  <View style={styles.pickerRow}>
                    <View style={styles.pickerItem}>
                      <Text style={styles.pickerItemText}>Sets: </Text>
                      <TextInput
                        placeholder="1"
                        keyboardType={'numeric'}
                        maxLength={2}
                        style={styles.textBox}
                        onChangeText={(value) => {
                          setTrainingCount({
                            ...trainingCount,
                            sets: value.toString(),
                          }),
                            setSaveErrors({
                              ...saveErrors,
                              repsError: '',
                            });
                        }}
                        value={trainingCount.sets}
                      />
                    </View>

                    <View style={styles.pickerItem}>
                      <Text style={styles.pickerItemText}>Reps: </Text>
                      <TextInput
                        placeholder="15"
                        keyboardType={'numeric'}
                        maxLength={2}
                        style={styles.textBox}
                        onChangeText={(value) => {
                          setTrainingCount({
                            ...trainingCount,
                            reps: value.toString(),
                          }),
                            setSaveErrors({
                              ...saveErrors,
                              repsError: '',
                            });
                        }}
                        value={trainingCount.reps}
                      />
                    </View>
                  </View>
                  {/* Error message that displays it if not empty */}
                  <Text style={styles.errorMsg}>{saveErrors.repsError}</Text>
                </View>
              )
            ) : null}

            {/* Button that has onPress event to call save method to save daily exercise */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveChanges()}>
              <Text style={styles.saveButtonText}>Save changes</Text>
            </TouchableOpacity>

            {/* Button that has onPress event to call method for deleting this daily exercise*/}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteEvent()}>
              <Text style={styles.deleteButtonText}>Delete event</Text>
            </TouchableOpacity>

            {/* If showPicker is true then show DateTimePicker for user to choose starting time for exercise */}
            {showPicker ? (
              <DateTimePicker
                display="clock"
                is24Hour={true}
                mode="time"
                value={new Date()}
                onChange={saveTime}
              />
            ) : null}

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
    textAlign: 'center',
    marginBottom: '7%',
  },
  exerciseView: {
    backgroundColor: '#ccc',
    padding: 10,
    marginBottom: '5%',
  },
  exerciseText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeButton: {
    marginTop: '3%',
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
  startTimeView: {
    alignItems: 'center',
    marginVertical: '3%',
  },
  startTimeText: {
    fontSize: 16,
  },
  startTimeStart: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: '2%',
  },
  durationHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerItem: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
  },
  pickerItemText: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textBox: {
    borderBottomWidth: 2,
    fontSize: 16,
    padding: 0,
    textAlign: 'center',
    width: '40%',
    marginLeft: '5%',
  },
  saveButton: {
    backgroundColor: 'darkcyan',
    borderRadius: 30,
    padding: '5%',
    width: '70%',
    alignSelf: 'center',
    marginVertical: '3%',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#bd5555',
    borderRadius: 30,
    padding: '5%',
    width: '70%',
    alignSelf: 'center',
    marginVertical: '3%',
  },
  deleteButtonText: {
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

export default EditEvent;
