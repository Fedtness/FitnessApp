import React, {useState} from 'react';
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
import bcrypt from 'react-native-bcrypt';

const SignUpScreen = ({navigation}) => {
  const [userAccount, setUserAccount] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confPassword: '',
  });

  const [registerErrors, setRegisterErrors] = useState({
    firstNameError: '',
    lastNameError: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
    confPasswordError: '',
  });

  //Method used to sign up new user
  const createAccount = async () => {
    //Calling validate ethod to check for user input (If all inputs good return true)
    if (validate()) {
      //Setting salt for password hashing
      var salt = await bcrypt.genSaltSync(7);
      //Hashing password
      var hash = await bcrypt.hashSync(userAccount.password, salt);

      //Using fetch method posting data into database using API
      await fetch('http://10.0.3.101:8009/api/UserAccounts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userAccount.firstName,
          lastName: userAccount.lastName,
          username: userAccount.username,
          email: userAccount.email,
          password: hash,
        }),
      })
        //If response is OK then navigate to next screen
        .then((response) => {
          if (response.ok) {
            navigation.navigate('FinishSignup');
          }
        })
        .catch((error) => console.log(error));
    }
  };

  //Method to validate user inputs
  const validate = () => {
    let firstNameError = '';
    let lastNameError = '';
    let usernameError = '';
    let emailError = '';
    let passwordError = '';
    let confPasswordError = '';

    //First name cant be empty
    if (!userAccount.firstName) {
      firstNameError = 'Please enter your first name';
    }

    //Last name cant be empty
    if (!userAccount.lastName) {
      lastNameError = 'Please enter your last name';
    }

    //Cant be empty and must be a legit email
    if (
      !userAccount.email ||
      !userAccount.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      emailError = 'Invalid email';
    }

    //Username must be between 10 and 3 char long
    if (userAccount.username.length > 10 || userAccount.username.length < 3) {
      usernameError = 'Username must be between 3 and 10 characters';
    }

    //Password must match rules
    if (
      !userAccount.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      )
    ) {
      passwordError =
        'Password must contain at least 8 characters and 1 number, 1 uppercalse and 1 lowecase character';
    }

    //Confirm password must match with password
    if (!userAccount.password.match(userAccount.confPassword)) {
      confPasswordError = 'Passwords does not match';
    }

    //If there is some error then return false
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      usernameError ||
      passwordError ||
      confPasswordError
    ) {
      //If there is some errors then set them in state hooks
      setRegisterErrors({
        firstNameError,
        lastNameError,
        emailError,
        usernameError,
        passwordError,
        confPasswordError,
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
          <KeyboardAvoidingView
            behavior={'height'}
            enabled
            style={{flex: 1, height: '100%'}}
            keyboardVerticalOffset={30}>
            <ScrollView>
              {/* View (Form) that has all labels and inputs and errors */}
              <View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>First name</Text>
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        firstName: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          firstNameError: '',
                        });
                    }}
                    value={userAccount.firstName}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.firstNameError}
                  </Text>
                </View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Last name</Text>
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        lastName: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          lastNameError: '',
                        });
                    }}
                    value={userAccount.lastName}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.lastNameError}
                  </Text>
                </View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        username: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          usernameError: '',
                        });
                    }}
                    value={userAccount.username}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.usernameError}
                  </Text>
                </View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.inputBox}
                    textContentType={'emailAddress'}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        email: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          emailError: '',
                        });
                    }}
                    value={userAccount.email}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.emailError}
                  </Text>
                </View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.inputBox}
                    secureTextEntry={true}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        password: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          passwordError: '',
                        });
                    }}
                    value={userAccount.password}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.passwordError}
                  </Text>
                </View>
                {/* View that has label and input (+ error message)*/}
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Confirm password</Text>
                  <TextInput
                    style={styles.inputBox}
                    secureTextEntry={true}
                    onChangeText={(value) => {
                      setUserAccount({
                        ...userAccount,
                        confPassword: value,
                      }),
                        setRegisterErrors({
                          ...registerErrors,
                          confPasswordError: '',
                        });
                    }}
                    value={userAccount.confPassword}
                  />
                  <Text style={styles.errorMsg}>
                    {registerErrors.confPasswordError}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {/* Button to send API signup request and navigate to Home screen*/}
        <TouchableOpacity style={styles.button} onPress={createAccount}>
          <Text style={styles.buttonText}>Sign up</Text>
          <Icon name="arrow-right" size={34} color={'white'} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.65,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  backButton: {
    marginVertical: '2%',
    marginHorizontal: '5%',
  },
  headerText: {
    textAlign: 'center',
    marginVertical: '2%',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue',
  },
  inputField: {
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: '1%',
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    color: 'darkblue',
  },
  inputBox: {
    height: 35,
    backgroundColor: '#242424',
    borderRadius: 30,
    color: 'white',
    fontSize: 20,
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    height: 40,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: 'blue',
    marginHorizontal: '25%',
    marginVertical: 15,
    marginBottom: 30,
    paddingHorizontal: '5%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  errorMsg: {
    color: '#360101',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
