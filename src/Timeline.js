import React, { Component } from 'react'
import { PlaybackControls, ProgressBar } from 'react-player-controls'

export default class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false,
      isPlayable: true,
      showPrevious: false,
      hasPrevious: false,
      showNext: false,
      hasNext: false,

      totalTime: this.props.totalTime,
      currentTime: this.props.currentTime,
      isSeekable: this.props.isSeekable
    }
  }

  render() {
    const { isPlayable, isPlaying, showPrevious, showNext, hasPrevious, hasNext } = this.state
    const { totalTime, currentTime, isSeekable, lastSeekStart, lastSeekEnd, lastIntent } = this.state

    return(
      <div>
        <PlaybackControls
          isPlayable={isPlayable}
          isPlaying={isPlaying}
          onPlaybackChange={isPlaying => this.setState(Object.assign({}, this.state, { isPlaying: isPlaying }))}
          showPrevious={false}
          showNext={false}
        />
        <ProgressBar
          totalTime={totalTime}
          currentTime={currentTime}
          isSeekable={isSeekable}
          onSeek={time => this.setState(() => ({ currentTime: time }))}
          onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
          onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
          onIntent={time => this.setState(() => ({ lastIntent: time }))}
        />
      </div>
    )
  }

}