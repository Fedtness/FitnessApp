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

const WelcomeScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');

  const login = async () => {
    // console.log(email, password);

    // await fetch('https://localhost:5001/api/Login?email=minemail')
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => console.log(err));

    setEmail('');
    setPassword('');

    navigation.navigate('Home');
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
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
            </View>
            {/* Button to send API login request and navigate to Home screen*/}
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
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
    marginVertical: '10%',
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
    marginTop: '15%',
  },
});

export default WelcomeScreen;
