import React, { Component } from 'react'

import Map from './Map'
import Timeline from './Timeline'
import Title from './Title'
import Board from './Board'

// import './styles/App.css'
// import Source from './Source'
// import Layer from './Layer'

import incidents from './data/may5-12-incidents.json'

class App extends Component {
  constructor() {
    super(); // for correct context
    this.state = {
      isPlaying: false
    }
    this.update.bind(this)
  }

  componentWillMount() {
    // no access yet to component in React DOM (has yet to render)
    console.log('componentWillMount')
  }

  update (e) {
    console.log(e.type)
    this.setState({currentEvent: e.type})
  }

  render() {
    console.log('render')
    return (
      <div className="App">
        <Map sourceData={incidents} />
        <Title title="Flint Police Dispatches"/>
        <Timeline onClick={this.update}/>
        <Board />
        <h1>{this.state.currentEvent}</h1>
      </div>
    );
  }

  componentDidMount() {
    // have access to the component in React DOM (has already rendered)
  }
}

export default App;
