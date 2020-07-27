import React, { Component } from 'react';
import { render } from 'react-dom';
import RangeInput from './RangeInput.tsx';
import './style.css';
import './multirange.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      min: 0,
      max: 1000,
      value: [300, 700]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event});
  }

  handleSubmit(event) {
    alert('A value was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <RangeInput
            className="range-input"
            min={this.state.min}
            max={this.state.max}
            value={this.state.value}
            onChange={this.handleChange}
        />
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}

render(<App />, document.getElementById('root'));
