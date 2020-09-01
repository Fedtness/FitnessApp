import React from 'react';
import {
  Dimensions,
  ImageBackground,
  TextInput,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpScreen = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../assets/WelcomeBackground.jpg')}
      style={styles.backgroundImage}>
      {/* Main container containing all other elements */}
      <View style={styles.mainContainer}>
        {/* Header container containing back button and header text*/}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon style={{color: 'blue'}} size={36} name="arrow-left" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Create an account now!</Text>
        </View>
        {/* Input container */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={40}>
            <ScrollView>
              <View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>First name</Text>
                  <TextInput style={styles.inputBox} />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Last name</Text>
                  <TextInput style={styles.inputBox} />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput style={styles.inputBox} />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.inputBox}
                    textContentType={'emailAddress'}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput style={styles.inputBox} secureTextEntry={true} />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Confirm password</Text>
                  <TextInput style={styles.inputBox} secureTextEntry={true} />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {/* Button to send API signup request and navigate to Home screen*/}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    opacity: 1,
    fontSize: 36,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.7,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  backButton: {
    margin: '5%',
  },
  headerText: {
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue',
  },
  inputField: {
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: '2%',
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 15,
  },
  inputBox: {
    height: 40,
    backgroundColor: '#242424',
    borderRadius: 30,
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 15,
  },
  button: {
    justifyContent: 'center',
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
});

export default SignUpScreen;
