import React, { Component } from 'react';
import { Button, Form, Grid, Icon } from 'semantic-ui-react';

class UploadAmiiboForm extends Component {
  state = {
    file: null,
    buttonDisabled: true,
    buttonIcon: 'upload',
    buttonPrimary: false,
    buttonPositive: false,
    buttonNegative: false,
    buttonLoading: false,
  };

  resetUploadButton() {
    this.setState({
      buttonDisabled: true,
      buttonIcon: 'upload',
      buttonPrimary: false,
      buttonPositive: false,
      buttonNegative: false,
      buttonLoading: false,
    });
  }

  enableUploadButton() {
    this.setState({
      buttonDisabled: false,
      buttonIcon: 'upload',
      buttonPrimary: true,
      buttonNegative: false,
      buttonPositive: false,
    });
  }

  errorUploadButton() {
    this.setState({
      buttonPrimary: false,
      buttonNegative: true,
      buttonPositive: false,
      buttonDisabled: true,
      buttonIcon: 'warning sign',
      buttonLoading: false,
    });
  }

  successUploadButton() {
    this.setState({
      buttonPrimary: false,
      buttonPositive: true,
      buttonNegative: false,
      buttonLoading: false,
      buttonDisabled: true,
      buttonIcon: 'thumbs up outline',
    })
  }

  waitingUploadButton() {
    this.setState({
      buttonPrimary: true,
      buttonPositive: false,
      buttonNegative: false,
      buttonDisabled: true,
      buttonIcon: 'spinner',
      buttonLoading: true,
    });
  }

  onChooseFile(file) {
    this.setState({file});
    this.enableUploadButton();
  }

  async onClickUpload() {
    this.waitingUploadButton();
    const data = new FormData();
    data.append('file', this.state.file);
    var res = await fetch('/api/amiibos', {method: 'POST', body: data});
    if (res.ok) {
      this.successUploadButton();
      this.props.onSuccessfulUpload();
    } else {
      this.errorUploadButton();
    }
    setTimeout(() => this.resetUploadButton(), 5000);
  }

  render() {
    return (
      <Grid stackable columns={2} verticalAlign='bottom'>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Field>
                <label>Upload New Amiibo</label>
                <input
                  type='file'
                  onChange={e => this.onChooseFile(e.target.files[0])}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              disabled={this.state.buttonDisabled}
              primary={this.state.buttonPrimary}
              positive={this.state.buttonPositive}
              negative={this.state.buttonNegative}
              onClick={() => this.onClickUpload()}
            >
              <Icon name={this.state.buttonIcon} loading={this.state.buttonLoading} />
              Upload
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default UploadAmiiboForm;
