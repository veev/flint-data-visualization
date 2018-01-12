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
    });

    this.map.on('load', (...args) => {
      // this.setState({ this.getChildContext() })

      // this layer is static and doesn't change - marks city boundaries
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
      });

      //incidents layer
      this.map.addLayer({
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
      });

    });

    window.addEventListener('resize', this._resize);
    // this._resize();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.children !== this.props.children ||
  //     nextState.map !== this.state.map
  //   )
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    this.map.remove();
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

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