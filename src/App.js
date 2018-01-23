import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Map from './Map'
import Timeline from './Timeline'
import Header from './Header'
// import Board from './Board'
import CallBoard from './CallBoard'
import Gallery from './Gallery'
import ControlPanel from './ControlPanel'
// import './styles/App.css'
// import Source from './Source'
// import Layer from './Layer'
import { map_range } from './utils'
import data from './data/may5-12-incidents-timestamps.json'
import posts from './data/postsMay5_12-timezone.json'
import photos from './data/photos-grouped2.json'

// class Board extends React.Component {
//     shouldComponentUpdate(nextProps, nextState) {

//     }
//   }
// }

// import BoardMaker from 'boardmaker'

// const Board = BoardMaker(staticStuff)


// <Board ts={...} />

class App extends Component {
  constructor() {
    super(); // for correct context

    this.state = {
      isPlaying: false,
      currentTime: data['features'][0].properties.unix_timestamp,
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
      contentArray: [
      ]
      // navState = 'Incidents'
    }

    this.timer = null
  }

  static defaultProps = {
    incidents: data['features'],
    startTS: data['features'][0].properties.unix_timestamp,
    endTS: data['features'][data['features'].length - 1].properties.unix_end,
  }

  componentWillMount() {
    // no access yet to component in React DOM (has yet to render)
    // do init stuff here to data?
    console.log('componentWillMount')
    console.log(posts)

    data.features = data.features.map( incident => {
      incident.properties.status = "preCall"
      return incident
    })
    console.log(data.features)
    console.log(photos)
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  // _update = (e) => {
  //   console.log(e.type)
  //   this.setState({currentEvent: e.type})
  // }

  // _updateTime = (t) => { // writing an arrow function this way means you don't have to bind things
  //   // filter incidents / make a copy, whatever

  //   this.setState({
  //     currentTime: t,
  //     //activeIncidents: // TODO - filtered incidents
  //   })
  // }

  handleVisMode = (value) => {
    console.log('value', value)
    this.setState({ incidentMode: value })
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

  handlePlayState = (playState) => {
    // this is what toggles the play / pause button
    this.setState({ isPlaying: playState })

    // need to update progress bar
    if (playState) {
      //console.log('playState is ', playState)
      
      this.timer = window.setInterval(() => {
        this.setState(Object.assign(
          {},
          this.state,
          { currentTime: (this.state.currentTime + 100) % this.props.endTS }
        ))
      }, 1000)
    } else {
      window.clearInterval(this.timer);
    }
  }

  handleSeekChange = (time) => {
    const ts = this.unconvertTime(time)
    this.setState({ currentTime: ts })
  }

  convertTime = (value) => {
    // convert time so that start is 0 (what progress bar likes)
    return map_range(value, this.props.startTS, this.props.endTS, 0, (this.props.endTS - this.props.startTS))
  }

  unconvertTime = (value) => {
    // unconvert time so that user seeking will send the correct timestamp
    // back to the main app from the Timeline
    return map_range(value, 0, (this.props.endTS - this.props.startTS), this.props.startTS, this.props.endTS)
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
    let filteredPresent = this.props.incidents.filter( feature => {
      feature = this.updateIncidentStatus(cTime, feature)
      let strt = feature.properties.unix_timestamp
      let end = feature.properties.unix_end
      //this.updateIncidentStatus(cTime, feature)
      //console.log("current time: ", formatTime(time), "start time: ", formatTime(strt), "end time: ", formatTime(end));
      //if (cTime >= strt && cTime <= end) {
        //console.log(feature);
        //return feature.properties.eventNumber;
      //}
      return (cTime >= strt && cTime <= end)
    })
    console.log(filteredPresent)
    return filteredPresent
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
  
  //console.log(answeredGeoJson.features);
  //map.getSource('answeredIncidents').setData(answeredGeoJson);
}


  render() {
    const { isPlaying, currentTime, highlightedBoardIncident, highlightedMapIncident, showLightbox, incidentMode } = this.state
    const { endTS } = this.props
    const formattedTime = new Date(currentTime * 1000).toString().substring(0, 24)
   
    window.convertTime = this.convertTime;

    return (
      <div className="App">
        <Header />
        <Map 
          staticData={data}
          activeData={this.filterIncidents(currentTime)}
          handleHighlight={this.handleMapRolloverChange}
          boardHighlightedFeature={highlightedBoardIncident}
          photoData={photos}
          handlePhotos={this.handlePhotoMarkerClick}
          viewMode={incidentMode}
        />
        <ControlPanel 
          handleToggle={this.handleVisMode}
          viewMode={incidentMode}
        />
        { incidentMode ?
          <div>
          <Timeline
            handlePlay={this.handlePlayState}
            handleSeek={this.handleSeekChange}

            // setTime={this._updateTime}
            //currentTime={map_range(currentTime, startTS, endTS, 0, totalTime)}
            formattedTime={formattedTime}
            currentTime={this.convertTime(currentTime)}
            totalTime={this.convertTime(endTS)}
            isPlaying={isPlaying}
            staticData={data}
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
          <div className="lightBox-wrapper">
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
