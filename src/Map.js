import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// import { PropTypes } from 'prop-types'
import MapboxGl from 'mapbox-gl'
import { MAPBOX_TOKEN } from './constants/keys.js'
// import Tooltip from './Tooltip.js'
import bounds from './data/subunits-flint.json'
import descriptionLookup from './data/descriptionMap.json'

export default class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null,
      popup: null
    }
    // this.tooltipContainer;
  }

  static defaultProps = {
    defaultFeature: {
      type: 'Feature',
      geometry: { },
      properties: {
        eventNumber: ''
      }
    }
  }
	
  // static childContextTypes = {
  //   map: PropTypes.object
  // }

  // state = {
  // 	map: null
  // }

  // getChildContext = () => ({
  //   map: this.state.map
  // });

  //tooltipContainer;

  // setTooltip = (feature) => {
  //   ReactDOM.render(
  //     React.createElement( Tooltip, { feature }),
  //     this.props.tooltipContainer
  //   )
  // }

  componentDidMount() {
    MapboxGl.accessToken = MAPBOX_TOKEN

    // Container to put React generated content in.
    //this.tooltipContainer = document.createElement('div')

    this.map = new MapboxGl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-83.6969862, 43.0215524],
      zoom: 12,
      pitch: 50,
      bearing: 0
    })

    // const tooltip = new MapboxGl.Marker(this.props.tooltipContainer, {
    //   offset: [-120, 0]
    // }).setLngLat([0,0]).addTo(this.map)

    this.popup = new MapboxGl.Popup({
      closeButton: false,
      closeOnClick: false
    })

    this.map.on('load', (...args) => {
      // this.setState({ this.getChildContext() })
      this._initMap()
      this._addListeners()
    })

    //window.addEventListener('resize', this._resize);
    // this._resize();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldUpdate')
    // console.log(this.map.getLayer('totalTimeHeatmap'))
    //console.log(nextProps.activeData, this.props.activeData)
    // return (
    //   nextProps.children !== this.props.children ||
    //   nextState.map !== this.state.map
    // )
    //console.log(nextProps.activeData === this.props.activeData)
    //console.log(nextProps.children !== this.props.children)
    return nextProps.activeData !== this.props.activeData
  }

  componentWillUpdate(nextProps, nextState) {
    //console.log(nextProps.boardHighlightedFeature.properties.eventNumber, this.props.boardHighlightedFeature.properties.eventNumber)

    if (nextProps.activeData && this.map.getSource('incidents')) {
      this.map.getSource('incidents').setData(this.makeGeoJsonFromFeatures(nextProps.activeData))
    }

    if (this.map.isStyleLoaded() && this.map.getSource('incidents')) {
      this.map.setFilter('incidentsLayer', ['in', 'eventNumber'].concat(
        nextProps.activeData.map( feature => {
          //console.log(feature.properties.eventNumber);
          return feature.properties.eventNumber;
        })
      ))

      this.map.setFilter('incidentsLayerHighlight', 
        ['in', 'eventNumber', nextProps.boardHighlightedFeature.properties.eventNumber]
      )

      this.popup.remove()

      this.popup = new MapboxGl.Popup({
          closeButton: false,
          closeOnClick: false
      })

      if (nextProps.boardHighlightedFeature.geometry.coordinates) {
        this.popup.setLngLat(nextProps.boardHighlightedFeature.geometry.coordinates)
        // console.log(descriptionLookup[nextProps.boardHighlightedFeature.properties.type])
        this.setPopupHtml(this.popup, nextProps.boardHighlightedFeature)
        this.popup.addTo(this.map)
      }

      //console.log(nextProps.viewMode)
      if (nextProps.viewMode && this.map.getSource('incidents')) {
        // show incidents if viewMode is true
        if (this.map.getStyle('incidentsLayer')) {

        }
        this.map.setLayoutProperty('incidentsLayer', 'visibility', 'visible')
        this.props.photoData.features.map( (feature, index) => {
          //console.log(this.map.getLayer(`photoThumbnails-${index}`))
          if (this.map.isSourceLoaded(`photosSource-${index}`)) {
            this.map.setLayoutProperty(`photoThumbnails-${index}`, 'visibility', 'none')
          }
        })

      } else if (this.map.getSource('incidents')) {
        // show photos if viewMode is false
        this.map.setLayoutProperty('incidentsLayer', 'visibility', 'none')
        this.props.photoData.features.map( (feature, index) => {
          if (this.map.isSourceLoaded(`photosSource-${index}`)) {
            // console.log(this.map.getLayer(`photoThumbnails-${index}`))
            if (this.map.getLayer(`photoThumbnails-${index}`)) {
              this.map.setLayoutProperty(`photoThumbnails-${index}`, 'visibility', 'visible')
            }
          }
        })

      }

      if (nextProps.showHeatmap) {
        this.map.setLayoutProperty('totalTimeHeatmap', 'visibility', 'visible')
      } else {
        this.map.setLayoutProperty('totalTimeHeatmap', 'visibility', 'none')
      }
    }
  }

  componentDidUpdate() {
    //console.log('componentDidUpdate')
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this._resize);
    this.map.remove();
  }

  setPopupHtml = (popup, feature) => {
    if (descriptionLookup[feature.properties.type]) {
      popup.setHTML(descriptionLookup[feature.properties.type])
    } else {
      console.log("undefined popup description: ", feature.properties.type)
      popup.setHTML(feature.properties.type)
    }
  }

  makeGeoJsonFromFeatures = (featuresArray) => {
    let object = {};
    object.type = "FeatureCollection";
    object.features = featuresArray;
    return object;
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    })
  }

  _getUniqueFeatures = (array, comparatorProperty) => {
    let existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    const uniqueFeatures = array.filter(function(el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    })

    return uniqueFeatures
  }

  _initMap = () => {
    // this layer is static and doesn't change - marks city boundaries
    console.log(this.props.staticData)

    this.map.addLayer({
      'id': 'boundsLayer',
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': bounds
      },
      'layout': {},
      'paint': {
        'fill-color': '#fff',
        'fill-opacity': 0.1
      }
    })

    this.map.addSource('incidents', {
      'type': 'geojson',
      'data': this.props.staticData
    })

    this.map.addLayer({
      'id': 'totalTimeHeatmap',
      'type': 'heatmap',
      'source': 'incidents',
      'maxzoom': 18,
      'paint': {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'waitTime'],
              0, 0,
              5000, 1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 1,
              18, 3
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8, 2,
              14, 40
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 1,
              18, 0
          ],
      }
    }, 'waterway-label')

    //incidents layer
    this.map.addLayer({
      'id': 'incidentsLayer',
      'type': 'circle',
      'source': 'incidents',
      'layout': {},
      'paint': {
        'circle-color': [
          'case',
            ['==', ['get', 'status'], 'notAssigned'],
            [
            'interpolate',
              ['linear'],
              ['number', ['get', 'elapsedTime']],  
              //0, '#F7F7F7',
              0, '#FEF877',
              7200, '#FB3F48'
            ],
            ['==', ['get', 'status'], 'waitingforUnit'],
            //['to-color', '#FB3F48'],
            [
            'interpolate',
              ['linear'],
              ['number', ['get', 'elapsedTime']],  
              //0, '#F7F7F7',
              0, '#FEF877',
              7200, '#FB3F48'
            ],
            ['==', ['get', 'status'], 'onScene'],
            //['to-color', '#31CE75'],
            [
            'interpolate',
              ['linear'],
              ['get', 'elapsedTime'],  
              1800,
              '#31CE75',
              18000,
              '#19673A'
            ],
            '#FF0000'
        ],
        'circle-stroke-opacity': 1,
        'circle-radius': 12,
        //'circle-blur': 1.0
        'circle-blur': ["/", ['get', 'elapsedTime'], 24000]
      }
    })

    //incidents highlight layer
    this.map.addLayer({
      'id': 'incidentsLayerHighlight',
      'type': 'circle',
      'source': 'incidents',
      'layout': {},
      'paint': {
        'circle-color': 'white'
      },
      'filter': ["==", "id", 2000]
    })

    // now try and filter?
    this.map.setFilter('incidentsLayer', ['in', 'eventNumber'].concat(
      this.props.activeData.map( feature => {
        //console.log(feature.properties.eventNumber);
        return feature.properties.eventNumber;
      })
    ))

    // add photo markers to map
    // this.map.addSource('photos', {
    //   'type': 'geojson',
    //   'data': this.props.photoData
    // })

    this.props.photoData.features.map( (feature, index) => {
      this.map.addSource(`photosSource-${index}`, {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'geometry': feature.geometry,
            'properties': feature.properties
          }]
        }
      })
    })

    const s3path = 'https://s3.amazonaws.com/flint-pd-may/saved-for-web/thumbnails/'
    this.props.photoData.features.map( (feature, index) => {
      //https://s3.amazonaws.com/flint-pd-may/saved-for-web/thumbnails/TREX_AUG_FLINT_2015-122-1.png
      this.map.loadImage(`${s3path}${feature.properties.thumbnail}.png`, (error, image) => {
        if (error) throw error
        this.map.addImage(`thumbnail-${index}`, image)
        this.map.addLayer({
          'id': `photoThumbnails-${index}`,
          'type': 'symbol',
          'source': `photosSource-${index}`,
          'layout': {
            'icon-image': `thumbnail-${index}`,
            'icon-size': 0.5,
            'icon-allow-overlap': true
          }
        })
        this.map.setLayoutProperty(`photoThumbnails-${index}`, 'visibility', 'none')
      })
    })

    // this.map.addLayer({
    //   'id': 'photoMarkers',
    //   'type': 'symbol',
    //   'source': 'photos',
    //   'layout': {
    //     'icon-image': 'attraction-15',
    //     'icon-allow-overlap': true
    //   }
    // })

    // turn off photos for now
    // this.map.setLayoutProperty('incidentsLayer', 'visibility', 'visible')
    //this.map.setLayoutProperty('photoMarkers', 'visibility', 'none')
    this.map.setLayoutProperty('totalTimeHeatmap', 'visibility', 'none')
  }

  _addListeners = () => {
     // Create a popup, but don't add it to the map yet.
    const popup = new MapboxGl.Popup({
        closeButton: false,
        closeOnClick: false
    })

    this.map.on('mouseenter', 'incidentsLayer', (e) => {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = 'pointer';
      this.props.handleHighlight(e.features[0])
      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(e.features[0].geometry.coordinates)
      this.setPopupHtml(popup, e.features[0])
      popup.addTo(this.map)
    })

    this.map.on('mouseleave', 'incidentsLayer', (e) => {
      this.map.getCanvas().style.cursor = '';
      this.props.handleHighlight(this.props.defaultFeature)
      popup.remove()
    })

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    this.map.on('click', 'incidentsLayer', (e) => {
      console.log(e.features[0].geometry.coordinates)
      this.map.flyTo({center: e.features[0].geometry.coordinates})
    })

    // Attach listeners to photoMarkers layer
    // Change the cursor to a pointer when the mouse is over the photoMarkers layer.
    this.map.on('mouseenter', 'photoMarkers', (e) => {
      if (this.map.getSource('photos') && this.map.isSourceLoaded('photos')) {
        this.map.getCanvas().style.cursor = 'pointer';
      }
    })

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'photoMarkers', (e) => {
      if (this.map.getSource('photos') && this.map.isSourceLoaded('photos')) {
        this.map.getCanvas().style.cursor = '';
      }
    })

    this.map.on('click', 'photoMarkers', (e) => {
      //console.log(e.features[0].properties.photos)
      // call function in App to generate Modal sliders?
      this.props.handlePhotos(e.features[0])
    })

    this.props.photoData.features.map( (feature, index) => {
      this.map.on('click', `photoThumbnails-${index}`, (e) => {
        console.log(e)
        this.props.handlePhotos(e.features[0])
      })

      this.map.on('mouseenter', `photoThumbnails-${index}`, (e) => {
        if (this.map.getSource(`photos-${index}`) && this.map.isSourceLoaded(`photos-${index}`)) {
          this.map.getCanvas().style.cursor = 'pointer';
        }
      })

      this.map.on('mouseleave', `photoThumbnails-${index}`, (e) => {
        if (this.map.getSource(`photos-${index}`) && this.map.isSourceLoaded(`photos-${index}`)) {
          this.map.getCanvas().style.cursor = '';
        }
      })

    })
  }


  render() {
    const { children } = this.props;
    const { map } = this.state;

    return (
      <div className='Map' ref={(el) => { this.mapContainer = el }}>
        { map && children }
      </div>
    )
  }

}