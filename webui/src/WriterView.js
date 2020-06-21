import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import WriteConfigure from './WriteConfigure';
import WriteLog from './WriteLog';
import AmiiboCard from './AmiiboCard';

class WriterView extends Component {
  state = {
    imageUrl: null,
    filename: null,
    name: null,
    writing: false,
    error: false,
  };

  onAmiiboSelect(amiibo) {
    this.setState({
      imageUrl: amiibo.imageUrl,
      name: amiibo.name,
      filename: amiibo.filename,
    });
  }

  async writeAmiibo() {
    this.setState({writing: true});
    var res = await fetch(`/api/amiibo?amiibo=${encodeURIComponent(this.state.filename)}`, {method: 'POST'});
    this.setState({writing: false, error: !res.ok});
  }

  render() {
    return (
      <Container text>
        <WriteConfigure onAmiiboSelect={amiibo => this.onAmiiboSelect(amiibo)} />
        <AmiiboCard imageUrl={this.state.imageUrl} name={this.state.name} />
        <Button
          fluid
          disabled={!this.props.blankCard}
          positive={this.props.blankCard}
          negative={this.props.presentCard && !this.props.blankCard}
          loading={this.state.writing}
          onClick={() => this.writeAmiibo()}
        >
          Write Amiibo
        </Button>
        <WriteLog entries={this.props.log} />
      </Container>
    );
  }
}

export default WriterView;
