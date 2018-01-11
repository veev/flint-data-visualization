import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Map from './Map'
import Timeline from './Timeline'
import Title from './Title'
import Board from './Board'

// import './styles/App.css'
// import Source from './Source'
// import Layer from './Layer'
import { map_range } from './utils'
import incidents from './data/may5-12-incidents.json'

class App extends Component {
  constructor() {
    super(); // for correct context
    this.state = {
      isPlaying: false,
      currentTime: 1493957314000
      //currentTime: 30
    }

    this.timer = null
    // this.update.bind(this)
  }

  static defaultProps = {
    totalTime: 1494649957000,
    startTS: 1493957314000,
    endTS: 1494649957000,
    // startTS: 30,
    // endTS: 90,
    // totalTime: 90
  }

  componentWillMount() {
    // no access yet to component in React DOM (has yet to render)
    console.log('componentWillMount')
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  _update = (e) => {
    console.log(e.type)
    this.setState({currentEvent: e.type})
  }

  _updateTime = (t) => { // writing an arrow function this way means you don't have to bind things
    // filter incidents / make a copy, whatever

    this.setState({
      currentTime: t,
      //activeIncidents: // TODO - filtered incidents
    })
  }

  handlePlayState = (playState) => {
    // this is what toggles the play / pause button
    this.setState({ isPlaying: playState })

    // need to update progress bar
    if (playState) {
      //console.log('playState is ', playState)
      
      this.timer = window.setInterval(() => {
        this.setState(Object.assign(
          {},
          this.state,
          { currentTime: (this.state.currentTime + 10000000) % this.props.totalTime }
        ))
      }, 1000)
    } else {
      window.clearInterval(this.timer);
    }
  }

  convertTime = (value) => {
    console.log(value)
    let t = map_range(value, this.props.startTS, this.props.endTS, 0, (this.props.endTS - this.props.startTS))
    console.log(t)
    return t
  }



  render() {
    const { isPlaying, currentTime } = this.state
    const { totalTime, startTS, endTS } = this.props
    //console.log(currentTime)
    return (
      <div className="App">
        <Map sourceData={incidents} />
        <Title title="Flint Police Dispatches"/>
        <div className="timeOutput">{currentTime}</div>
        <Timeline
          handlePlay={this.handlePlayState}
          // setTime={this._updateTime}
          //currentTime={map_range(currentTime, startTS, endTS, 0, totalTime)}
          currentTime={this.convertTime(currentTime)}
          totalTime={this.convertTime(totalTime)}
          isPlaying={isPlaying}
          />
        <Board sourceData={incidents} />
      </div>
    );
  }

  componentDidMount() {
    // have access to the component in React DOM (has already rendered)
    //debugger;this._handleClick()
    console.log('componentDidMount')
    console.log(ReactDOM.findDOMNode(this))
  }
}

export default App;
