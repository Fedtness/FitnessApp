import React, {useState} from 'react';
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
import EditGeneralInfo from '../EditGeneralInfo';

const ProfileScreen = ({navigation}) => {
  const [generalInfoModal, setGeneralInfoModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: 'Dainis',
    lastName: 'Moisejenko',
    email: 'moisejenko11@email.com',
    age: 22,
    height: 201.2,
    weight: 90.3,
    gender: 'male',
  });

  const [bodyCM, setBodyCM] = useState({
    chestBust: 82.2,
    abdomen: 75.7,
    leftArm: 41.5,
    rightArm: 41.7,
    waist: 77.2,
    hips: 79,
    leftThigh: 51.5,
    rightTight: 51.8,
  });

  const userBMI = () => {
    const BMI = (userInfo.weight / userInfo.height / userInfo.height) * 10000;
    return BMI.toFixed(2);
  };

  const closeGeneralInfoModal = () => {
    setGeneralInfoModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header view that has text that shows users username and logout button*/}
        <View style={styles.header}>
          <Text style={styles.usernameText}>[USERNAME]</Text>
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

          <EditGeneralInfo
            close={closeGeneralInfoModal}
            generalInfoModalVisible={generalInfoModal}
            userInfo={userInfo}
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
              Age: <Text style={{fontWeight: 'bold'}}>{userInfo.age}</Text>
            </Text>
            <Text style={styles.generalInfoText}>
              Height:{' '}
              <Text style={{fontWeight: 'bold'}}>{userInfo.height}</Text> cm
            </Text>
            <Text style={styles.generalInfoText}>
              Weight:{' '}
              <Text style={{fontWeight: 'bold'}}>{userInfo.weight}</Text> kg
            </Text>
            <Text style={styles.generalInfoText}>
              Gender:{' '}
              <Text style={{fontWeight: 'bold'}}>{userInfo.gender}</Text>
            </Text>
          </View>
        </View>

        {/* Button that calls modal in which user can change password*/}
        <TouchableOpacity style={styles.passButton}>
          <Text style={styles.passButtonText}>Change password</Text>
        </TouchableOpacity>

        {/* View that has body measurements header, edit icon (button) and view with info*/}
        <View style={{marginBottom: '7%'}}>
          <View style={styles.InfoHeader}>
            <Text style={styles.InfoHeaderText}>Body measurements</Text>
            <TouchableOpacity style={styles.InfoHeaderIcon}>
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
                Right thigh: {bodyCM.rightTight} cm
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.InfoHeader}>
            <Text style={styles.InfoHeaderText}>BMI</Text>
          </View>

          <Image
            source={require('../../assets/BMI-chart.jpg')}
            style={styles.BMIimage}
          />

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.BMIText}>Your BMI: </Text>
            <Text style={styles.BMIInfo}>{userBMI()}</Text>
          </View>

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
