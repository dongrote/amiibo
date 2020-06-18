import React from 'react';
import { Container, Header, Image, Placeholder } from 'semantic-ui-react';

export default props => (
  <Container text>
    {props.characterName
      ? <Header>{props.characterName}</Header>
      : (<Placeholder><Placeholder.Line length='short' /></Placeholder>)}
    {props.imageUrl
      ? <Image src={props.imageUrl} />
      : (<Placeholder style={{ height: 200, width: 150}}>
          <Placeholder.Image rectangular/>
        </Placeholder>)}
  </Container>
);
