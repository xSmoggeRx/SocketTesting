import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight, TextInput} from 'react-native';
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
      channelToConnect: '',
      idSocket: null,
    }
    // Creating the socket-client instance will automatically connect to the server.
    socket = SocketIOClient('http://192.168.208.41:3000');

    socket.on('login', (data) => {
      console.log('TRIGGER SOCKET ON MESSAGE', data.idSocket);
      console.log('message recieved: ', data.message);
      this.setState({ messages: data.message, idSocket: data.idSocket });
      socket.on('channelRequest', (channelName)=>{
        console.log('Channel connection succeed to '+channelName);
        self.setState({connectedChanel: channelName});
        socket.on(channelName, function(dataRecieved){
          console.log('message recieved in channel '+ channelName + ': '+ dataRecieved);
          self.setState({lastMessageInChat: dataRecieved});
        });
      });
    });
  }

  connectToChannel(){
    const { channelToConnect } = self.state;
    if(channelToConnect.length > 0){
      console.log('channel: ' + channelToConnect);
      socket.emit('channelRequest', channelToConnect);
      self.setState({channelToConnect: ''});
    }
  }

  sendToChat(){
    const { messageToSend, connectedChanel } = self.state;
    console.log('sendToChat trigger', messageToSend, connectedChanel);
    if(messageToSend.length > 0){
      socket.emit(connectedChanel, messageToSend);
      self.setState({messageToSend: ''});
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.1}}>
        </View>
        <View style={{flex: 0.8}}>
          <View style={{flex: 0.1}}>
            <Text>{'Socket app'}</Text>
          </View>
          <View style={{flex: 0.3}}>
            <Text>{'Insert a channel to connect'}</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => self.setState({channelToConnect: text})}
              value={self.state.channelToConnect}
            />
            <TouchableHighlight
              style = {{flex: 1,}}
              underlayColor={'transparent'}
              onPress={self.connectToChannel}
            >
              <Text>{'Start'}</Text>
            </TouchableHighlight>
          </View>
          <View style={{flex: 0.1}}>
            <Text>{self.state.connectedChanel != null ? ('SocketChat chanel: ' + self.state.connectedChanel) : 'Here will be displayed the Channel Name'}</Text>
          </View>
          <View style={{flex: 0.4}}>
            <Text>{'Last message'}</Text>
            <Text>{self.state.lastMessageInChat}</Text>
          </View>
        </View>
        <View style={{flex: 0.1}}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => self.setState({messageToSend: text})}
            value={self.state.messageToSend}
          />
          <TouchableHighlight
            style = {{flex: 1,}}
            underlayColor={'transparent'}
            onPress={self.sendToChat}
          >
            <Text>{'Send'}</Text>
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
