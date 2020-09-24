import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import EditGeneralInfo from '../profileComponents/EditGeneralInfo';
import ChangePassword from '../profileComponents/ChangePassword';
import EditBodyData from '../profileComponents/EditBodyData';

const ProfileScreen = ({navigation}) => {
  const [generalInfoModal, setGeneralInfoModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [bodyDataModal, setBodyDataModal] = useState(false);
  const [username, setUsername] = useState('');

  const [userBMI, setUserBMI] = useState(null);

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [generalInfo, setGeneralInfo] = useState({
    age: null,
    height: null,
    weight: null,
    gender: '',
  });

  const [bodyCM, setBodyCM] = useState({
    chestBust: null,
    abdomen: null,
    leftArm: null,
    rightArm: null,
    waist: null,
    hips: null,
    leftThigh: null,
    rightThigh: null,
  });

  //Using useEffect to listen to 'focus' event and data from API (Triggers on mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //Getting username from asyncstorage and setting it in state hook
      setUsername(await AsyncStorage.getItem('username'));
      getUserInfo();
      getBodyMeasurements();
    });
    //Unsubscribing from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //Method used to make 2 fetches for getting user account info and general info
  const getUserInfo = async () => {
    //Getting user ID saved in asyncstorage
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
        setUserInfo({
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
        setGeneralInfo({
          age: responseData.age,
          height: responseData.height,
          weight: responseData.weight,
          gender: responseData.gender,
        });
        //And call this method with 2 params for weight and height
        getUserBMI(responseData.weight, responseData.height);
      })
      .catch((error) => console.log(error));
  };

  //Method used to fetch users body measurement
  const getBodyMeasurements = async () => {
    //Gettting userID saved in asyncStorage
    const userID = await AsyncStorage.getItem('userId');

    //Fetch to get info from BodyMeasurements table in database
    await fetch('http://10.0.3.101:8009/api/BodyMeasurements/' + userID, {
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
        setBodyCM({
          ...bodyCM,
          chestBust: responseData.chest_bust,
          abdomen: responseData.abdomen,
          leftArm: responseData.leftArm,
          rightArm: responseData.rightArm,
          waist: responseData.waist,
          hips: responseData.hips,
          leftThigh: responseData.leftThigh,
          rightThigh: responseData.rightThigh,
        });
      })
      .catch((error) => console.log(error));
  };

  //Method ysed to calculate users BMI from users height and weight
  const getUserBMI = (weight, height) => {
    const BMI = (weight / height / height) * 10000;
    setUserBMI(BMI.toFixed(2));
  };

  //Method to close general info edit modal
  const closeGeneralInfoModal = () => {
    setGeneralInfoModal(false);
    getUserInfo();
  };

  //Method to close change password modal
  const closePasswordModal = () => {
    setPasswordModal(false);
  };

  //Method used to close edit body measurements modal
  const closeBodyDataModal = () => {
    setBodyDataModal(false);
    getBodyMeasurements();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header view that has text that shows users username and logout button*/}
        <View style={styles.header}>
          <Text style={styles.usernameText}>{username}</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => navigation.replace('Welcome')}>
            <Text style={styles.logOutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* View that holds general info, general info header and edit general info button icon*/}
        <View>
          {/* View that has text and icon as button that calls modal where user can edit general info*/}
          <View style={styles.InfoHeader}>
            <Text style={styles.InfoHeaderText}>General information</Text>
            <TouchableOpacity
              style={styles.InfoHeaderIcon}
              onPress={() => setGeneralInfoModal(true)}>
              <Icon name="pencil" size={30} />
            </TouchableOpacity>
          </View>

          {/* Calling edit general info component which has modal used to edit user info */}
          <EditGeneralInfo
            close={closeGeneralInfoModal}
            generalInfoModalVisible={generalInfoModal}
          />

          {/* Calling change password component which has modal used to change user password */}
          <ChangePassword
            passwordModalVisible={passwordModal}
            close={closePasswordModal}
          />

          {/* Calling edit body data component which has modal used to edit user body measurements*/}
          <EditBodyData
            bodyDataModal={bodyDataModal}
            close={closeBodyDataModal}
          />

          {/* View that shows users general information*/}
          <View style={styles.generalInfo}>
            <Text style={styles.generalInfoText}>
              First name:{' '}
              <Text style={{fontWeight: 'bold'}}>{userInfo.firstName}</Text>
            </Text>
            <Text style={styles.generalInfoText}>
              Last name:{' '}
              <Text style={{fontWeight: 'bold'}}>{userInfo.lastName}</Text>
            </Text>
            <Text style={styles.generalInfoText}>
              Email: <Text style={{fontWeight: 'bold'}}>{userInfo.email}</Text>
            </Text>
            <Text style={styles.generalInfoText}>
              Age: <Text style={{fontWeight: 'bold'}}>{generalInfo.age}</Text>
            </Text>
            <Text style={styles.generalInfoText}>
              Height:{' '}
              <Text style={{fontWeight: 'bold'}}>{generalInfo.height}</Text> cm
            </Text>
            <Text style={styles.generalInfoText}>
              Weight:{' '}
              <Text style={{fontWeight: 'bold'}}>{generalInfo.weight}</Text> kg
            </Text>
            <Text style={styles.generalInfoText}>
              Gender:{' '}
              {generalInfo.gender === '' ? null : generalInfo.gender === 'M' ? (
                <Text style={{fontWeight: 'bold'}}>Male</Text>
              ) : (
                <Text style={{fontWeight: 'bold'}}>Female</Text>
              )}
            </Text>
          </View>
        </View>

        {/* Button that calls modal in which user can change password*/}
        <TouchableOpacity
          style={styles.passButton}
          onPress={() => setPasswordModal(true)}>
          <Text style={styles.passButtonText}>Change password</Text>
        </TouchableOpacity>

        {/* View that has body measurements header, edit icon (button) and view with info*/}
        <View style={{marginBottom: '7%'}}>
          <View style={styles.InfoHeader}>
            <Text style={styles.InfoHeaderText}>Body measurements</Text>
            <TouchableOpacity
              style={styles.InfoHeaderIcon}
              onPress={() => setBodyDataModal(true)}>
              <Icon name="pencil" size={30} />
            </TouchableOpacity>
          </View>

          {/* View that holds 2 column with body measurements */}
          <View style={styles.bodyInfo}>
            {/* Column view*/}
            <View style={styles.bodyColumnView}>
              <Text style={styles.bodyInfoText}>
                Chest/Bust: {bodyCM.chestBust} cm
              </Text>
              <Text style={styles.bodyInfoText}>
                Left arm: {bodyCM.leftArm} cm
              </Text>
              <Text style={styles.bodyInfoText}>Waist: {bodyCM.waist} cm</Text>
              <Text style={styles.bodyInfoText}>
                Left thigh: {bodyCM.leftThigh} cm
              </Text>
            </View>

            {/* Column view*/}
            <View style={styles.bodyColumnView}>
              <Text style={styles.bodyInfoText}>
                Abdomen: {bodyCM.abdomen} cm
              </Text>
              <Text style={styles.bodyInfoText}>
                Right arm: {bodyCM.rightArm} cm
              </Text>
              <Text style={styles.bodyInfoText}>Hips: {bodyCM.hips} cm</Text>
              <Text style={styles.bodyInfoText}>
                Right thigh: {bodyCM.rightThigh} cm
              </Text>
            </View>
          </View>
        </View>

        {/* View that has a text like a header*/}
        <View>
          <View style={styles.InfoHeader}>
            <Text style={styles.InfoHeaderText}>BMI</Text>
          </View>

          {/* Image showing BMI chart*/}
          <Image
            source={require('../../assets/BMI-chart.jpg')}
            style={styles.BMIimage}
          />

          {/* View showing users BMI*/}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.BMIText}>Your BMI: </Text>
            <Text style={styles.BMIInfo}>{userBMI}</Text>
          </View>

          {/* Text showing additional info about BMI in gerenal*/}
          <Text
            style={{
              fontStyle: 'italic',
              marginHorizontal: '2%',
              marginVertical: '3%',
            }}>
            * BMI is not used for muscle builders, long distance athletes,
            pregnant women, the elderly or young children. This is because BMI
            does not take into account whether the weight is carried as muscle
            or fat, just the number.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: '3%',
  },
  logOutButton: {
    margin: '3%',
    backgroundColor: 'darkcyan',
    padding: 7,
    borderRadius: 30,
  },
  logOutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  InfoHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  InfoHeaderText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#002930',
  },
  InfoHeaderIcon: {
    position: 'absolute',
    right: '5%',
  },
  generalInfo: {
    backgroundColor: '#b2d4d3',
    marginTop: '3%',
    padding: '2%',
  },
  generalInfoText: {
    fontSize: 20,
  },
  passButton: {
    alignSelf: 'center',
    borderWidth: 3,
    borderRadius: 30,
    borderColor: '#002930',
    padding: 7,
    marginVertical: '7%',
  },
  passButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002930',
  },
  bodyColumnView: {
    flexDirection: 'column',
    width: '50%',
  },
  bodyInfo: {
    flexDirection: 'row',
    backgroundColor: '#b2d4d3',
    marginTop: '3%',
  },
  bodyInfoText: {
    fontSize: 18,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  BMIimage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
    justifyContent: 'center',
    marginVertical: '5%',
    backgroundColor: 'darkcyan',
    opacity: 0.8,
  },
  BMIText: {
    fontSize: 20,
  },
  BMIInfo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
