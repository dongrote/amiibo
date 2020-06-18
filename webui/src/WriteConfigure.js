import React, { Component } from 'react';
import { Form, Dropdown, Message } from 'semantic-ui-react';

class WriteConfigure extends Component {
  state = {
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
    console.log(amiibo);
    var res = await fetch(`/api/system/configure?amiibo=${encodeURIComponent(amiibo)}`);
    this.setState({success: !!res.ok, error: !res.ok, selected: amiibo});
    setTimeout(() => this.setState({success: false, error: false}), 5000);
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
      </Form>
    );
  }
}

export default WriteConfigure;
