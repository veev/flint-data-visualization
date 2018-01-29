import React, { PureComponent } from 'react'

export default class Title extends PureComponent {
  render() {
    return (
      <div className="App-title">{this.props.title}</div>
    );
  }
}