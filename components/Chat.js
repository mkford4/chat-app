import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  };

  componentDidMount() {
    //renders user's name from Start page to top of chat
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: "You've entered the chat!",
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  };

  /* called when a user sends a message, appends new message to the messages object */
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null
        }
      </View>
    )
  }
}

