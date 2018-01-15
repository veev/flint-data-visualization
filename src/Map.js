import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// import { PropTypes } from 'prop-types'
import MapboxGl from 'mapbox-gl'
import { MAPBOX_TOKEN } from './constants/keys.js'

// import Tooltip from './Tooltip.js'
import bounds from './data/subunits-flint.json'

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
      pitch: 60,
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
    console.log('shouldUpdate')
    console.log(nextProps.activeData, this.props.activeData)
    // return (
    //   nextProps.children !== this.props.children ||
    //   nextState.map !== this.state.map
    // )
    console.log(nextProps.activeData === this.props.activeData)
    //console.log(nextProps.children !== this.props.children)
    return nextProps.activeData !== this.props.activeData
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps.highlightedFeature.properties.eventNumber, this.props.highlightedFeature.properties.eventNumber)
    console.log(nextProps.highlightedFeature.properties.eventNumber === this.props.highlightedFeature.properties.eventNumber)
    this.map.setFilter('incidentsLayer', ['in', 'eventNumber'].concat(
      nextProps.activeData.map( feature => {
        //console.log(feature.properties.eventNumber);
        return feature.properties.eventNumber;
      })
    ))

    this.map.setFilter('incidentsLayerHighlight', 
      ['in', 'eventNumber', nextProps.highlightedFeature.properties.eventNumber]
    )

    this.popup.remove()

    this.popup = new MapboxGl.Popup({
        closeButton: false,
        closeOnClick: false
    })

    if (nextProps.highlightedFeature.geometry.coordinates) {
      this.popup.setLngLat(nextProps.highlightedFeature.geometry.coordinates)
          .setHTML(nextProps.highlightedFeature.properties.type)
          .addTo(this.map);
    } else {

    }

  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
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

  _initMap = () => {
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
    })

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
    })

    //incidents highlight layer
    this.map.addLayer({
      'id': 'incidentsLayerHighlight',
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': this.props.staticData
      },
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

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(e.features[0].geometry.coordinates)
          .setHTML(e.features[0].properties.type)
          .addTo(this.map);
    })

    this.map.on('mouseleave', 'incidentsLayer', (e) => {
      this.map.getCanvas().style.cursor = '';
      popup.remove();
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