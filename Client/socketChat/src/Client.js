import React from 'react';
import SocketIOClient from 'socket.io-client';

class Main extends React.Component {
  constructor(props) {
    super(props);

    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient('http://localhost:3000');
    socket.on('message', (message) => {
      var oldMessages = this.state.messages;
      // React will automatically rerender the component when a new message is added.
      this.setState({ messages: oldMessages.concat(message) });
    });
  }
}

module.exports = Main;
