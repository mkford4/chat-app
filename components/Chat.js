import React, { useEffect, useState } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import NetInfo from '@react-native-community/netinfo';
import uuid from 'react-native-uuid';

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
    this.onSend = this.onSend.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.state = {
      messages: [],
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
    // TODO: get the user id by collecion
    // const usersCollection = collection(db, 'users');

    const user = {
      name,
      avatar: 'https://placeimg.com/140/140/any',
      // _id: uuid.parse(name)
      _id: 1
    }

    this.setState({ user })

    this.unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log('user status changed: ', user)
      if (!user) {
        signInAnonymously();
      } else {
        this.setState({
          loggedInText: 'Hello there',
        })
      }
    })

    //real time collection data
    this.unsubCol = onSnapshot(messagesCollection, (snapshot) => {
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
    this.unsubCol();
    this.unsubAuth();
  };

  onSend(messages = []) {
    console.log(messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      messages.forEach(this.addMessage);
    });
  }

  addMessage(message) {
    addDoc(messagesCollection, {
      uid: uuid.v4(),
      // _id: message._id,
      text: message.text,
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
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={this.onSend}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null
        }
      </View>
    )
  }
}

