import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import MapboxGl from 'mapbox-gl'
import { MAPBOX_TOKEN } from './constants/keys.js'

import bounds from './data/subunits-flint.json'

export default class Map extends Component {
	
	static childContextTypes = {
		map: PropTypes.object
	}

	state = {
		map: null
	}

  getChildContext = () => ({
    map: this.state.map
  });

  componentDidMount() {
    MapboxGl.accessToken = MAPBOX_TOKEN

    const map = new MapboxGl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-83.6969862, 43.0215524],
      zoom: 12,
      pitch: 60,
      bearing: 0
    });

    map.on('load', (...args) => {
      this.setState({ map })

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
      });
    });

    window.addEventListener('resize', this._resize);
    this._resize();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children !== this.props.children ||
      nextState.map !== this.state.map
    )
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
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
      <div className='Map' ref={(x) => { this.container = x }}>
        { map && children }
      </div>
    )
  }

}