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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import bcrypt from 'react-native-bcrypt';

const ChangePassword = ({passwordModalVisible, close}) => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [newPassError, setNewPassError] = useState('');
  const [confPassError, setConfPassError] = useState('');

  //Methos used to close modal and set input values back to empty
  const closeModal = () => {
    setNewPassword('');
    setRepeatPassword('');
    close();
  };

  //Method used to sign up new user
  const updatePassword = async () => {
    //Calling validate ethod to check for user input (If all inputs good return true)
    if (validate()) {
      //Gettinf userID from asyncStorage
      const userID = await AsyncStorage.getItem('userId');
      //Setting salt for password hashing
      var salt = await bcrypt.genSaltSync(7);
      //Hashing password
      var hash = await bcrypt.hashSync(newPassword, salt);

      //Using fetch method posting data into database using API
      await fetch('http://10.0.3.101:8009/api/UserAccounts/' + userID, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: hash,
        }),
      })
        //If response is OK then close this modal
        .then((response) => {
          if (response.status === 200) {
            close();
          }
        })
        .catch((error) => console.log(error));
    }
  };

  //Method to validate user inputs
  const validate = () => {
    let passwordError = '';
    let confPasswordError = '';

    //Password must match rules
    if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
      passwordError =
        'Password must contain at least 8 characters and 1 number, 1 uppercalse and 1 lowecase character';
    }

    //Confirm password must match with password
    if (!repeatPassword || !newPassword.match(repeatPassword)) {
      confPasswordError = 'Passwords does not match';
    }

    //If there is some error then return false
    if (passwordError || confPasswordError) {
      //If there is some errors then set them in state hooks
      setNewPassError(passwordError);
      setConfPassError(confPasswordError);
      return false;
    }

    //Else return true
    return true;
  };

  return (
    // Modal component which is called from profile screen
    <Modal
      visible={passwordModalVisible}
      animationType="slide"
      transparent={true}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Header text*/}
            <Text style={styles.headerText}>Change password</Text>

            {/* Form view with 2 labels and 2 inputs */}
            <View style={styles.passForm}>
              {/* Form view/row with label, textinput and error msg*/}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>New password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(pass) => {
                    setNewPassword(pass), setNewPassError('');
                  }}
                  value={newPassword}
                  secureTextEntry={true}
                />
                <Text style={styles.errorMsg}>{newPassError}</Text>
              </View>

              {/* Form view/row with label, textinput and error msg*/}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Repeat new password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(repPass) => {
                    setRepeatPassword(repPass), setConfPassError('');
                  }}
                  value={repeatPassword}
                  secureTextEntry={true}
                />
                <Text style={styles.errorMsg}>{confPassError}</Text>
              </View>
            </View>

            {/* Button view that has 2 buttons*/}
            <View style={styles.buttonView}>
              {/* Button to cancel and close modal*/}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Button to update users password and close modal*/}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => updatePassword()}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
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
    width: Dimensions.get('screen').width / 1.25,
    height: Dimensions.get('screen').height / 1.5,
    padding: 30,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: '5%',
    textAlign: 'center',
  },
  passForm: {
    marginVertical: '10%',
  },
  formRow: {
    marginVertical: '7%',
  },
  formLabel: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 2,
    marginTop: 10,
    fontSize: 18,
    padding: 2,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#b38181',
    borderRadius: 30,
    padding: '5%',
    marginHorizontal: '10%',
  },
  confirmButton: {
    backgroundColor: '#81b387',
    borderRadius: 30,
    padding: '5%',
    marginHorizontal: '10%',
  },
  errorMsg: {
    color: '#360101',
    fontWeight: 'bold',
  },
});

export default ChangePassword;
