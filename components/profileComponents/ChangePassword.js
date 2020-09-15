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

const ChangePassword = ({passwordModalVisible, close}) => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  //Methos used to close modal and set input values back to empty
  const closeModal = () => {
    setNewPassword('');
    setRepeatPassword('');
    close();
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
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>New password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(pass) => setNewPassword(pass)}
                  value={newPassword}
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Repeat new password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(repPass) => setRepeatPassword(repPass)}
                  value={repeatPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* Button view that has 2 buttons*/}
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton}>
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
});

export default ChangePassword;
