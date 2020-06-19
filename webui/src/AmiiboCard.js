import React from 'react';
import { Card, Image, Placeholder } from 'semantic-ui-react';

export default props => (
  <Card>
    {props.imageUrl
      ? <Image src={props.imageUrl} wrapped ui={false} />
      : (<Placeholder style={{ height: 400, width: 300}}><Placeholder.Image rectangular/></Placeholder>)}
    <Card.Content>
      <Card.Header>{props.name || '---'}</Card.Header>
    </Card.Content>
  </Card>
);
