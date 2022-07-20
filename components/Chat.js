import React, { Component } from 'react';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
    }
    //initialize Firestore
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //stores & receives chat messages
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.referenceMessagesUser = null;
  }

  //AsyncStorage functions
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    //Reference to load messages
    this.referenceChatMessages = firebase.firestore().collection('messages');

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
    });

    //Authenticates user via Firebase
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
      this.referenceMessageUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      this.saveMessages();
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  //stop listening
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      //this.unsubscribe();
    }
  }
  //adds chat messages to Firebase db
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
      this.saveMessages();
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

  //when user is offline, disable sending new messages
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
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

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };


  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let { chatBackground, name } = this.props.route.params;

    return (
      <View style={{ backgroundColor: chatBackground, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar}
          //showUserAvatar={true}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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

