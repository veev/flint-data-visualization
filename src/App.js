import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import Map from './Map'
import Timeline from './Timeline'
import Header from './Header'
// import Board from './Board'
import CallBoard from './CallBoard'
import Gallery from './Gallery'
import ControlPanel from './ControlPanel'
import AudioManager from './AudioManager'
// import './styles/App.css'
// import Source from './Source'
// import Layer from './Layer'
import { map_range } from './utils'
import data from './data/may5-12-incidents-timestamps-formatted.json'
import posts from './data/postsMay5_12-timezone.json'
import photos from './data/photos-grouped2.json'
import audio from './data/audio.json'

const AUDIO_START_TS = 1493957337000

class App extends Component {
  constructor() {
    super(); // for correct context

    this.state = {
      isPlaying: false,
      wasPlaying: false,
      // currentTime: data['features'][0].properties.unix_timestamp,
      currentTime: AUDIO_START_TS,
      audioIndex: 0,
      hasNextClip: true,
      hasPrevClip: false,
      highlightedBoardIncident: {
        type: 'Feature',
        geometry: { },
        properties: {
          eventNumber: ''
        }
      },
      highlightedMapIncident: {
        type: 'Feature',
        geometry: { },
        properties: {
          eventNumber: ''
        }
      },
      incidentMode: true,
      showLightbox: false,
      showHeatmap: false,
      timeframe: 'Show entire week',
      startTS: AUDIO_START_TS, // this corresponds to the start time of first audio clip
      endTS: data['features'][data['features'].length - 1].properties.unix_end,
      dateRange: [AUDIO_START_TS, data['features'][data['features'].length - 1].properties.unix_end]
      // navState = 'Incidents'
    }

    this.timer = null
    this.sortedAudio = this.getSortedAudio(audio)
  }

  static defaultProps = {
    incidents: data['features'],
    //audio: this.getOrderedAudio(audio),
    //startTS: data['features'][0].properties.unix_timestamp,
    // startTS: 1493957337,
    // endTS: data['features'][data['features'].length - 1].properties.unix_end,
  }

