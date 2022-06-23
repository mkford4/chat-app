import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { background } = this.props.route.params;

    return (
      <View style={styles.chatView}>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  chatView: {
    flex: 1,
  }
})