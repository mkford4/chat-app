import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

//installing & initializing Firestore
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCppzbAcmyrnGiJxwTaxOwOMltUA8kpUGs",
  authDomain: "chat-app-c7779.firebaseapp.com",
  projectId: "chat-app-c7779",
  storageBucket: "chat-app-c7779.appspot.com",
  messagingSenderId: "927841570709",
  appId: "1:927841570709:web:8ec0c7becbf3d52d1d709c",
  measurementId: "G-QTY1FEW8PM"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export { db, auth };

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
        image: null,
        location: null,
      },
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  };

  componentDidMount() {
    //renders user's name from Start page to top of chat
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    })

    this.setState({
      uid: user.uid,
      messages: [],
      user: {
        _id: user.uid,
        name: name,
        avatar: "https://placeimg.com/140/140/any",
      },
    });
    this.referenceChatMessages = firebase.firestore()
      .collection("messages")
      .where("uid", "==", this.state.uid);
    this.unsubscribe = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  };

  addMessage() {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  }


  /* called when a user sends a message, appends new message to the messages object */
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
    });
  }

  //gives snapshot of all current collection data
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

    this.setState({
      messages,
    });
  };

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
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null
        }
      </View>
    )
  }
}

