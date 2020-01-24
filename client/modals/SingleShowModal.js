import React, { useState } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView, 
  SafeAreaView
} from 'react-native';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function SingleShowModal(props) {
  //state for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  //set username to text in username textInput
  const [showTitle, setShowTitle] = useState('');

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        {/* start of modal when showing */}
        <SafeAreaView behavior="padding" style={styles.container}>
          {/* back button */}
          <Ionicons
            name='ios-arrow-back'
            color='#59C3D1'
            size={32}
            style={styles.menuIcon}
            onPress={() => { setModalVisible(false) }}
          />

          <ScrollView style={{ marginTop: 30 }}>
            <Text style={styles.headerText}>Show Title</Text>

              <Text style={{ marginBottom: 10, color: '#fff' }}>
                General information about the bands or specific show can go here.
              </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {/* create show button when modal is hidden */}
      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => { setModalVisible(true); }}
      >
        <Text style={styles.signupButtonText}>Show More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D323A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 50,
    color: '#59C3D1',
    opacity: 0.9,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 20
  },
  card: {
    backgroundColor: '#75A4AD',
    borderRadius: 10
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 40,
    backgroundColor: '#59C3D1',
  },
  cardText: {

  },
  menuIcon: {
    zIndex: 9,
    position: 'absolute',
    top: 40,
    left: 20,
  }
})