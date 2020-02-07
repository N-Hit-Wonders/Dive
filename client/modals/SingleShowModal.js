import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SignedInContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import CreateCommentModal from './CreateCommentModal';
import Moment from 'moment';
import axios from 'axios';
import { AXIOS_URL } from 'react-native-dotenv';
import * as Calendar from 'expo-calendar';
import SingleBandModal from './SingleBandModal'
import { LinearGradient } from 'expo-linear-gradient';

export default function SingleShowModal(props) {
  //global user signin info and editing function
  const [userInfo, setUserInfo] = useContext(SignedInContext);
  //state for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  //array of all comments
  const [comments, setComments] = useState([]);
  //user's rsvp status
  const [rsvp, setRsvp] = useState(false);
  const show = props.show;
  const venue = show.venue;
  const bands = show.bands;

  // dummy function so singleShowModal doesn't throw error
  const getAllBands = () => {
    console.log('');
  }

  const getFollowedBands = () => {
    console.log('');
  }

  const getRSVPS = () => {
    console.log('');
  }

  //request to get all comments for specific show
  const getShowComments = () => {
    axios.get(`https://dive-266016.appspot.com/shows/${show.id}/comments`)
      .then((response) => {
        setComments(() => response.data.reverse())
      })
      .catch((err) => {
        console.log(err);
      })
  }
  //request to get user's rsvp info
  const getRsvpInfo = () => {
    axios.get(`https://dive-266016.appspot.com/fans/${userInfo.id}/rsvps`)
      .then((response) => {
        response.data.map((rsvp) => {
          if (show.id === rsvp.id) {
            setRsvp(true);
          }
        })
      })
      .catch((err) => {
        console.log("error getting rsvp info", err);
      });
  }
  //request to add rsvp
  const addRsvp = () => {
    axios.post(`https://dive-266016.appspot.com/shows/rsvps`, {
      id_fan: userInfo.id,
      id_show: show.id,
    })
      .then(() => setRsvp(true))
      .then(createEvent())
      .catch(error => console.log('failed to rsvp', error));
  }
  //request to remove rsvp
  const removeRsvp = () => {
    axios.delete(`https://dive-266016.appspot.com/shows/rsvps`, {
      data: {
        id_fan: userInfo.id,
        id_show: show.id,
      }
    })
      .then(() => setRsvp(false))
      .then(() => createEvent())
      .catch(error => console.log('failed to cancel rsvp', error));
  }
  //create event on user's dive calendar
  const createEvent = async () => {
    try {
      const eventId = await Calendar.createEventAsync(userInfo.calID, details);
      console.log("added event");
    }
    catch (error) {
      console.log('Error', error);
    }
  }

  // event details for calendar integration
  const details = {
    title: show.name,
    startDate: show.dateTime,
    endDate: show.dateTime,
    notes: show.description ? show.description : 'RSVPd show',
    navigationBarIOS: {
      tintColor: 'orange',
      backgroundColor: 'green',
      titleColor: 'blue',
    },
  };

  useEffect(() => {
    //get whether user is rsvpd or not
    getRsvpInfo();
    //get all comments for specific show
    getShowComments();
  }, [])

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        {/* start of modal when showing */}
        <View behavior="padding" style={styles.container}>
          {/* back button */}
          <Ionicons size={64} style={styles.menuIconContainer} onPress={() => { setModalVisible(false) }}>
            <Ionicons
              name='ios-arrow-back'
              color='#59C3D1'
              size={32}
              style={styles.menuIcon}
              onPress={() => {
                props.getRSVPS();
                setModalVisible(false)
              }}
            />
          </Ionicons>
          <LinearGradient
            colors={['#38404C', '#111']}
            style={{ flex: 1 }}
          >
            <ScrollView style={{ marginTop: 70 }}>
              <Text style={styles.headerText} key={show.id}>{show.name}</Text>
              {/* display show flyer if one exists */}
              {show.flyer ?
                <View style={{ marginBottom: -140 }}>
                  <ImageBackground
                    style={{ width: 415, height: 415, alignSelf: 'center', }}
                    source={{ uri: show.flyer }}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.5)', '#000']}
                      style={{ width: 415, height: 415, alignSelf: 'center', }}
                    >
                    </LinearGradient>
                  </ImageBackground>
                </View>
                : null}
              <View>
                <Text style={styles.infoDateText}>{Moment(show.dateTime).format('ll')}</Text>
                <Text style={styles.infoDateText}>{Moment(show.dateTime).format('LT')}</Text>
                {show.description ?
                  <Text style={styles.infoText}>{show.description}</Text>
                  : null
                }
                {venue ?
                <Text style={styles.infoVenueText}>{venue.name}</Text>
                : null}
                </View>
              {/* list of all additional bands playing in current show */}
              {bands && bands.map(band => {
                console.log(band);
                return (
                  <View style={styles.bandModal}>
                    <SingleBandModal band={band} getFollowedBands={getFollowedBands} getRSVPS={getRSVPS} />
                  </View>
                )
              })}

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
                {/* button to create a new comment (shows when signed in) */}
                {userInfo.signedIn ?
                  <CreateCommentModal
                    userId={userInfo.id}
                    showId={show.id}
                    getShowComments={getShowComments}
                  />
                  : null}
                {/* add to calendar button */}
                {/* <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={async () => {
                    try {
                      const eventId = await Calendar.createEventAsync(userInfo.calID, details);
                      console.log('added event');
                    }
                    catch (error) {
                      console.log('Error', error);
                    }
                  }}
                >
                  <Text style={styles.signupButtonText}>Add To Calendar</Text>
                </TouchableOpacity> */}
                {userInfo.signedIn ?
                  <CreateCommentModal
                    userId={userInfo.id}
                    showId={show.id}
                    getShowComments={getShowComments}
                  />
                  : null}
                {/* button to rsvp to specific (shows when signed in) */}
                {userInfo.signedIn ?
                  //if already rsvp'd, show button to cancel rvp
                  rsvp ? <TouchableOpacity
                    style={styles.cancelButtonContainer}
                    onPress={() => {
                      removeRsvp();
                    }}
                  >
                    <Text style={styles.signupButtonText}>Cancel RSVP</Text>
                  </TouchableOpacity>
                    //if not rsvp'd, show rsvp button
                    : <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => {
                        addRsvp();
                      }}
                    >
                      <Text style={styles.signupButtonText}>RSVP</Text>
                    </TouchableOpacity>
                  : null}
              </View>
              {/* button to create a new comment (shows when signed in) */}
              {/* cards to hold comments */}
              {comments.map(comment => {
                return (
                  <Card
                    style={styles.card}
                    key={comment.id}
                    backgroundColor='#111'
                    padding={10}
                    borderRadius={5}
                    containerStyle={styles.card}
                  >
                    <Text style={styles.cardTextUsername} key={comment.user.id}>{comment.user.nickname}</Text>
                    <Text style={styles.cardText}>{comment.text}</Text>
                    <Text style={styles.cardTextTime}>{Moment(comment.createdAt).fromNow()}</Text>
                  </Card>
                )
              })}
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* show more button when modal is hidden */}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.modalShowText}>{show.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D323A',
    justifyContent: 'center',
  },
  bandModal: {
    fontSize: 20,
    color: '#fff',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  headerText: {
    fontSize: 45,
    color: '#59C3D1',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 20
  },
  signupButtonText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#000'
  },
  buttonContainer: {
    backgroundColor: '#75A4AD',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 140,
    marginHorizontal: 7
  },
  cancelButtonContainer: {
    backgroundColor: '#AA8181',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 140,
    marginHorizontal: 7
  },
  cardTextUsername: {
    fontSize: 17,
    color: '#59C3D1',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingRight: 20,
    marginBottom: 4
  },
  cardText: {
    fontSize: 15,
    color: '#fff',
    padding: 1,
  },
  cardTextTime: {
    color: '#75A4AD',
    padding: 1,
  },
  infoDateText: {
    fontSize: 20,
    color: '#59C3D1',
    textAlign: 'right',
    paddingRight: 20,
    fontWeight: 'bold',
    textShadowColor: '#111',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  infoVenueText: {
    fontSize: 22,
    color: '#AA8181',
    textAlign: 'right',
    fontWeight: 'bold',
    paddingRight: 20,
    paddingBottom: 3,
    textShadowColor: '#111',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  infoText: {
    fontSize: 20,
    color: '#75A4AD',
    textAlign: 'right',
    paddingRight: 20,
    paddingBottom: 1,
    textShadowColor: '#111',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10
  },
  menuIcon: {
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
  modalShowText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#fff',
  },
  card: {
    borderWidth: 0,
  }
})