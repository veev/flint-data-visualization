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
      lastSeekEnd: this.props.currentTime
    }
    // this.timer = null
  }

  componentWillMount() {
    console.log(this.props.isPlaying)
  }

  componentWillUnmount() {
    // window.clearInterval(this.timer)
  }

  render() {
    const { isPlayable, showPrevious, showNext, isSeekable } = this.state
    const { currentTime, totalTime, isPlaying } = this.props
    //console.log(currentTime)
    return(
      <div className='Timeline'>
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
    )
  }

}