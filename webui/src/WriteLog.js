import React from 'react';
import { List } from 'semantic-ui-react';

export default props => (
  <List divided>
    {props.entries.length === 0 && (
      <List.Item>
        <List.Content>No log entries.</List.Content>
      </List.Item>
    )}
    {props.entries.map((e, k) => (
      <List.Item key={k}>
        <List.Content>{e}</List.Content>
      </List.Item>
    ))}
  </List>
);
