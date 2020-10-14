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

const EditTop = ({editVisible, close, id, name}) => {
  const [userTop, setUserTop] = useState('');
  const [saveErrors, setSaveErrors] = useState({
    recordError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  //Method used to set all state hooks back to initial state
  const closingModal = () => {
    setUserTop([]);
    setSaveErrors({
      recordError: '',
    });
  };

  //   //Method used to validate user inputs
  const validate = () => {
    let recordError = '';

    //User must choose starting time
    if (userTop === '') {
      recordError = 'Please input your personal record';
    }

    //If there is some error then return false
    if (recordError) {
      //If there is some errors then set them in state hooks
      setSaveErrors({
        recordError,
      });
      return false;
    }

    //Else return true
    return true;
  };

  //Method to delete users top / record
  const deleteTop = async () => {
    setIsLoading(true);
    //Fetch to delete dailyExercise from database
    await fetch('http://10.0.3.101:8009/api/PersonalBests/' + id, {
      method: 'DELETE',
    }).catch((error) => console.log(error));
    setIsLoading(false);
    close();
  };

  //Method used to update user record
  const saveTop = async () => {
    if (validate()) {
      setIsLoading(true);

      //Using fetch method to update data into database using API
      await fetch('http://10.0.3.101:8009/api/PersonalBests/' + id, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          record: userTop,
        }),
      }).catch((error) => console.log(error));

      setIsLoading(false);
      close();
      closingModal();
    }
  };

  //Method used to get all Exercises from database
  const getUserTop = async () => {
    //Fetch to get all data from Exercises table in database
    await fetch('http://10.0.3.101:8009/api/PersonalBests/' + id, {
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
        setUserTop(responseData.record);
      })
      .catch((error) => console.log(error));
  };

  return (
    // Modal component which is called from WeeklyPlan screen
    <Modal
      visible={editVisible}
      animationType="slide"
      transparent={true}
      onShow={() => getUserTop()}>
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
            <Text style={styles.headerText}>Edit your personal best</Text>

            {/* View that has a text with exercise name */}
            <View style={styles.exerciseView}>
              <Text style={styles.exerciseText}>{name}</Text>
            </View>

            {/* View that has a textinput for user to update record */}
            <View style={{marginVertical: '7%'}}>
              <TextInput
                style={styles.inputBox}
                onChangeText={(value) => {
                  setUserTop(value),
                    setSaveErrors({
                      recordError: '',
                    });
                }}
                value={userTop.toString()}
              />
              {/* Error message that displays it if not empty */}
              <Text style={styles.errorMsg}>{saveErrors.recordError}</Text>
            </View>

            {/* Button that has onPress event to call save method to save personal best record */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveTop()}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            {/* Button that has onPress event to call method for deleting this record / top */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTop()}>
              <Text style={styles.deleteButtonText}>Delete</Text>
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
  exerciseView: {
    backgroundColor: '#ccc',
    padding: 10,
    marginVertical: '5%',
  },
  exerciseText: {
    fontWeight: 'bold',
    fontSize: 16,
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
    textAlign: 'center',
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
  deleteButton: {
    backgroundColor: '#bd5555',
    borderRadius: 30,
    padding: '5%',
    width: '40%',
    alignSelf: 'center',
    marginVertical: '5%',
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

export default EditTop;
