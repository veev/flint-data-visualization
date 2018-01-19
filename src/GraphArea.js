import React, { Component } from 'react'
import PropTypes from "prop-types"
import { max, min, extent } from "d3-array"
import { scaleLinear as linear, scaleTime } from "d3-scale"
import { timeHour } from "d3-time"
import { interpolateRound } from "d3-interpolate"
import { select } from 'd3-selection'

import Histogram from "./Histogram"
// import Slider from "./Slider";

const SLIDER_HEIGHT = 30;

export default class GraphArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false
    };
  }

  componentDidMount() {
    console.log(this.props.data)
    this.makeHistogramData(this.props.data.features)
  }

  componentDidUpdate() {
    this.makeHistogramData(this.props.data.features)
  }

  makeHistogramData = (data) => {
    const node = this.node
    const binner = scaleTime()
    const interval = timeHour
    const dateRange = extent(data, d => {
      return (d.properties.unix_timestamp * 1000)
    })
    const allIntervals = interval.range(interval.floor(dateRange[0]), interval.ceil(dateRange[1]))

    binner.domain([allIntervals[0], allIntervals[allIntervals.length - 1]])
      .range([0, allIntervals.length - 1])
      .interpolate(interpolateRound)

    let hist = []
    for (let i = 0; i < allIntervals.length; i++) hist[i] = 0

    data.forEach( d => {
      const tid = binner(interval.floor(new Date(d.properties.unix_timestamp * 1000)))
      if (!hist[tid]) {
        hist[tid] = 1
      } else {
        hist[tid]++
      }
    })

    let combinedData = []
    for (let i = 0; i < hist.length; i++) {
      let dataObj = {}
      dataObj.time = allIntervals[i]
      dataObj.count = hist[i]
      combinedData.push(dataObj)
    }

    console.log(combinedData)
    const barWidth = this.props.size[0] / combinedData.length
    console.log("barWidth", barWidth)
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(extent(combinedData, d => {
                                return +d.time.getTime()
                              }))
    const maxVal = max(combinedData, d => { return d.count })
    console.log(maxVal)

    const yScale = linear().range([this.props.size[1], 0])
                           .domain([0, maxVal])

    select(node)
      .selectAll("rect")
      .data(combinedData)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .on("mouseover", this.props.onHover)

    select(node)
      .selectAll("rect.bar")
      .data(combinedData)
      .exit()
      .remove()

    select(node)
      .selectAll("rect.bar")
      .data(combinedData)
      .attr("x", (d,i) => xScale(d.time))
      .attr("y", d => { return yScale(d.count) })
      .attr("height", d => { return this.props.size[1] - yScale(d.count) })
      .attr("width", barWidth)
      // .style("fill", (d,i) => this.props.hoverElement === d.id ?
      //   "#FCBC34" : this.props.colorScale(i))
      .style("stroke", "black")
      .style("stroke-opacity", 0.25)
  }

  render() {
  	// return null
    return (
      <svg 
        ref={node => this.node = node}
        width={this.props.size[0]}
        height={this.props.size[1]}>
      </svg>
    )
  }
}