import React, { Component } from 'react';
import io from 'socket.io-client';
import {Container, Header, List, Icon, Image} from 'semantic-ui-react';

const socket = io();

class App extends Component {
  state = {
    amiiboImageUrl: null,
    amiiboCharacterName: null,
    readerPresent: false,
    cardPresent: false,
  };

  async fetchSystemState() {
    var res = await fetch('/api/system/state');
    if (res.ok) {
      return await res.json();
    }
    return null;
  }

  async updateSystemState() {
    var state = await this.fetchSystemState();
    if (state) {
      this.setState({
        readerPresent: state.reader.connected,
        cardPresent: state.card.present,
        amiiboImageUrl: state.amiibo ? state.amiibo.imageUrl : null,
        amiiboCharacterName: state.amiibo ? state.amiibo.character.name : null,
      });
    }
  }

  async componentDidMount() {
    socket
      .on('reader', state => {
        this.setState({readerPresent: state.connected});
      })
      .on('card', state => {
        this.setState({cardPresent: state.present});
        if (!state.present) {
          this.setState({amiiboImageUrl: null, amiiboCharacterName: null});
        }
      })
      .on('amiibo', state => {
        this.setState({
          amiiboImageUrl: state ? state.imageUrl : null,
          amiiboCharacterName: state ? state.character.name : null,
        });
      });
    await this.updateSystemState();
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
            <List.Content>Amiibo present: <Icon name={this.state.cardPresent ? 'check circle outline' : 'window close outline'} /></List.Content>
          </List.Item>
          {this.state.amiiboImageUrl && (
            <List.Item>
              <Header>{this.state.amiiboCharacterName}</Header>
              <Image src={this.state.amiiboImageUrl} />
            </List.Item>
          )}
        </List>
      </Container>
    );
  }
}

export default App;
