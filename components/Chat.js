import React, { useEffect, useState } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import NetInfo from '@react-native-community/netinfo';

//installing & initializing Firestore
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, onSnapshot,
  addDoc,
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCppzbAcmyrnGiJxwTaxOwOMltUA8kpUGs",
  authDomain: "chat-app-c7779.firebaseapp.com",
  projectId: "chat-app-c7779",
  storageBucket: "chat-app-c7779.appspot.com",
  messagingSenderId: "927841570709",
  appId: "1:927841570709:web:8ec0c7becbf3d52d1d709c",
  measurementId: "G-QTY1FEW8PM"
};

//init firebase app
const app = initializeApp(firebaseConfig);
//init services
const db = getFirestore(app);
const auth = getAuth();
//collection ref
const messagesCollection = collection(db, 'messages');

//queries
//const q = query(messagesCollection, where('name', '==', 'React Native'));

//Chat screen
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
        //image: null,
        //location: null,
      },
    }
  };

  componentDidMount() {
    //renders user's name from Start page to top of chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    const messagesCollection = collection(db, 'messages');

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log('user status changed: ', user)
      if (!user) {
        signInAnonymously();
      } else {
        this.setState({
          uid: user.uid,
          loggedInText: 'Hello there',
        })
      }
    })

    //real time collection data
    const unsubCol = onSnapshot(messagesCollection, (snapshot) => {
      let messages = []
      snapshot.docs.forEach((doc) => {
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
        });
      });
      console.log(messages)
      this.setState({
        messages,
      });
    });

  };

  //unsubscribing
  componentWillUnmount() {
    unsubCol();
    unsubAuth();
  };

  /* called when a user sends a message, appends new message to the messages object */
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    });
  }

  addMessage(message) {
    addDoc(messagesCollection, {
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  }



  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#f6546a' //salmon pink color
          }
        }}
      />
    )
  }

  render() {
    let { chatBackground } = this.props.route.params;

    return (
      <View style={{ backgroundColor: chatBackground, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null
        }
      </View>
    )
  }
}

