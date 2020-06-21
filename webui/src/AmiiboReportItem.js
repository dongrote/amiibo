import React from 'react';
import { List } from 'semantic-ui-react';

const icon = report => {
  if (report.ok) return 'check circle';
  if (report.error) return 'warning circle';
  return 'question circle';
};

const color = report => {
  if (report.ok) return 'green';
  if (report.error) return 'red';
  return undefined;
};

export default props => (
  <List.Item>
    <List.Icon verticalAlign='middle' name={icon(props.report)} color={color(props.report)} />
    <List.Content>
      <List.Header>{props.title}</List.Header>
      <List.Description>{props.report.ok ? props.report.value : props.report.error}</List.Description>
    </List.Content>
  </List.Item>
);
