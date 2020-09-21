import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FinishSignupScreen = ({navigation, route}) => {
  const [userInfo, setUserInfo] = useState({
    gender: '',
    age: null,
    height: null,
    weight: null,
  });

  const [registerErrors, setRegisterErrors] = useState({
    genderError: '',
    ageError: '',
    heightError: '',
    weightError: '',
  });

  const finishSignup = async () => {
    //Calling validate method which checks user inputs and returns true if all OK
    if (validate()) {
      //Using fetch method posting data into database using API
      await fetch('http://10.0.3.101:8009/api/GeneralInfoes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: Number(route.params.userID),
          gender: userInfo.gender.toString(),
          age: Number(userInfo.age),
          height: Number(userInfo.height),
          weight: Number(userInfo.weight),
        }),
      })
        //If response is OK then navigate back to login screen
        .then((response) => {
          if (response.ok) {
            navigation.replace('Welcome');
          }
        })
        .catch((error) => console.log(error));
    }
  };

  //Method to validate user inputs
  const validate = () => {
    let genderError = '';
    let ageError = '';
    let heightError = '';
    let weightError = '';

    //Gender cant be empty
    if (!userInfo.gender) {
      genderError = 'Please choose your gender';
    }

    //Age cant be empty
    if (!userInfo.age || userInfo.age > 100 || userInfo.age <= 0) {
      ageError = 'Please enter your age';
    }

    //Cant be empty and must be a legit height
    if (
      !userInfo.height ||
      !userInfo.height.match(/^\d+(\.\d{1,2})?$/) ||
      userInfo.height > 230 ||
      userInfo.height < 120
    ) {
      heightError = 'Please enter valid height in cm (like - 182.25)';
    }

    //Cant be empty and must be a legit weight
    if (
      !userInfo.weight ||
      !userInfo.weight.match(/^\d+(\.\d{1,2})?$/) ||
      userInfo.weight > 350 ||
      userInfo.weight < 30
    ) {
      weightError = 'Please enter valid weight in kg (like - 75.45)';
    }

    //If there is some error then return false
    if (genderError || ageError || heightError || weightError) {
      //If there is some errors then set them in state hooks
      setRegisterErrors({
        genderError,
        ageError,
        heightError,
        weightError,
      });
      return false;
    }

    //Else return true
    return true;
  };

  return (
    <View style={styles.container}>
      {/* Choose gender container*/}
      <View style={styles.inputView}>
        {/* Choose gender label*/}
        <Text style={styles.label}>Choose your gender</Text>
        {/* Choose gender row that holds 2 buutons?*/}
        <View style={styles.genderButtonsView}>
          {/* Male gender button*/}
          <TouchableWithoutFeedback
            onPress={() => {
              setUserInfo({gender: 'M'}),
                setRegisterErrors({...registerErrors, genderError: ''});
            }}>
            <View
              style={[
                styles.gender,
                {
                  backgroundColor:
                    userInfo.gender == 'M' ? 'grey' : 'lightgrey',
                },
              ]}>
              <Icon name="mars" size={50} />
              <Text style={styles.genderText}>Male</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Female gender button*/}
          <TouchableWithoutFeedback
            onPress={() => {
              setUserInfo({gender: 'F'}),
                setRegisterErrors({...registerErrors, genderError: ''});
            }}>
            <View
              style={[
                styles.gender,
                {
                  backgroundColor:
                    userInfo.gender == 'F' ? 'grey' : 'lightgrey',
                },
              ]}>
              <Icon name="venus" size={50} />
              <Text style={styles.genderText}>Female</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={styles.errorMsg}>{registerErrors.genderError}</Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={40}>
          <ScrollView>
            <View>
              {/* Age input view with label and input field */}
              <View style={styles.inputView}>
                <Text style={styles.label}>What is your age?</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="21"
                  keyboardType="number-pad"
                  maxLength={2}
                  onChangeText={(value) => {
                    setUserInfo({
                      ...userInfo,
                      age: value,
                    }),
                      setRegisterErrors({
                        ...registerErrors,
                        ageError: '',
                      });
                  }}
                  value={userInfo.age}
                />
                <Text style={styles.errorMsg}>{registerErrors.ageError}</Text>
              </View>

              {/* Height input view with label and input field */}
              <View style={styles.inputView}>
                <Text style={styles.label}>What is your height?</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="178 cm"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={(value) => {
                    setUserInfo({
                      ...userInfo,
                      height: value,
                    }),
                      setRegisterErrors({
                        ...registerErrors,
                        heightError: '',
                      });
                  }}
                  value={userInfo.height}
                />
                <Text style={styles.errorMsg}>
                  {registerErrors.heightError}
                </Text>
              </View>

              {/* Weight input view with label and input field */}
              <View style={styles.inputView}>
                <Text style={styles.label}>What is your weight?</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="72 kg"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={(value) => {
                    setUserInfo({
                      ...userInfo,
                      weight: value,
                    }),
                      setRegisterErrors({
                        ...registerErrors,
                        weightError: '',
                      });
                  }}
                  value={userInfo.weight}
                />
                <Text style={styles.errorMsg}>
                  {registerErrors.weightError}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <TouchableOpacity style={styles.button} onPress={finishSignup}>
        <Text style={styles.buttonText}>Save</Text>
        <Icon style={styles.buttonArrow} size={30} name="arrow-right" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  inputView: {
    marginVertical: '3%',
  },
  label: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
  },
  genderButtonsView: {
    flexDirection: 'row',
  },
  gender: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: '3%',
    marginHorizontal: '10%',
  },
  genderText: {
    fontSize: 20,
  },
  inputBox: {
    width: '40%',
    marginHorizontal: '30%',
    fontSize: 20,
    textAlign: 'center',
    borderBottomWidth: 3,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '50%',
    height: 40,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: 'blue',
    marginHorizontal: '25%',
    marginVertical: '3%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonArrow: {
    color: 'white',
    marginHorizontal: '10%',
    alignSelf: 'center',
  },
  errorMsg: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FinishSignupScreen;
