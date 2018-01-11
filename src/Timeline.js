import React, { Component } from 'react'
import { PlaybackControls, ProgressBar } from 'react-player-controls'
//import ProgressBar from './ProgressBar'
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
      // lastSeekStart: 0,
      // lastSeekEnd: 0,
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
    console.log(currentTime, totalTime)
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
          onSeek={time => this.setState({currentTime: time })}
          onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
          onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
          onIntent={time => this.setState(() => ({ lastIntent: time }))}
        />
      </div>
    )
  }

}