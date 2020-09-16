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
  Image,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditBodyData = ({bodyDataModal, close, bodyCM}) => {
  const [bodyMeasurement, setBodyMeasurement] = useState({
    chestBust: bodyCM.chestBust,
    abdomen: bodyCM.abdomen,
    leftArm: bodyCM.leftArm,
    rightArm: bodyCM.rightArm,
    waist: bodyCM.waist,
    hips: bodyCM.hips,
    leftThigh: bodyCM.leftThigh,
    rightThigh: bodyCM.rightThigh,
  });

  return (
    // Modal component which is called from profile screen
    <Modal visible={bodyDataModal} animationType="slide" transparent={true}>
      {/* TouchableWithoutFeedback used to dismiss keyboard on press */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            {/* Close button to close this modal*/}
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Icon style={{padding: 7}} name="close" size={30} />
            </TouchableOpacity>

            <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={50}>
              <ScrollView style={styles.scrollview}>
                {/* Image*/}
                <Image
                  style={styles.image}
                  source={require('../../assets/BodyMeasurement.png')}
                />

                {/* Form view with labels and inputs*/}
                <View style={styles.formView}>
                  {/* Row view with 2 items. Each item (View) has label and input*/}
                  <View style={styles.rowView}>
                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Chest/Bust</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            chestBust: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.chestBust)}
                      />
                    </View>

                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Abdomen</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            abdomen: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.abdomen)}
                      />
                    </View>
                  </View>

                  {/* Row view with 2 items. Each item (View) has label and input*/}
                  <View style={styles.rowView}>
                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Left Arm</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            leftArm: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.leftArm)}
                      />
                    </View>

                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Right Arm</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            rightArm: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.rightArm)}
                      />
                    </View>
                  </View>

                  {/* Row view with 2 items. Each item (View) has label and input*/}
                  <View style={styles.rowView}>
                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Waist</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            waist: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.waist)}
                      />
                    </View>

                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Hips</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            hips: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.hips)}
                      />
                    </View>
                  </View>

                  {/* Row view with 2 items. Each item (View) has label and input*/}
                  <View style={styles.rowView}>
                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Left Thigh</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            leftThigh: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.leftThigh)}
                      />
                    </View>

                    {/* Row item with label and input*/}
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Right Thigh</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setBodyMeasurement({
                            ...bodyMeasurement,
                            rightThigh: value,
                          })
                        }
                        keyboardType="number-pad"
                        maxLength={6}
                        value={String(bodyMeasurement.rightThigh)}
                      />
                    </View>
                  </View>
                </View>

                {/* Button - Touchable opacity with text that works as button */}
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>
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
    marginVertical: '5%',
    backgroundColor: '#ddd',
    width: Dimensions.get('screen').width / 1.15,
    height: Dimensions.get('screen').height / 1.15,
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: '5%',
  },
  scrollview: {
    width: Dimensions.get('screen').width / 1.15,
    alignSelf: 'center',
    marginTop: '8%',
  },
  image: {
    width: Dimensions.get('screen').width / 1.15,
    height: Dimensions.get('screen').height / 3.1,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  formView: {
    marginVertical: '3%',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    marginHorizontal: '5%',
    marginVertical: '2%',
    width: Dimensions.get('screen').width / 3.5,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 2,
    padding: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    borderWidth: 3,
    borderRadius: 30,
    borderColor: '#03453d',
    width: '35%',
    alignSelf: 'center',
    padding: 3,
    marginBottom: '5%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03453d',
  },
});

export default EditBodyData;
