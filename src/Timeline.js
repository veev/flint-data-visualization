import React, { Component } from 'react'
import { PlaybackControls, ProgressBar } from 'react-player-controls'
//import ProgressBar from './ProgressBar'
import GraphArea from './GraphArea'
import { PropTypes } from 'prop-types'

export default class Timeline extends Component {

  static propTypes = {
    totalTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: this.props.isPlaying,
      isPlayable: true,
      showPrevious: false,
      showNext: false,

      totalTime: this.props.totalTime,
      currentTime: this.props.currentTime,
      isSeekable: true,
      lastSeekStart: this.props.currentTime,
      lastSeekEnd: this.props.currentTime,

      graphWidth: 900,
      graphHeight: 0
    }
    // this.timer = null
  }

  componentWillMount() {
    //console.log(this.props.isPlaying)
    //this.mungeData(this.props.staticData)
    // const width = this.graphAreaDiv.clientWidth
    // const height = this.graphAreaDiv.clientHeight
    // this.setState({ graphWidth: width, graphHeight: height })

  }

  mungeData = (data) => {
    console.log(data.features)
  }

  componentDidMount() {
    const width = this.graphAreaDiv.clientWidth
    const height = this.graphAreaDiv.clientHeight
    this.setState({ graphWidth: width, graphHeight: height })
  }

  componentWillUnmount() {
    // window.clearInterval(this.timer)
  }

  render() {
    const { isPlayable, showPrevious, showNext, isSeekable, graphWidth, graphHeight } = this.state
    const { currentTime, totalTime, isPlaying, staticData, formattedTime } = this.props
    //console.log(currentTime)
    return(
      <div className="Timeline">
        <div className="timeOutput">{formattedTime}</div>
        <div className="GraphArea"
          ref={(graphAreaDiv) => this.graphAreaDiv = graphAreaDiv} >
          <GraphArea
            data={staticData}
            size={[graphWidth, graphHeight]}
            height={100}
            currentTime={currentTime}
            unconvertTime={this.props.unconvertTime}
          />
        </div>
        <div className="ControlArea">
          <PlaybackControls
            isPlayable={isPlayable}
            isPlaying={isPlaying}
            onPlaybackChange={this.props.handlePlay}
            showPrevious={showPrevious}
            showNext={showNext}
            />
          <ProgressBar
            totalTime={totalTime}
            currentTime={currentTime}
            isSeekable={isSeekable}
            onSeek={this.props.handleSeek}
            onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
            onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
          />
        </div>
      </div>
    )
  }

}