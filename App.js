import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, Button, Alert, ScrollView
} from 'react-native';

//imports for navigation
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import screens to navigate to
import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default class HelloWorld extends Component {
  constructor(props) {
    super(props);
  }

  alertMyText(input = []) {
    Alert.alert(input.text);
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start">
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

})