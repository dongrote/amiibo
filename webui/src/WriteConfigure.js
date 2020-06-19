import React, { Component } from 'react';
import { Button, Form, Dropdown, Message, Icon } from 'semantic-ui-react';

class WriteConfigure extends Component {
  state = {
    uploadFile: null,
    selected: null,
    availableAmiibos: [],
    success: false,
    error: false,
  };

  async populateDropdown() {
    var res = await fetch('/api/amiibos');
    if (res.ok) {
      var json = await res.json();
      this.setState({availableAmiibos: json, selected: null});
    }
  }

  async selectAmiibo(amiibo) {
    var res = await fetch(`/api/system/configure?amiibo=${encodeURIComponent(amiibo)}`);
    this.setState({success: !!res.ok, error: !res.ok, selected: res.ok ? amiibo : null});
    setTimeout(() => this.setState({success: false, error: false}), 5000);
  }

  onChooseUploadFile(file) {
    this.setState({uploadFile: file});
  }

  async uploadAmiibo() {
    console.log(this.state.uploadFile);
    const data = new FormData();
    data.append('file', this.state.uploadFile);
    var res = await fetch('/api/amiibos', {
      method: 'POST',
      body: data,
    });
    if (res.ok) {
      this.setState({uploadFile: null});
      await this.populateDropdown();
    }
  }

  async componentDidMount() {
    await this.populateDropdown();
  }

  render() {
    return (
      <Form success={this.state.success} error={this.state.error}>
        <Form.Field>
          <label>Amiibo</label>
          <Dropdown
            placeholder='Select an Amiibo'
            selection
            value={this.state.selected}
            options={this.state.availableAmiibos.map((v, k) => ({key: k, value: v, text: v}))}
            onChange={(e, data) => this.selectAmiibo(data.value)}
          />
          <Message success content='Amiibo selected successfully' />
          <Message error content='Error selecting Amiibo' />
        </Form.Field>
        <Form.Field>
          <label>Upload New Amiibo</label>
          <input
            type='file'
            onChange={e => this.onChooseUploadFile(e.target.files[0])}
          />
          <Button
            disabled={this.state.uploadFile === null}
            onClick={() => this.uploadAmiibo()}
          >
            <Icon name='upload' />
            Upload
          </Button>
        </Form.Field>
      </Form>
    );
  }
}

export default WriteConfigure;
