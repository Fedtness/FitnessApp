import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditGeneralInfo = ({generalInfoModalVisible, close}) => {
  return (
    <Modal
      visible={generalInfoModalVisible}
      animationType="fade"
      transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackContainer}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Icon name="close" size={30} />
            </TouchableOpacity>

            <Text>Edit general information</Text>
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
    marginVertical: '10%',
    backgroundColor: '#fff',
    width: '80%',
    height: '80%',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: '5%',
    top: '3%',
    paddingTop: '3%',
    paddingHorizontal: '3%',
    alignItems: 'center',
  },
});

export default EditGeneralInfo;
