import React, { useState, useContext } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { SignedInContext } from '../context/UserContext';
import { AXIOS_URL } from 'react-native-dotenv';
import VenuePicker from '../components/VenuePicker'
import DateTimePicker from '../components/DateTimePicker';
import RadioForm from 'react-native-simple-radio-button';


export default function EditShowModal(props) {
  const show = props.show;
  //global user signin info and editing function
  const [userInfo, setUserInfo] = useContext(SignedInContext);
  //state for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  //shwo title
  const [showTitle, setShowTitle] = useState(show.name);
  //band title
  const [bandName, setBandName] = useState('');
  // public/private status
  const [status, setStatus] = useState('private');
  //array of all bands
  const [bandNames, addBandName] = useState([bandNames]);
  //venue name
  const [venueName, setVenueName] = useState(show.venue.name);
  //show date
  const [dateTime, setDateTime] = useState(show.dateTime);
  //show description
  const [showDesc, setShowDesc] = useState(show.description);
  // show flyer
  const [flyer, setFlyer] = useState(show.flyer);
  //list of venues
  const [allVenues, setAllVenues] = useState([]);
  const venues = [];
  const getBandsShows = props.getBandsShows;
  // values for public/private option for venue
  const radio_props = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' }
  ];

  const deleteShow = async () => {
    await axios.delete(`https://dive-266016.appspot.com/shows/${show.id}`);
  }


  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        {/* start of modal when showing */}
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {/* back button */}
          <Ionicons size={64} style={styles.menuIconContainer} onPress={() => { setModalVisible(false) }}>
            <Ionicons
              name='ios-arrow-back'
              color='#59C3D1'
              size={32}
              style={styles.menuIcon}
              onPress={() => { setModalVisible(false) }}
            />
          </Ionicons>
          <View style={styles.container}>
            <ScrollView style={styles.title}>
              <Text style={styles.text}>{show.name}</Text>
              {/* Title text box */}
              <TextInput
                placeholder="Edit Show Title"
                placeholderTextColor="#75A4AD"
                returnKeyType="next"
                onChangeText={setShowTitle}
                style={styles.input}
              />
              {/* Description input */}
              <TextInput
                placeholder="Edit Show Description"
                placeholderTextColor="#75A4AD"
                returnKeyType="send"
                onChangeText={setShowDesc}
                style={styles.input}
              />
              <View style={styles.linkRow}>
                {/* Bands input */}
                <TextInput
                  placeholder="Add Band"
                  placeholderTextColor="#75A4AD"
                  returnKeyType="next"
                  onChangeText={setBandName}
                  style={styles.bandInput}
                />
                {/* add band button */}
                <Ionicons
                  name='md-add-circle-outline'
                  color='#59C3D1'
                  size={37}
                  onPress={() => {
                    addBandName([...bandNames, bandName])
                    Alert.alert('Band Added');
                  }}
                />
              </View>
              {/* venue row */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                {/* Radio button to select private/public status of show */}
                <RadioForm
                  style={styles.modal}
                  buttonInnerColor={'#59C3D1'}
                  radio_props={radio_props}
                  initial={1}
                  formHorizontal={true}
                  labelHorizontal={false}
                  buttonColor={'#59C3D1'}
                  selectedButtonColor={'#59C3D1'}
                  animation={true}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  onPress={(value) => { setStatus(value) }}
                />
                {status === 'public' ?
              <VenuePicker setVenueName={setVenueName} allVenues={allVenues} />
              : null
                }
                </View>
              {/* date time picker */}
              <DateTimePicker setDateTime={setDateTime} />
              {/* edit show button when modal is showing */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  console.log(showTitle)
                  axios.patch(`https://dive-266016.appspot.com/shows/${show.id}`, {
                    name: showTitle,
                    dateTime: dateTime,
                    flyer: flyer,
                    venueName: venueName,
                    bandNames: bandNames,
                    description: showDesc
                  })
                    .then(() => getBandsShows())
                    .then(() => setModalVisible(false))
                    .catch(error => console.log('failed to edit show', error));
                }}
              >
                <Text style={styles.buttonText}>Edit Show</Text>
              </TouchableOpacity>
              {/* Delete show button */}
              {/* edit show button when modal is showing */}
              <TouchableOpacity
                style={styles.altButtonContainer}
                onPress={async () => {
                  await deleteShow()
                    .then(async () => {
                      await getBandsShows();
                    })
                    .then(() => setModalVisible(false))
                    .catch(error => console.log('failed to delete show', error));
                }}
              >
                <Text style={styles.buttonText}>Delete Show</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* create show button when modal is hidden */}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.modalShowText}>Edit Show</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D323A',
    padding: 20,
    paddingTop: 40
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: 334,
    fontWeight: 'bold'
  },
  bandInput: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: 295,
    marginRight: 5,
    fontWeight: 'bold'
  },
  title: {
    flex: 1,
    paddingTop: 30
  },
  text: {
    fontSize: 40,
    color: '#59C3D1',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 15
  },
  buttonContainer: {
    backgroundColor: '#59C3D1',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: 200,
    alignSelf: 'center',
    marginHorizontal: 7
  },
  altButtonContainer: {
    backgroundColor: '#AA8181',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: 200,
    alignSelf: 'center',
    marginHorizontal: 7
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '700',
  },
  menuIcon: {
    zIndex: 15,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  menuIconContainer: {
    zIndex: 9,
    position: 'absolute',
    top: 30,
    left: 10,
    padding: 10,
  },
  linkRow: {
    flexDirection: 'row',
    height: 50,
  },
  modalShowText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    color: '#AA8181',
    textAlign: 'right'
  },
  modal: {
    alignSelf: 'center',
    paddingRight: 20
  }
})