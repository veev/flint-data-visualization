import React, { Component } from 'react'
import { PlaybackControls, ProgressBar } from 'react-player-controls'
import { PropTypes } from 'prop-types'

export default class Timeline extends Component {

  static propTypes = {
    totalTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      //isPlaying: this.props.isPlaying,
      isPlayable: true,
      showPrevious: false,
      showNext: false,

      totalTime: this.props.totalTime,
      currentTime: this.props.currentTime,
      // isSeekable: this.props.isSeekable
      // totalTime: 190,
      // currentTime: 15,
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

  handleTogglePlay = (playState) => {
    console.log('isPlaying is ', this.props.isPlaying)
    // // this is what toggles the play / pause button
   // debugger;this.setState(Object.assign({}, this.state, { isPlaying: isPlaying }))
   //this.setState({isPlaying: playState})

    // if (this.props.isPlaying) {
    //   this.timer = window.setInterval(() => {
    //     this.setState(Object.assign(
    //       {},
    //       this.state,
    //       { currentTime: (this.props.currentTime + 1) % this.state.totalTime }
    //     ))
    //   }, 1000)
    // } else {
    //   window.clearInterval(this.timer);
    // }
  }

  render() {
    const { isPlayable, showPrevious, showNext, isSeekable } = this.state
    const { currentTime, totalTime, isPlaying } = this.props

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