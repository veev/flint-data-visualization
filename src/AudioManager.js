import React, { Component } from 'react'
import AudioPlayer from './AudioPlayer'
import audioMap from './data/flint-transcribed.json'
import audioFile  from './data/audio/bcfy7811_1493957342093_0001.mp3'

export default class AudioManager extends Component {
	constructor(props) {
    super(props)

    this.state = {
      currentKey: 'bcfy7811_1493957342093_0001.mp3',
      currentIndex: 0
    }

    this.audioFiles = null
    this.audioObjects = Object.values(audioMap)
  }

  componentWillMount() {
    //const audioObjects = Object.values(audioMap)
    console.log(this.audioObjects)
    console.log(new Date(this.audioObjects[this.state.currentIndex].date))
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
      console.log(t)

      const element = this.audioObjects.find( (a) => {
        const tStart = new Date(a.date).getTime()
        const tEnd = tStart + a.length
        return (t >= tStart && t <= tEnd)
      })
      //console.log(element)

      if (element && this.childAudio.audioEl.paused) {
        console.log(element.id)
        //this.childAudio.audioEl.src = element.id
        this.setState({ currentKey: `${element.id}.mp3` }, () => {
          this.childAudio.audioEl.pause()
          this.childAudio.audioEl.load()
          this.childAudio.audioEl.play()
        })
        console.log(this.childAudio.audioEl.src)
        // this.childAudio.audioEl.src = this.audioFiles[this.state.currentKey]
        // console.log(this.childAudio.audioEl.src)
        //this.childAudio.audioEl.load()
        //this.childAudio.audioEl.play()
      }

      // this.audioObjects.forEach( a => {
      //   const ts = new Date(a.date).getTime()
      //   if (t >= ts) {
      //     // play audio file
      //     console.log('play audio file', a.id)
      //     break;
      //   }
      // })
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

  render() {
    const { currentTime, isPlaying } = this.props

    return (
      <div>
        <AudioPlayer
          className={'audioPlayer'}
          src={this.audioFiles[this.state.currentKey]}
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