// from https://github.com/justinmc/react-audio-player/

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AudioPlayer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const audio = this.audioEl

    this.updateVolume(this.props.volume)

    audio.addEventListener('error', (e) => {
      console.log('error', e)
      this.props.onError(e)
    })

    audio.addEventListener('canplay', (e) => {
      console.log('canplay')
      this.props.onCanPlay(e)
    })

    audio.addEventListener('canplaythrough', (e) => {
      console.log('canplaythrough')
      this.props.onCanPlayThrough(e)
    })

    // When audio play starts
    audio.addEventListener('play', (e) => {
      //console.log('audio play')
      this.setListenTrack()
      this.props.onPlay(e)
    })

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e) => {
      console.log('audio abort')
      this.clearListenTrack();
      this.props.onAbort(e);
    })

    audio.addEventListener('ended', (e) => {
      console.log('audio ended')
      this.clearListenTrack()
      this.props.onEnded(e)
    })

    // When the user pauses playback
    audio.addEventListener('pause', (e) => {
      console.log('audio pause')
      this.clearListenTrack()
      this.props.onPause(e)
    })

    // When the user drags the time indicator to a new time
    audio.addEventListener('seeked', (e) => {
      console.log('audio seeked')
      this.props.onSeeked(e)
    })

    audio.addEventListener('loadedmetadata', (e) => {
      console.log('loadedmetadata')
      this.props.onLoadedMetadata(e)
    })

    audio.addEventListener('volumechange', (e) => {
      console.log('volumechange')
      this.props.onVolumeChanged(e)
    })
  }

  componentWillReceiveProps(nextProps) {
    this.updateVolume(nextProps.volume)
    // console.log()
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval
      this.listenTracker = setInterval( () => {
        this.props.onListen(this.audioEl.currentTime)
        //console.log(this.audioEl.currentTime)
      }, listenInterval)
    }
  }

  /**
   * Set the volume on the audio element from props
   * @param {Number} volume
   */
  updateVolume(volume) {
    if (typeof volume === 'number' && volume !== this.audioEl.volume) {
      this.audioEl.volume = volume
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  render() {
    const incompatibilityMessage = this.props.children || (
      <p>Your browser does not support the <code>audio</code> element.</p>
    )

    // Set controls to be true by default unless explicity stated otherwise
    const controls = !(this.props.controls === false)

    // Some props should only be added if specified
    const conditionalProps = {}
    if (this.props.controlsList) {
      conditionalProps.controlsList = this.props.controlsList
    }

    return (
      <audio
        autoPlay={this.props.autoPlay}
        className={`audio-manager ${this.props.className}`}
        controls={controls}
        loop={this.props.loop}
        muted={this.props.muted}
        onPlay={this.props.onPlay}
        preload={this.props.preload}
        ref={(ref) => { this.audioEl = ref}}
        src={this.props.src}
        style={this.props.style}
        {...conditionalProps}
      >
        {incompatibilityMessage}
      </audio>
    )
  }
}

AudioPlayer.defaultProps = {
  autoPlay: false,
  children: null,
  className: '',
  controls: false,
  controlsList: '',
  listenInterval: 1000,
  loop: false,
  muted: false,
  onAbort: () => {},
  onCanPlay: () => {},
  onCanPlayThrough: () => {},
  onEnded: () => {},
  onError: () => {},
  onListen: () => {},
  onPause: () => {},
  onPlay: () => {},
  onSeeked: () => {},
  onVolumeChanged: () => {},
  onLoadedMetadata: () => {},
  preload: 'metadata',
  src: null,
  style: {},
  volume: 1.0,
}

AudioPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  controls: PropTypes.bool,
  controlsList: PropTypes.string,
  listenInterval: PropTypes.number,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  onAbort: PropTypes.func,
  onCanPlay: PropTypes.func,
  onCanPlayThrough: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onListen: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onSeeked: PropTypes.func,
  onVolumeChanged: PropTypes.func,
  preload: PropTypes.oneOf(['', 'none', 'metadata', 'auto']),
  src: PropTypes.string, // Not required b/c can use <source>
  style: PropTypes.objectOf(PropTypes.string),
  volume: PropTypes.number,
};