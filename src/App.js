import React, { Component } from 'react'
import './App.css'

import Map from './Map'
// import Source from './Source'
// import Layer from './Layer'

import incidents from './data/may5-12-incidents.json'

class App extends Component {

  state = {
    sliderValue: 0.5,
    purple: {
      isLayerChecked: false
    }
  };

  render() {
    return (
      <div className="App">
        <Map sourceData={incidents} />
      </div>
    );
  }
}

export default App;
