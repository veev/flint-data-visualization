import React, { Component } from 'react'

import Map from './Map'
import Timeline from './Timeline'
import Title from './Title'
import TableExampleSelectableInvertedRow from './TableExampleSelectableInvertedRow'
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
        <Map sourceData={incidents} />
        <Title title="Flint Police Dispatches"/>
        <Timeline />
        <TableExampleSelectableInvertedRow />
      </div>
    );
  }
}

export default App;
