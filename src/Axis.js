import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { PropTypes } from 'prop-types'
import { select } from 'd3-selection'

export default class Axis extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  componentDidMount() {
    this.renderAxis()
  }

  renderAxis = () => {
    const node = ReactDOM.findDOMNode(this)
    select(node).call(this.props.axis)
  }

  render() {
    const translate = `translate(0,${this.props.h - 25})`

    return (
      <g className="axis" transform={this.props.axisType ==='x' ? translate:""} >
      </g>
    )
  }
}

Axis.propTypes = {
  h: PropTypes.number,
  axis: PropTypes.func,
  axisType: PropTypes.oneOf(['x','y'])

}