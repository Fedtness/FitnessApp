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

const EditGeneralInfo = ({generalInfoModalVisible, close, userInfo}) => {
  const [newUserInfo, setNewUserInfo] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    age: userInfo.age,
    height: userInfo.height,
    weight: userInfo.weight,
    gender: userInfo.gender,
  });

  const saveChanges = () => {
    console.log(newUserInfo);
  };

  return (
    // Modal component which is called from profile screen
    <Modal
      visible={generalInfoModalVisible}
      animationType="slide"
      transparent={true}>
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

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Age:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, age: value})
                      }
                      keyboardType="number-pad"
                      value={String(newUserInfo.age)}
                      maxLength={2}
                    />
                  </View>

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Height (cm):</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, height: value})
                      }
                      keyboardType="number-pad"
                      value={String(newUserInfo.height)}
                      maxLength={6}
                    />
                  </View>

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Weight (kg):</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(value) =>
                        setNewUserInfo({...newUserInfo, weight: value})
                      }
                      keyboardType="number-pad"
                      value={String(newUserInfo.weight)}
                      maxLength={6}
                    />
                  </View>
                </View>

                {/* View with 2 buttons to choose users gender*/}
                <View style={styles.genderButtonsView}>
                  {/* Male gender button*/}
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setNewUserInfo({...newUserInfo, gender: 'male'})
                    }>
                    <View
                      style={[
                        styles.gender,
                        {
                          backgroundColor:
                            newUserInfo.gender == 'male' ? 'grey' : '#cccaca',
                        },
                      ]}>
                      <Icon name="mars" size={25} />
                      <Text style={styles.genderText}>Male</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  {/* Female gender button*/}
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setNewUserInfo({...newUserInfo, gender: 'female'})
                    }>
                    <View
                      style={[
                        styles.gender,
                        {
                          backgroundColor:
                            newUserInfo.gender == 'female' ? 'grey' : '#cccaca',
                        },
                      ]}>
                      <Icon name="venus" size={25} />
                      <Text style={styles.genderText}>Female</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>

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
