import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import SocketIOClient from 'socket.io-client';

type Props = {};
let socket;
let self;
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    self = this;
    this.state = {
      messages: 'Nothing yet recieved',
    }
    // Creating the socket-client instance will automatically connect to the server.
    socket = SocketIOClient('http://localhost:3000');
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.emit('canal1', 'hola');
    socket.on('canal1', (data) => {
      console.log('TRIGGER SOCKET ON MESSAGE', data.idSocket);
      console.log('message recieved: ', data.message);
      // var oldMessages = this.state.messages;
      // React will automatically rerender the component when a new message is added.
      this.setState({ messages: data.message, idSocket: data.idSocket });
    });
  }

  onPressButton(){
    console.log('SocketOB onPressButton() -> ', socket);
    socket.emit('canal1', 'Hello');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.welcome}>{'Chat app'}</Text>
          <Text style={styles.welcome}>{'Last Message: ' + this.state.messages}</Text>
        </View>
        <View style={styles.container}>
          <TouchableHighlight
            style = {{flex: 1}}
            underlayColor={'transparent'}
            onPress={this.onPressButton}
          >
            <Text style={styles.welcome}>{'Send Hello'}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
