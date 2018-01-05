import React, { Component, PropTypes } from 'react'
import MapboxGl from 'mapbox-gl'
import { MAPBOX_TOKEN } from './data/keys.js'

Mapboxgl.accessToken = MAPBOX_TOKEN

class Map extends Component {
	
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

  }

}