  componentWillMount() {
    // no access yet to component in React DOM (has yet to render)
    // do init stuff here to data?
    // console.log('componentWillMount')
    // console.log(posts)

    // data.features = data.features.map( incident => {
    //   incident.properties.status = "preCall"
    //   incident.properties.elapsedTime = 0
    //   if(incident.properties.unix_onscene) {
    //     incident.properties.waitTime = incident.properties.unix_onscene - incident.properties.unix_timestamp
    //   } else if (incident.properties.unix_end) {
    //     incident.properties.waitTime = incident.properties.unix_end - incident.properties.unix_timestamp
    //   } else {
    //     incident.properties.waitTime = 60 * 60
    //   }

    //   if (incident.properties.waitTime < 0) {
    //     incident.properties.waitTime = 60
    //   }
    //   //console.log(incident.properties.waitTime)
    //   return incident
    // })
    // console.log(data.features)
    // console.log(photos)

    console.log(this.sortedAudio)
    console.log(this.state.currentTime)
    // need this for autoplay
    this.handlePlayState(this.state.isPlaying)
    // need this to find next clip
    this.handleNextAudioClip()

  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  getSortedAudio = (audio) => {
    const audioArray = Object.values(audio)

    audioArray.sort( (a,b) => {
      return +a.timestamp - +b.timestamp
      //return (typeof a.timestamp === 'string') - (typeof b.date === 'string') || a.date - b.date || a.date.localeCompare(b.date);
    })

    return audioArray
  }

  handleVisMode = (value) => {
    //console.log('value', value)
    this.setState({ incidentMode: value })
    this.pausePlayback()
  }

  handleHeatmapToggle = (event) => {
    //console.log('showHeatmap', this.state.showHeatmap)
    this.setState({ showHeatmap: !this.state.showHeatmap })
  }

  handleTimeDropdown = (option) => {
    console.log(option)
    console.log('You selected ', option.label)
    this.setState({ timeframe: option })
    if (option.label === 'Show entire week') {
      const range = [AUDIO_START_TS, data['features'][data['features'].length - 1].properties.unix_end]
      const start = AUDIO_START_TS
      const end = data['features'][data['features'].length - 1].properties.unix_end
      this.setState({ dateRange: range, startTS: start, endTS: end, currentTime: start })
    } else {
      //newStartTime = 
      const day = moment(`${option.label} 2017`)
      console.log(day)
      const start = moment(day).startOf('day')
      const end = moment(day).endOf('day')
      const sTS = moment(start).utcOffset('+04:00').format('x') // lowercase 'x' for millis, uppercase 'X' for seconds
      const eTS = moment(end).utcOffset('+04:00').format('x')
      console.log(day, start, end)
      console.log(sTS, eTS)
      this.setState({ dateRange: [+sTS, +eTS], startTS: +sTS, endTS: +eTS, currentTime: +sTS })
    }
  }

  handlePhotoMarkerClick = (marker) => {
    if (marker.properties.items.length > 0) {
      console.log(marker)
      // this.makePhotoGallery(marker)
      this.setState({ showLightbox: true, contentArray: this.makePhotoGallery(marker) })
    }
  }

  makePhotoGallery = (marker) => {
    const arr = JSON.parse(marker.properties.items)
    console.log(arr)
    return arr
  }

  handleImageClick = (event) => {
    console.debug('clicked on image', event.target, 'at index', this._imageGallery.getCurrentIndex());
  }

  handleImageLoad = (event) => {
    console.debug('loaded image', event.target.src);
  }

  // onSlide = (index) => {
  //   console.debug('slid to index', index);
  // }

  handleGalleryClose = (event) => {
    console.log('close gallery')
    this.setState({ showLightbox: false })
    console.log(this.state.showLightbox)
  }

  pausePlayback = () => {
    window.clearInterval(this.timer)
    this.setState({ isPlaying: false })
  }

  handlePlayState = (playState) => {
    console.log(this.state.currentTime)
    console.log('playButton', this.state.audioIndex)
    setTimeout(() => console.log(`wasPlaying-${this.state.wasPlaying}`), 200)
    setTimeout(() => console.log(`isPlaying-${this.state.isPlaying}`), 200)
    // this is what toggles the play / pause button
    //this.setState({ isPlaying: playState })
    this.setState({ wasPlaying: playState, isPlaying: playState })
    
    // need to update progress bar
    if (playState) {
      //console.log('playState is ', playState)
      
      this.timer = window.setInterval(() => {
        this.setState(Object.assign(
          {},
          this.state,
          { currentTime: (this.state.currentTime + 1000) % this.state.endTS }
        ))
      }, 1000)
    } else {
      window.clearInterval(this.timer);
    }
  }

  getNearestTimestamp = (time) => {

    //return index
  }

  handleSeekChange = (time) => {
    console.log(`seeking-${this.state.isPlaying}`)
    
    const ts = this.unconvertTime(time)
    console.log('seek change', ts)
    this.setState({ currentTime: ts })
    this.updateAudioIndex(ts)
  }

  handleSeekStart = () => {
    console.log('seek start')
    console.log(`wasPlaying-${this.state.wasPlaying}`)
    console.log(`isPlaying-${this.state.isPlaying}`)
    this.setState({ isPlaying: false })
  }

  handleSeekEnd = () => {
    console.log('seek end')
    if (this.state.wasPlaying) {
      this.setState({ isPlaying: true })
    }
  }

  handleNextAudioClip = () => {
    console.log('nextButton', this.state.audioIndex)
    const temp = this.state.audioIndex + 1
    if (this.state.audioIndex < this.sortedAudio.length - 1) {
      this.setState({ audioIndex: temp }, this.updateCurrentTime(temp))
    }
    this.audioChild && this.audioChild.pauseAudio()
  }

  handlePrevAudioClip = () => {
    console.log('prevButton', this.state.audioIndex)
    const temp = this.state.audioIndex - 1
    if (this.state.audioIndex > 0) {
      this.setState({ audioIndex: temp }, this.updateCurrentTime(temp))
    }    
    this.audioChild && this.audioChild.pauseAudio()
  }

  updateNextPrevButtons = (index) => {
    if (index <= 0) {
      this.setState({ hasPrevClip: false })
    } else {
      this.setState({ hasPrevClip: true })
    }

    if (index >= this.sortedAudio.length - 1) {
      this.setState({ hasNextClip: false })
    } else {
      this.setState({ hasNextClip: true })
    }
  }

  updateAudioIndex = (time) => {
    console.log(time)
    const t = Math.floor(time)
    // TODO! Not sure why this works, but checking if currentTime was
    // greater than element's startTime didn't work
    let newIndex = this.sortedAudio.findIndex(element => {
      const tStart = Math.floor(element.timestamp)
      return t <= tStart
    })
    const timeBefore =  this.sortedAudio[newIndex - 1]
    const timeAfter =  this.sortedAudio[newIndex]
    if (Math.abs(t - timeBefore.timestamp) < Math.abs(t - timeAfter.timestamp)) {
      // index is timeBefore
      newIndex = newIndex - 1
    } 

    if (newIndex < 0) {
      newIndex = this.sortedAudio.length - 1
    }
    console.log('newIndex', newIndex)
    this.setState({ audioIndex: newIndex }, this.updateNextPrevButtons(newIndex))
    this.updateCurrentTime(newIndex)
  }

  updateCurrentTime = (index) => {
    console.log(index)
    const newTime = this.sortedAudio[index].timestamp
    console.log('updateCurrentTime', newTime)
    this.setState({ currentTime: newTime },  this.updateNextPrevButtons(index))
  }

  convertTime = (value) => {
    // convert time so that start is 0 (what progress bar likes)
    return map_range(value, this.state.startTS, this.state.endTS, 0, (this.state.endTS - this.state.startTS))
  }

  unconvertTime = (value) => {
    // unconvert time so that user seeking will send the correct timestamp
    // back to the main app from the Timeline
    return map_range(value, 0, (this.state.endTS - this.state.startTS), this.state.startTS, this.state.endTS)
  }

  handleBoardHighlightChange = (feature) => {
    //console.log(feature)
    this.setState({ highlightedBoardIncident: feature })
  }

  handleMapRolloverChange = (feature) => {
    //console.log(feature)
    this.setState({ highlightedMapIncident: feature })
  }

  filterIncidents = (cTime) => {
    const filteredPresent = this.props.incidents.filter( feature => {
      feature = this.updateIncidentStatus(cTime, feature)
      feature = this.updateElapsedTime(cTime, feature)
      const strt = feature.properties.unix_timestamp
      const end = feature.properties.unix_end
      //this.updateIncidentStatus(cTime, feature)
      //console.log("current time: ", formatTime(time), "start time: ", formatTime(strt), "end time: ", formatTime(end));
      //if (cTime >= strt && cTime <= end) {
        //console.log(feature);
        //return feature.properties.eventNumber;
      //}
      return (cTime >= strt && cTime <= end)
    })
    //console.log(filteredPresent)
    return filteredPresent
  }

  updateElapsedTime = (time, feature) => {
    //console.log(time)
    if (feature.properties.unix_timestamp && feature.properties.unix_end) {
      if (+time >= +feature.properties.unix_timestamp) {
        feature.properties.elapsedTime = Math.floor((+time - +feature.properties.unix_timestamp) / 1000)
      }
    } else {
      feature.properties.elapsedTime = 0
    }
    return feature
  }

  updateIncidentStatus = (time, feature) => {
    const strt = feature.properties.unix_timestamp;
    const end = feature.properties.unix_end;
    
    if (feature.properties.unix_onscene && feature.properties.unix_dispatch) {
      const dispatchT = feature.properties.unix_dispatch;
      const onSceneT = feature.properties.unix_onscene;
      //console.log(+time, dispatchT, onSceneT);

      if (+time >= strt && +time <= dispatchT) {
        feature.properties.status = "notAssigned";
      } else if (+time >= dispatchT && +time <= onSceneT) {
        feature.properties.status = "waitingforUnit";
      } else if (+time >= onSceneT && +time <= end) {
        feature.properties.status = "onScene";
      } else if (+time >= end) {
        feature.properties.status = "ended";
      }
    } else {
      // console.log(feature)
      if (+time >= strt && +time <= end) {
        feature.properties.status = "notAssigned";
      } else if (+time >= end) {
        feature.properties.status = "ended";
      }
    }

    //console.log(feature)
    return feature
}


  render() {
    const { 
      isPlaying,
      currentTime,
      audioIndex,
      highlightedBoardIncident,
      highlightedMapIncident,
      showLightbox,
      incidentMode,
      showHeatmap,
      hasNextClip,
      hasPrevClip,
      timeframe,
      dateRange,
      startTS,
      endTS
    } = this.state
    // const { endTS } = this.props
    //const formattedTime = new Date(currentTime * 1000).toString().substring(0, 24)
    const formattedTime = moment(currentTime).format('MMM Do YYYY, h:mm:ss A');
   
    //window.convertTime = this.convertTime;

    return (
      <div className="App">
        <Header />
        <Map 
          staticData={data}
          activeData={this.filterIncidents(currentTime)}
          currentTime={currentTime}
          handleHighlight={this.handleMapRolloverChange}
          boardHighlightedFeature={highlightedBoardIncident}
          photoData={photos}
          handlePhotos={this.handlePhotoMarkerClick}
          viewMode={incidentMode}
          showHeatmap={showHeatmap}
        />
        <ControlPanel 
          handleToggle={this.handleVisMode}
          viewMode={incidentMode}
          showHeatmap={showHeatmap}
          handleHeatmapToggle={this.handleHeatmapToggle}
          pausePlay={this.pausePlayback}
          handleDropdown={this.handleTimeDropdown}
          timeframe={timeframe}
        />
        { incidentMode ?
          <div>
          <Timeline
            handlePlay={this.handlePlayState}
            handleSeek={this.handleSeekChange}
            handleSeekStart={this.handleSeekStart}
            handleSeekEnd={this.handleSeekEnd}
            handleNextClip={this.handleNextAudioClip}
            handlePrevClip={this.handlePrevAudioClip}
            hasNext={hasNextClip}
            hasPrevious={hasPrevClip}
            // setTime={this._updateTime}
            //currentTime={map_range(currentTime, startTS, endTS, 0, totalTime)}
            formattedTime={formattedTime}
            currentTime={this.convertTime(currentTime)}
            unconvertTime={this.unconvertTime}
            totalTime={this.convertTime(endTS)}
            isPlaying={isPlaying}
            staticData={data}
            activeData={this.filterIncidents(currentTime)}
            dateRange={dateRange}
          />
          <CallBoard
            activeData={this.filterIncidents(currentTime)}
            currentTime={currentTime}
            handleHighlight={this.handleBoardHighlightChange}
            mapHighlightedFeature={highlightedMapIncident}
            boardHighlightedFeature={highlightedBoardIncident}
            postData={posts}
          /></div> : null
        }
        { showLightbox ?
          <div 
            className="lightBox-wrapper"
            >
              <Gallery
                ref={i => this._imageGallery = i}
                items={this.state.contentArray}
                onClick={this.handleImageClick}
                onImageLoad={this.handleImageLoad}
                onSlide={this.onSlide}
                additionalClass="app-image-gallery"
                closeGallery={this.handleGalleryClose}
                infinite={true}
              />
          </div> :
          null
        }
        <AudioManager
          ref={audio => { this.audioChild = audio; }}
          currentTime={currentTime}
          isPlaying={isPlaying}
          sortedAudio={this.sortedAudio}
          currentIndex={audioIndex}
        />
      </div>
    );
  }

  componentDidMount() {
    // have access to the component in React DOM (has already rendered)
    //debugger;this._handleClick()
    console.log('componentDidMount')
    console.log(ReactDOM.findDOMNode(this))
  }
}

export default App;
