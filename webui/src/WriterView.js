import React from 'react';
import { Container } from 'semantic-ui-react';
import WriteLog from './WriteLog';

export default props => (
  <Container text>
    <WriteLog entries={props.log} />
  </Container>
);
