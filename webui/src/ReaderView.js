import React from 'react';
import { Container } from 'semantic-ui-react';
import AmiiboCard from './AmiiboCard';

export default props => (
  <Container text>
    <AmiiboCard imageUrl={props.imageUrl} name={props.characterName} />
  </Container>
);
