import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import MapboxGl from 'mapbox-gl'
import { MAPBOX_TOKEN } from './constants/keys.js'

import bounds from './data/subunits-flint.json'

export default class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null
    };
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

  componentDidMount() {
    MapboxGl.accessToken = MAPBOX_TOKEN

    this.map = new MapboxGl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-83.6969862, 43.0215524],
      zoom: 12,
      pitch: 60,
      bearing: 0
    })

    this.map.on('load', (...args) => {
      // this.setState({ this.getChildContext() })
      this._initMap(this.map)
    })

    //window.addEventListener('resize', this._resize);
    // this._resize();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState)
  //   return (
  //     nextProps.children !== this.props.children ||
  //     nextState.map !== this.state.map
  //   )
  //   //console.log(shouldUpdate)
  // }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps)
    this.map.setFilter('incidentsLayer', ['in', 'eventNumber'].concat(
      nextProps.activeData.map( feature => {
        //console.log(feature.properties.eventNumber);
        return feature.properties.eventNumber;
      })
    ))
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this._resize);
    this.map.remove();
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

  _initMap = (map) => {
    // this layer is static and doesn't change - marks city boundaries
    map.addLayer({
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

    //incidents layer
    map.addLayer({
      'id': 'incidentsLayer',
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': this.props.staticData
      },
      'layout': {},
      'paint': {
        'circle-color': 'red'
      }
    })

    // now try and filter?
    map.setFilter('incidentsLayer', ['in', 'eventNumber'].concat(
      this.props.activeData.map( feature => {
        //console.log(feature.properties.eventNumber);
        return feature.properties.eventNumber;
      })
    ))
  }

  // Create a popup, but don't add it to the map yet.
  // let popup = new mapboxgl.Popup({
  //     closeButton: false,
  //     closeOnClick: false
  // })

  //   map.on('mouseenter', 'incidentsLayer', function(e) {
  //       // Change the cursor style as a UI indicator.
  //       map.getCanvas().style.cursor = 'pointer';

  //       // Populate the popup and set its coordinates
  //       // based on the feature found.
  //       popup.setLngLat(e.features[0].geometry.coordinates)
  //           .setHTML(e.features[0].properties.description)
  //           .addTo(map);
  //   })

  //   map.on('mouseleave', 'incidentsLayer', function() {
  //       map.getCanvas().style.cursor = '';
  //       popup.remove();
  //   })

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