import React, { Component } from 'react';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, Text, StyleSheet } from 'react-native';

//Firestore
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCppzbAcmyrnGiJxwTaxOwOMltUA8kpUGs",
  authDomain: "chat-app-c7779.firebaseapp.com",
  projectId: "chat-app-c7779",
  storageBucket: "chat-app-c7779.appspot.com",
  messagingSenderId: "927841570709",
  appId: "1:927841570709:web:8ec0c7becbf3d52d1d709c",
  measurementId: "G-QTY1FEW8PM"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      }
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.referenceMessagesUser = null;
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
      });
      this.referenceMessageUser = firebase.firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  //stop listening
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages: messages
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
    let { chatBackground, name } = this.props.route.params;

    return (
      <View style={{ backgroundColor: chatBackground, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: this.state.user._id,
            name: name,
            avatar: this.state.user.avatar,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null
        }
      </View>
    )
  }
}

