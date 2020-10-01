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

const EditGeneralInfo = ({generalInfoModalVisible, close}) => {
  const [newUserInfo, setNewUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [newGeneralInfo, setNewGeneralInfo] = useState({
    age: null,
    height: null,
    weight: null,
    gender: '',
  });

  //Method used to update user data
  const saveChanges = async () => {
    const userID = await AsyncStorage.getItem('userId');

    //Using fetch method to update data into database using API
    await fetch('http://10.0.3.101:8009/api/UserAccounts/' + userID, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: newUserInfo.firstName,
        lastName: newUserInfo.lastName,
        email: newUserInfo.email,
      }),
    }).catch((error) => console.log(error));

    //Using fetch method to update data into database using API
    await fetch('http://10.0.3.101:8009/api/GeneralInfoes/' + userID, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        height: Number(newGeneralInfo.height),
        weight: Number(newGeneralInfo.weight),
        age: Number(newGeneralInfo.age),
        gender: newGeneralInfo.gender,
      }),
    }).catch((error) => console.log(error));

    //Calling parent method to close modal
    close();
  };

  //Method used to get users info
  const getUserInfo = async () => {
    const userID = await AsyncStorage.getItem('userId');

    //First fetch to get info from UserAccounts table in database
    await fetch('http://10.0.3.101:8009/api/UserAccounts/' + userID, {
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
        setNewUserInfo({
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          email: responseData.email,
        });
      })
      .catch((error) => console.log(error));

    //Second fetch to get info from GeneralInfo table in database
    await fetch('http://10.0.3.101:8009/api/GeneralInfoes/' + userID, {
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
        setNewGeneralInfo({
          age: responseData.age,
          height: responseData.height,
          weight: responseData.weight,
          gender: responseData.gender,
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    // Modal component which is called from profile screen
    <Modal
      visible={generalInfoModalVisible}
      animationType="slide"
      transparent={true}
      onShow={() => getUserInfo()}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Close button to close this modal*/}
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>

            {/* Header text*/}
            <Text style={styles.headerText}>Edit general information</Text>

            <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={80}>
              <ScrollView>
                {/* Form which has labels and inputs for different data used to update user information*/}
                <View style={styles.editForm}>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>First name:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, firstName: value})
                      }
                      value={newUserInfo.firstName}
                    />
                  </View>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Last name:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, lastName: value})
                      }
                      value={newUserInfo.lastName}
                    />
                  </View>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Email:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, email: value})
                      }
                      value={newUserInfo.email}
                    />
                  </View>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Age:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewGeneralInfo({...newGeneralInfo, age: value})
                      }
                      keyboardType="number-pad"
                      value={String(newGeneralInfo.age)}
                      maxLength={2}
                    />
                  </View>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Height (cm):</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewGeneralInfo({...newGeneralInfo, height: value})
                      }
                      keyboardType="number-pad"
                      value={String(newGeneralInfo.height)}
                      maxLength={6}
                    />
                  </View>
                  {/* Input view with label and textinput*/}
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Weight (kg):</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewGeneralInfo({...newGeneralInfo, weight: value})
                      }
                      keyboardType="number-pad"
                      value={String(newGeneralInfo.weight)}
                      maxLength={6}
                    />
                  </View>
                </View>

                {/* View with 2 buttons to choose users gender*/}
                <View style={styles.genderButtonsView}>
                  {/* Male gender button*/}
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setNewGeneralInfo({...newGeneralInfo, gender: 'M'})
                    }>
                    <View
                      style={[
                        styles.gender,
                        {
                          backgroundColor:
                            newGeneralInfo.gender == 'M' ? 'grey' : '#cccaca',
                        },
                      ]}>
                      <Icon name="mars" size={25} />
                      <Text style={styles.genderText}>Male</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  {/* Female gender button*/}
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setNewGeneralInfo({...newGeneralInfo, gender: 'F'})
                    }>
                    <View
                      style={[
                        styles.gender,
                        {
                          backgroundColor:
                            newGeneralInfo.gender == 'F' ? 'grey' : '#cccaca',
                        },
                      ]}>
                      <Icon name="venus" size={25} />
                      <Text style={styles.genderText}>Female</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>

                {/* Button to call save method to update user data*/}
                <Button onPress={saveChanges} title="Save changes" />
              </ScrollView>
            </KeyboardAvoidingView>
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
    marginVertical: '10%',
    backgroundColor: '#ddd',
    width: Dimensions.get('screen').width / 1.25,
    height: Dimensions.get('screen').height / 1.25,
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
    marginBottom: '3%',
  },
  input: {
    borderBottomWidth: 2,
    padding: 2,
    paddingHorizontal: '2%',
    minWidth: 100,
    maxWidth: 200,
    marginVertical: '3%',
    textAlign: 'center',
  },
  editForm: {
    marginBottom: '3%',
  },
  formRow: {
    flexDirection: 'row',
    marginVertical: '2%',
    textAlignVertical: 'center',
  },
  formLabel: {
    fontSize: 16,
    marginRight: '5%',
    marginVertical: '5%',
    width: 90,
  },
  genderButtonsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '5%',
  },
  gender: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    padding: '3%',
    marginHorizontal: '10%',
  },
  genderText: {
    fontSize: 16,
  },
});

export default EditGeneralInfo;
