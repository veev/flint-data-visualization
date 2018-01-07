import React, { Component } from 'react'

import Map from './Map'
import Timeline from './Timeline'
import Title from './Title'
// import './styles/App.css'
// import Source from './Source'
// import Layer from './Layer'

import incidents from './data/may5-12-incidents.json'

class App extends Component {

  // state = {
  //   totalTime: 
  // };

  render() {
    return (
      <div className="App">
        <Title className="App-title" title="Flint Police Dispatches"/>
        <Map sourceData={incidents} />
        <Timeline />
      </div>
    );
  }
}

export default App;
