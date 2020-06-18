import React from 'react';
import { Button } from 'semantic-ui-react';

const setPurpose = async purpose => {
  await fetch(`/api/system/purpose?purpose=${encodeURIComponent(purpose)}`, {method: 'POST'});
};

export default props => (
  <Button.Group size='small'>
    {['read', 'write'].map((purpose, k) => (
      <Button active={props.setting === purpose} onClick={() => setPurpose(purpose)}>
        {purpose}
      </Button>
    ))}
  </Button.Group>
);
