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
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Animated from 'react-native-reanimated';

const SeeEvent = ({seeEventVisible, close, exerciseID, exerciseName}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exercise, setExercise] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  const [showDesciption, setShowDescription] = useState(false);
  const [timerPlaying, setTimerPlaying] = useState(false);
  const [timerDuration, setTimerDuration] = useState(null);

  //method used to make number to 2 digit - like if we have 1 make it 01
  const makeTwoDigit = (time) => {
    const timeString = time.toString();
    if (timeString.length === 2) return time;
    return '0' + time.toString();
  };

  //Method used to count and show remaining time on timer dynamically
  const timer = (remainingTime) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    //Returning time as string with help of makeTwoDigit method to show time as 2 digit (hours, minutes and seconds as 00:00:00)
    return `${makeTwoDigit(hours)}:${makeTwoDigit(minutes)}:${makeTwoDigit(
      seconds,
    )}`;
  };

  //Method used to get dailyExercise data from database
  const showDailyExercise = async () => {
    setIsLoading(true);
    //Fetch to get dailyExercise date from database
    await fetch('http://10.0.3.101:8009/api/DailyExercises/' + exerciseID, {
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
        setExercise(responseData[0]);
        setExerciseData(responseData[0].exercises);
        //If duration is not zero then parse duration til seconds and save it in state
        if (responseData[0].duration !== '00:00:00') {
          let seconds =
            parseInt(responseData[0].duration.split(':')[0]) * 3600 +
            parseInt(responseData[0].duration.split(':')[1]) * 60 +
            parseInt(responseData[0].duration.split(':')[2]);

          setTimerDuration(seconds);
        }
      })
      .catch((error) => console.log(error));
    setIsLoading(false);
  };

  return (
    // Modal component which is called from WeeklyPlan screen
    <Modal
      visible={seeEventVisible}
      animationType="slide"
      transparent={true}
      onShow={() => showDailyExercise()}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Close button to close this modal*/}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                close();
                setShowDescription(false);
                setTimerPlaying(false);
              }}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>
            {/* Header text*/}
            <Text style={styles.headerText}>Daily exercise</Text>

            <ScrollView>
              {/* View that has a text with exercise name */}
              <View style={styles.exerciseView}>
                <Text style={styles.exerciseText}>{exerciseName}</Text>
              </View>
              <Image source={{uri: exerciseData.gif}} style={styles.gif} />

              {/* Button to trigger showDescription state and if it is true show use one color for button if false other */}
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowDescription(!showDesciption)}>
                <Icon
                  name="info-circle"
                  size={30}
                  color={showDesciption ? 'grey' : 'darkcyan'}
                />
              </TouchableOpacity>

              {/* Check if showDescription is true then show text with exercise desciption*/}
              {showDesciption ? (
                <Text style={styles.description}>
                  {exerciseData.description}
                </Text>
              ) : null}

              {/* Check for timer is not undefined */}
              {exerciseData.timerNeeded !== undefined ? (
                //If timerNeeded is true then show this view with countdown timer
                exerciseData.timerNeeded ? (
                  <View style={styles.workoutView}>
                    {/* Circle countdown timer that shows remaining time */}
                    <CountdownCircleTimer
                      isPlaying={timerPlaying}
                      duration={timerDuration}
                      colors={[
                        ['#004777', 0.4],
                        ['#0b8a79', 0.4],
                        ['#029922', 0.2],
                      ]}
                      trailColor={'#ccc'}>
                      {/* Animated text that dynamically shows remaining time inside the countdown circle*/}
                      {({remainingTime}) => (
                        <Animated.Text style={{fontSize: 26}}>
                          {timer(remainingTime)}
                        </Animated.Text>
                      )}
                    </CountdownCircleTimer>

                    {/* Button to trigger timerPlaying state to true/false */}
                    <TouchableOpacity
                      style={styles.timerButton}
                      onPress={() => setTimerPlaying(!timerPlaying)}>
                      {/* If timerPlaying true show "Pause" button and if pressed countdown will stop else show "Start" and on press countdown will start */}
                      {timerPlaying ? (
                        <Text style={styles.timerButtonText}>Pause</Text>
                      ) : (
                        <Text style={styles.timerButtonText}>Start</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  //If timerNeeded is false then show this view
                  <View style={styles.workoutView}>
                    {/* Text that shows "Worout" */}
                    <Text style={styles.workoutHeader}>Workout:</Text>
                    {/* Text that shows how much sets and reps for this exercise */}
                    <Text style={styles.workoutText}>
                      Do{' '}
                      <Text style={{fontWeight: 'bold'}}>
                        {exercise.reps.split(' ')[0]}
                      </Text>{' '}
                      (sets) x{' '}
                      <Text style={{fontWeight: 'bold'}}>
                        {exercise.reps.split(' ')[1]}
                      </Text>{' '}
                      (reps){' '}
                    </Text>
                  </View>
                )
              ) : null}
            </ScrollView>

            {/* Loading indicator is shown when isLoading is true */}
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="grey"
                style={styles.indicator}
              />
            )}
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
    marginVertical: '7%',
    backgroundColor: '#ddd',
    width: Dimensions.get('screen').width / 1.15,
    height: Dimensions.get('screen').height / 1.2,
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
    textAlign: 'center',
    marginBottom: '7%',
  },
  exerciseView: {
    backgroundColor: '#ccc',
    padding: 10,
  },
  exerciseText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  gif: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    resizeMode: 'contain',
    margin: 0,
  },
  infoButton: {
    margin: '2%',
    padding: 10,
    width: '15%',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
  },
  workoutView: {
    alignItems: 'center',
    marginTop: '5%',
  },
  workoutHeader: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 28,
    marginBottom: '5%',
  },
  workoutText: {
    fontSize: 18,
  },
  timerButton: {
    marginVertical: '5%',
    backgroundColor: '#00cccc',
    width: '30%',
    borderRadius: 20,
    borderColor: 'darkcyan',
    borderWidth: 2,
  },
  timerButtonText: {
    fontSize: 20,
    textAlign: 'center',
  },
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
  },
});

export default SeeEvent;
