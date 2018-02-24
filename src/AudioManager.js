import React, { Component } from 'react'
import AudioPlayer from './AudioPlayer'
//import audioMap from './data/audio-noMoses.json'

export default class AudioManager extends Component {
	constructor(props) {
    super(props)

    this.state = {
      currentKey: '',
      currentIndex: this.props.currentIndex
    }

    //this.audioFiles = null
    //this.sortedAudio = this.props.getSortedAudio(audioMap)
  }

  componentWillMount() {
  // this.audioFiles = this.importAll(require.context('./data/audio', false, /\.(mp3|ogg)$/));

  // for (let key in audioMap) {
  //   console.log(key)
  //   `https://transmission-audio.emerging-response.com:8080/resources/audio/${key}.mp3`
  // }

  // console.log(this.audioFiles)
    
  }

  componentWillReceiveProps(nextProps) {
    // this happens only if playState changes
    // if timeline isPlaying, then find audio file to trigger
    // need to not trigger audio to play once file is playing
    if (nextProps.isPlaying) {
      const t = nextProps.currentTime
      //console.log(t)

      const element = this.props.sortedAudio.find( (a) => {
        const tStart = a.timestamp
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
            this.fetchAudioAndPlay()
            //this.childAudio.audioEl.play()
          })
          // console.log(this.childAudio.audioEl.src)
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

  // importAll = (r) => {
  //   let audio = {};
  //   r.keys().map((item, index) => { audio[item.replace('./', '')] = r(item); });
  //   return audio;
  // }

  pauseAudio = () => {
    //console.log('PAUSED')
    this.childAudio.audioEl.pause()
  }

  fetchAudioAndPlay = () => {
    fetch(`https://s3.amazonaws.com/flint-pd-may/audio/${this.state.currentKey}.mp3`)
    .then(response => response.blob())
    .then(blob => {
      this.childAudio.audioEl.srcObject = blob;
      return this.childAudio.audioEl.play();
    })
    .then(_ => {
      // Video playback started ;)
    })
    .catch(e => {
      // Video playback failed ;(
    })
  }

  render() {

    return (
      <div>
        <AudioPlayer
          className={'audioPlayer'}
          src={`https://s3.amazonaws.com/flint-pd-may/audio/${this.state.currentKey}.mp3`}
          autoPlay={false}
          loop={false}
          muted={false}
          controls={false}
          ref={el => this.childAudio = el}
        />
      </div>
    )
  }
}