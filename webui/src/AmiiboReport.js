import React from 'react';
import { List, Grid, Image } from 'semantic-ui-react';
import AmiiboReportItem from './AmiiboReportItem';

export default props => (
  <Grid stackable columns={2}>
    <Grid.Row>
      <Grid.Column>
        <List divided relaxed>
          <AmiiboReportItem title='File Size' report={{
            ok: props.sizeReport.ok,
            error: props.sizeReport.error,
            value: props.sizeReport.value ? `${props.sizeReport.value} bytes` : props.sizeReport.value,
          }} />
          <AmiiboReportItem title='Blank Tag' report={{
            ok: props.blankReport.ok,
            error: props.blankReport.error,
            value: props.blankReport.value.toString(),
          }} />
          <AmiiboReportItem title='Amiibo ID' report={props.idReport} />
          <AmiiboReportItem title='Character Name' report={props.nameReport} />
        </List>
      </Grid.Column>
      <Grid.Column verticalAlign='middle'>
        {props.imageUrlReport.ok ? <Image src={props.imageUrlReport.value} /> : 'No image found.'}
      </Grid.Column>
    </Grid.Row>
  </Grid>
);
