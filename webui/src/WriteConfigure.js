import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

class WriteConfigure extends Component {
  state = {selected: null, availableAmiibos: []};

  async populateDropdown() {
    var res = await fetch('/api/amiibos');
    if (res.ok) {
      var json = await res.json();
      this.setState({availableAmiibos: json});
    }
  }

  async componentDidMount() {
    await this.populateDropdown();
  }

  render() {
    return (
      <Dropdown
        placeholder='Select an Amiibo'
        selection={this.state.selected}
        options={this.state.availableAmiibos.map((v, k) => ({key: k, value: v, text: v}))}
        onChange={e => this.setState({selected: e.target.value})}
      />
    );
  }
}

export default WriteConfigure;
