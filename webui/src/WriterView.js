import React from 'react';
import { Container } from 'semantic-ui-react';
import WriteConfigure from './WriteConfigure';
import WriteLog from './WriteLog';

export default props => (
  <Container text>
    <WriteConfigure />
    <WriteLog entries={props.log} />
  </Container>
);
