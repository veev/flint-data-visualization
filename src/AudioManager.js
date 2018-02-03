import React, { Component } from 'react'
import AudioPlayer from './AudioPlayer'
import audioMap from './data/flint-transcribed.json'
import audioFile  from './data/audio/bcfy7811_1493957342093_0001.mp3'

export default class AudioManager extends Component {
	constructor(props) {
    super(props)

    this.state = {
      currentKey: '',
      currentIndex: this.props.currentIndex
    }

    this.audioFiles = null
    //this.sortedAudio = this.props.getSortedAudio(audioMap)
  }

  componentWillMount() {
    //console.log(this.sortedAudio)
    //console.log(new Date(this.sortedAudio[this.state.currentIndex].date))
    console.log(new Date(this.props.currentTime * 1000))

    this.audioFiles = this.importAll(require.context('./data/audio', false, /\.(mp3|ogg)$/));

    console.log(this.audioFiles)
    
  }

  componentWillReceiveProps(nextProps) {

    // this happens only if playState changes
    // good place to trigger playback?
    if (this.props.isPlaying !== nextProps.isPlaying) {
      // console.log("first", nextProps.currentTime * 1000)
      // console.log(nextProps.isPlaying)

    } else {
      // assume that playback is still updating
      //console.log(nextProps.currentTime * 1000)
    }

    // if timeline isPlaying, then find audio file to trigger
    // need to not trigger audio to play once file is playing
    if (nextProps.isPlaying) {
      const t = new Date(nextProps.currentTime * 1000)
      //console.log(t)

      const element = this.props.sortedAudio.find( (a) => {
        const tStart = new Date(a.date).getTime()
        const tEnd = tStart + a.length
        return (t >= tStart && t <= tEnd)
      })
      //console.log(element)

      if (element && this.childAudio.audioEl.paused) {

        // check to see if currentKey and element id are the same
        // if they are, play the file back at the right timestamp
        // not from the beginning
        // console.log(element.id)
        // console.log(this.state.currentKey)

        if (element.id !== this.state.currentKey) {
          // play back new file from the beginning
          this.setState({ currentKey: element.id }, () => {
            this.childAudio.audioEl.pause()
            this.childAudio.audioEl.load()
            this.childAudio.audioEl.play()
          })
          //console.log(this.childAudio.audioEl.src)
        } else {
          // play back same file from current time
          // we don't need to update currentKey
          // just to update audio currentTime
          // console.log(this.childAudio.audioEl.src)
          // console.log(this.childAudio.audioEl.currentTime)
          this.childAudio.audioEl.play()
        }

        
      }

    } else {
      // isPlaying is false, pause audio
      this.childAudio.audioEl.pause()
    }
  }

  importAll = (r) => {
    let audio = {};
    r.keys().map((item, index) => { audio[item.replace('./', '')] = r(item); });
    return audio;
  }

  audioOnPlay = (e) => {
    console.log('audio play')
  }

  pauseAudio = () => {
    //console.log('PAUSED')
    this.childAudio.audioEl.pause()
  }

  render() {
    const { currentTime, isPlaying } = this.props

    return (
      <div>
        <AudioPlayer
          className={'audioPlayer'}
          src={this.audioFiles[`${this.state.currentKey}.mp3`]}
          autoPlay={false}
          loop={false}
          muted={false}
          controls={false}
          onPlay={this.audioOnPlay}
          ref={el => this.childAudio = el}
        />
      </div>
    )
  }
}