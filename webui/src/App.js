import React, { Component } from 'react';
import io from 'socket.io-client';
import {Container, Header, List, Icon} from 'semantic-ui-react';

const socket = io();

class App extends Component {
  state = {
    readerPresent: false,
    cardPresent: false,
  };
  componentDidMount() {
    socket
      .on('reader', state => {
        this.setState({readerPresent: state.connected});
      })
      .on('card', state => {
        this.setState({cardPresent: state.present});
      });
  }
  render() {
    return (
      <Container>
        <Header>Amiibo App</Header>
        <List divided>
          <List.Item>
            <List.Icon name='feed' />
            <List.Content>Reader present: <Icon name={this.state.readerPresent ? 'check circle outline' : 'window close outline'} /></List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='id card' />
            <List.Content>Card present: <Icon name={this.state.cardPresent ? 'check circle outline' : 'window close outline'} /></List.Content>
          </List.Item>
        </List>
      </Container>
    );
  }
}

export default App;
