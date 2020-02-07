import React, { useState, useContext } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import axios from 'axios';
import { SignedInContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { AXIOS_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';


export default function EditBandBioModal({ getBandInfo }) {
  //global user signin info and editing function
  const [userInfo, setUserInfo] = useContext(SignedInContext);
  //state for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  //new bio
  const [newBio, setNewBio] = useState('');
  //new spotify link
  const [spotifyLink, setSpotifyLink] = useState('');
  //new facebook link
  const [facebookLink, setFacebookLink] = useState('');
  //new instagram link
  const [instagramLink, setInstagramLink] = useState('');

  // const [image, setImage] = useState({});
  //sets photo uploaded from phone
  let [selectedImage, setSelectedImage] = useState({});
  //cloudinary url to send photo to
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/da4ry89ct/upload';
  //sets band photo
  let [bandPhoto, setBandPhoto] = useState('');

  //allows user to upload a photo
  //asks phone for permission to access photos
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
    }

    //gets image from phone
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    //sets image from imagePicker to SelectedImage
    setSelectedImage({ localUri: pickerResult.uri });

    //converts image into a form that cloudinary requires
    let base64Img = `data:image/jpg;base64,${pickerResult.base64}`;

    let data = {
      "file": base64Img,
      "upload_preset": "oecwb18t",
    }
    //sends photo to cloudinary
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      let data = await r.json()
      setBandPhoto(data.url);
    }).catch(err => console.log(err))
    savePhoto();
  };

  const savePhoto = async () => {
    await axios.patch(`https://dive-266016.appspot.com/bands/${userInfo.id}/photo`, {
      bandPhoto: bandPhoto
    })
      .then(response => {
        console.log("saving photo to db", bandPhoto)
      })
      .catch(err => {
        console.log("not saving to db", err)
      })
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
            <View style={styles.title}>
              <Text style={styles.text}>Edit Bio</Text>
              {/* new bio text box */}
              <View style={styles.linkRow}>
                <TextInput
                  placeholder="New Bio"
                  placeholderTextColor="#75A4AD"
                  returnKeyType="next"
                  color='black'
                  onChangeText={setNewBio}
                  style={styles.input}
                />
                {/* update bio button */}
                <Ionicons
                  name='md-add-circle-outline'
                  color='#59C3D1'
                  size={37}
                  onPress={() => {
                    axios.patch(`https://dive-266016.appspot.com/users/${userInfo.id}/bio`, {
                      bio: newBio,
                    })
                      .then(response => response)
                      .catch(error => console.log('failed to create user', error));
                    Alert.alert('Bio Updated');
                  }}
                />
              </View>
              {/* spotify link */}
              <View style={styles.linkRow}>
                <TextInput
                  placeholder="Spotify Link"
                  placeholderTextColor="#75A4AD"
                  returnKeyType="next"
                  color='black'
                  onChangeText={setSpotifyLink}
                  style={styles.input}
                />
                {/* update spotify button */}
                <Ionicons
                  name='md-add-circle-outline'
                  color='#59C3D1'
                  size={37}
                  onPress={() => {
                    axios.patch(`https://dive-266016.appspot.com/bands/${userInfo.id}/spotify`, {
                      link_spotify: spotifyLink,
                    })
                      .then(response => response)
                      .catch(error => console.log('failed to create user', error));
                    Alert.alert('Spotify Updated');
                  }}
                />
              </View>
              {/* facebook link */}
              <View style={styles.linkRow}>
                <TextInput
                  placeholder="Facebook Link"
                  placeholderTextColor="#75A4AD"
                  returnKeyType="next"
                  color='black'
                  onChangeText={setFacebookLink}
                  style={styles.input}
                />
                {/* update facebook button */}
                <Ionicons
                  name='md-add-circle-outline'
                  color='#59C3D1'
                  size={37}
                  onPress={() => {
                    axios.patch(`https://dive-266016.appspot.com/bands/${userInfo.id}/fb`, {
                      link_facebook: facebookLink,
                    })
                      .then(response => response)
                      .catch(error => console.log('failed to create user', error));
                    Alert.alert('Facebook Updated');
                  }}
                />
              </View>
              {/* instagram link */}
              <View style={styles.linkRow}>
                <TextInput
                  placeholder="Instagram Link"
                  placeholderTextColor="#75A4AD"
                  returnKeyType="next"
                  color='black'
                  onChangeText={setInstagramLink}
                  style={styles.input}
                />
                {/* update instagram button */}
                <Ionicons
                  name='md-add-circle-outline'
                  color='#59C3D1'
                  size={37}
                  onPress={() => {
                    axios.patch(`https://dive-266016.appspot.com/bands/${userInfo.id}/insta`, {
                      link_instagram: instagramLink,
                    })
                      .then(response => response)
                      .catch(error => console.log('failed to create user', error));
                    Alert.alert('Instagram Updated');
                  }}
                />
              </View>
              {/*  button to upload photo */}
              <View style={styles.button} >
                <TouchableOpacity
                  style={styles.returnButtonContainer}
                  onPress={() => {
                    openImagePickerAsync();
                  }}
              >
                  <Text style={styles.signupButtonText}>Select Photo</Text>
                </TouchableOpacity>

                {/* {image.uri && */}
                {/* <Image source={bandPhoto} style={{ width: 150, height: 150 }} />} */}
              </View>
              {/* <View style={styles.button} >
                <TouchableOpacity
                  style={styles.returnButtonContainer}
                  onPress={savePhoto}
                >
                  <Text style={styles.signupButtonText}>Save Photo</Text>
                </TouchableOpacity>
              </View> */}

              {/* {image.uri && */}
              {/* <Image source={bandPhoto} style={{ width: 150, height: 150 }} />} */}

              {/* button to complete editing */}
              <TouchableOpacity
                style={styles.returnButtonContainer}
                onPress={() => { 
                  getBandInfo();
                  setModalVisible(false); 
                }}
              >
                <Text style={styles.signupButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* edit bio button when modal is hidden */}
      <TouchableOpacity
        style={styles.editBioContainer}
        onPress={() => { setModalVisible(true); }}
      >
        <Text style={styles.signupButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D323A',
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 265,
    fontWeight: 'bold',
    marginRight: 10
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    color: '#59C3D1',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 15
  },
  returnButtonContainer: {
    backgroundColor: '#59C3D1',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 90,
    marginBottom: 10
  },
  editBioContainer: {
    backgroundColor: '#75A4AD',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 140,
    marginHorizontal: 7
  },
  signupButtonText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#000'
  },
  linkRow: {
    flexDirection: 'row',
    height: 50,
  },
  menuIcon: {
    zIndex: 9,
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
})