import React, {useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const WelcomeScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputErrors, setInputErrors] = useState({
    emailError: '',
    passwordError: '',
  });
  const [loginError, setLoginError] = useState(false);

  const login = async () => {
    if (validate()) {
      //Using fetch method posting data into database using API
      await fetch('http://10.0.3.101:8009/api/Login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        //If response is OK then navigate to next screen
        .then((response) => {
          return response.json();
        })
        .then(async (responseData) => {
          //Setting state hooks back to empty
          setEmail('');
          setPassword('');
          setInputErrors({emailError: '', passwordError: ''});
          setLoginError(false);
          //Saving user id and username in AsyncStorage
          await AsyncStorage.setItem('userId', responseData.userId.toString());
          await AsyncStorage.setItem('username', responseData.username);
          //Navigating to Home screen
          navigation.replace('Home');
          //If status is 401 set error to true to show error msg
          if (responseData.status === 401) {
            setLoginError(true);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  //Method to validate user input and return true or false if there is some errors
  const validate = () => {
    let emailError = '';
    let passwordError = '';

    //Must not be empty and must be legit email
    if (
      !email ||
      !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      emailError = 'Please enter valid email';
    }

    //Must not be empty
    if (!password) {
      passwordError = 'Please enter valid password';
    }

    //If there is some error then return false
    if (emailError || passwordError) {
      //If there is some errors then set them in state hooks
      setInputErrors({
        emailError,
        passwordError,
      });
      return false;
    }

    //Else return true
    return true;
  };

  return (
    <ImageBackground
      source={require('../../assets/WelcomeBackground.jpg')}
      style={styles.backgroundImage}>
      {/* Main container containing all other elements */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          {/* Header container containing logo and app name*/}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/Logo.png')}
              style={styles.logoImage}
            />
            <Text style={styles.headerText}>Fedtness</Text>
          </View>
          {/* Input container containing 2 labels and 2 input fields and button */}
          <View>
            {/* View that has a label, input and error msg text */}
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={(text) => {
                  setEmail(text),
                    setInputErrors({...inputErrors, emailError: ''}),
                    setLoginError(false);
                }}
                value={email}
              />
              <Text style={styles.errorMsg}>{inputErrors.emailError}</Text>
            </View>
            {/* View that has a label, input and error msg text */}
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={(text) => {
                  setPassword(text),
                    setInputErrors({...inputErrors, passwordError: ''}),
                    setLoginError(false);
                }}
                value={password}
                secureTextEntry={true}
              />
              <Text style={styles.errorMsg}>{inputErrors.passwordError}</Text>
            </View>
            {/* Button to send API login request and navigate to Home screen*/}
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            {loginError ? (
              <Text style={styles.errorMsg}>
                Email and/or password incorrect
              </Text>
            ) : null}
          </View>
          {/* Link used to navigate to Sign up screen*/}
          <Text
            style={styles.linkSignup}
            onPress={() => navigation.navigate('SignUp')}>
            Dont´t have an account?{' '}
            <Text style={{fontWeight: 'bold'}}>Sign up now</Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
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
  logoImage: {
    margin: '5%',
  },
  headerText: {
    color: 'blue',
    fontSize: 58,
    marginTop: '10%',
    fontWeight: 'bold',
  },
  inputField: {
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: '5%',
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 15,
  },
  inputBox: {
    backgroundColor: '#242424',
    borderRadius: 30,
    color: 'white',
    fontSize: 24,
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
    marginTop: '5%',
    marginBottom: '2%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  linkSignup: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: '10%',
  },
  errorMsg: {
    color: '#360101',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
