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

      // totalTime: this.props.totalTime,
      // currentTime: this.props.currentTime,
      // isSeekable: this.props.isSeekable
      totalTime: 190,
      currentTime: 15,
      isSeekable: true,
      lastSeekStart: 0,
      lastSeekEnd: 0,
    }
    this.timer = null
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  handleTogglePlay(isPlaying) {
    this.setState(Object.assign({}, this.state, { isPlaying: isPlaying }))
    if (isPlaying) {
      this.timer = window.setInterval(() => {
          this.setState(Object.assign(
            {},
            this.state,
            { currentTime: (this.state.currentTime + 1) % this.state.totalTime }
          ))
        }, 1000)
      } else {
        window.clearInterval(this.timer);
      }
  }

  render() {
    const { isPlayable, isPlaying, showPrevious, showNext, hasPrevious, hasNext, totalTime, currentTime, isSeekable, lastSeekStart, lastSeekEnd } = this.state
    // const { totalTime, currentTime, isSeekable, lastSeekStart, lastSeekEnd, lastIntent } = this.state

    return(
      <div className='Timeline'>
        <PlaybackControls
          isPlayable={isPlayable}
          isPlaying={isPlaying}
          onPlaybackChange={isPlaying => this.handleTogglePlay(isPlaying) }
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