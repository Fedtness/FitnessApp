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

const FinishSignupScreen = ({navigation}) => {
  const [gender, setGender] = useState('');

  return (
    <View style={styles.container}>
      {/* Choose gender container*/}
      <View style={styles.inputView}>
        {/* Choose gender label*/}
        <Text style={styles.label}>Choose your gender</Text>
        {/* Choose gender row that holds 2 buutons?*/}
        <View style={styles.genderButtonsView}>
          {/* Male gender button*/}
          <TouchableWithoutFeedback onPress={() => setGender('male')}>
            <View
              style={[
                styles.gender,
                {backgroundColor: gender == 'male' ? 'grey' : 'lightgrey'},
              ]}>
              <Icon name="mars" size={50} />
              <Text style={styles.genderText}>Male</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Female gender button*/}
          <TouchableWithoutFeedback onPress={() => setGender('female')}>
            <View
              style={[
                styles.gender,
                {backgroundColor: gender == 'female' ? 'grey' : 'lightgrey'},
              ]}>
              <Icon name="venus" size={50} />
              <Text style={styles.genderText}>Female</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
                />
              </View>

              {/* Height input view with label and input field */}
              <View style={styles.inputView}>
                <Text style={styles.label}>What is your height?</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="178 cm"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              {/* Weight input view with label and input field */}
              <View style={styles.inputView}>
                <Text style={styles.label}>What is your weight?</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="72 kg"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
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
    marginVertical: '5%',
  },
  label: {
    textAlign: 'center',
    fontSize: 24,
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
    marginVertical: '5%',
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
});

export default FinishSignupScreen;
