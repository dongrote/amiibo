import React from 'react';
import { Container } from 'semantic-ui-react';
import WriteConfigure from './WriteConfigure';
import WriteLog from './WriteLog';
import AmiiboCard from './AmiiboCard';

export default props => (
  <Container text>
    <WriteConfigure />
    <AmiiboCard imageUrl={props.imageUrl} name={props.characterName} />
    <WriteLog entries={props.log} />
  </Container>
);
