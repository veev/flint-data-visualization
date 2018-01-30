import React, { PureComponent } from 'react'
import Title from './Title'

export default class Header extends PureComponent {
  render() {
    console.log('Header rendered')
    return (
      <div className="App-header">
        <Title
          title="Flint Police Dispatches"
        />
        <div className="Nav">
          <a href={'#'}>About</a>
          <a href={'#'}>Credits</a>
        </div>
      </div>
    )
  }
}