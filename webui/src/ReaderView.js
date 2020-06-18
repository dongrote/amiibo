import React from 'react';
import { Container, Header, Image, Placeholder } from 'semantic-ui-react';

export default props => (
  <Container text>
    <Header>{props.characterName || '???'}</Header>
    {props.imageUrl
      ? <Image src={props.imageUrl} />
      : (<Placeholder style={{ height: 200, width: 150}}>
          <Placeholder.Image rectangular/>
        </Placeholder>)}
  </Container>
);
