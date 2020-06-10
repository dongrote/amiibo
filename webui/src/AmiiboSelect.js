import React from 'react';
import { Select } from 'semantic-ui-react';

export default props => <Select
  placeholder='Select an Amiibo ...'
  options={props.amiibos}
  onChange={e => props.onSelect(e.target.value)}
/>;
