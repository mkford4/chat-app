import React from 'react';
import { View, Text, Button, TextInput, ImageBackground, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BackgroundImage from '../assets/Background-Image.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      background: ''
    };
  }

  changeBackground = (newColor) => {
    this.setState({ background: newColor });
  };

  colors = {
    black: '#000000',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE'
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.backgroundImage}
        >
          <View style={styles.titleBox}>
            <Text style={styles.appTitle}>Welcome to the Chat App!</Text>
          </View>

          <View style={styles.box1}>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder='Your Name'
              />
            </View>

            <View style={styles.colorBox}>
              <Text style={styles.chooseColor}>
                {' '}
                Choose Background Color: {' '}
              </Text>
            </View>
            {/* Color options for user to change Chat background */}
            <View style={styles.colorArray}>
              <TouchableOpacity
                style={styles.color1}
                onPress={() => this.changeBackground(this.colors.black)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.color1, styles.color2]}
                onPress={() => this.changeBackground(this.colors.purple)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.color1, styles.color3]}
                onPress={() => this.changeBackground(this.colors.blue)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.color1, styles.color4]}
                onPress={() => this.changeBackground(this.colors.green)}
              ></TouchableOpacity>
            </View>

            {/* sends user to Chat screen page */}
            <Button
              style={styles.chatButton}
              title="Start Chatting"
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                background: this.state.background
              })}
            >
              <Text style={styles.chatText}>
                Start Chatting
              </Text>
            </Button>
          </View>
        </ImageBackground >
      </View >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  titleBox: {
    height: '40%',
    width: '88%',
    paddingTop: 100,
    alignItems: 'center',
  },

  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  box1: {
    height: '46%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'gray',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
  },

  colorBox: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '88%',
  },

  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },

  colorArry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  color1: {
    backgroundColor: '#000000',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color2: {
    backgroundColor: '#474056',
  },

  color3: {
    backgroundColor: '#8A95A5',
  },

  color4: {
    backgroundColor: '#B9C6AE',
  },

  chatButton: {
    width: '88%',
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
  },

  chatText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

})