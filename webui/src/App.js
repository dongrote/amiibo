import React, { Component } from 'react';
import io from 'socket.io-client';
import {Container, Header, List, Icon, Image} from 'semantic-ui-react';
import ReaderView from './ReaderView';
import WriterView from './WriterView';
import ReadWriteToggle from './ReadWriteToggle';

const socket = io();

class App extends Component {
  state = {
    amiiboImageUrl: null,
    amiiboCharacterName: null,
    readerPresent: false,
    cardPresent: false,
    appSetting: null,
    writeLog: [],
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
        appSetting: state.purpose,
      });
    }
  }

  async componentDidMount() {
    socket
      .on('reader', state => {
        this.setState({readerPresent: state.connected});
      })
      .on('purpose', purpose => {
        this.setState({appSetting: purpose});
      })
      .on('card', state => {
        this.setState({cardPresent: state.present});
        if (!state.present) {
          this.setState({amiiboImageUrl: null, amiiboCharacterName: null});
        }
      })
      .on('write-progress', message => {
        var writeLog = this.state.writeLog.slice();
        writeLog.push(message)
        this.setState({writeLog});
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
      <Container text>
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
          <List.Item>
            <List.Content>
              <ReadWriteToggle setting={this.state.appSetting} />
            </List.Content>
          </List.Item>
          <List.Item>
            {this.state.appSetting === 'read' && (
              <ReaderView
                characterName={this.state.amiiboCharacterName}
                imageUrl={this.state.amiiboImageUrl}
              />
            )}
            {this.state.appSetting === 'write' && (
              <WriterView log={this.state.writeLog} />
            )}
          </List.Item>
        </List>
      </Container>
    );
  }
}

export default App;
