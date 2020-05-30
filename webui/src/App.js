import React from 'react';
import io from 'socket.io-client';
import {Container, Header} from 'semantic-ui-react';

const socket = io();

function App() {
  return (
    <Container>
      <Header>Amiibo App</Header>
    </Container>
  );
}

export default App;
