import React, { Component } from 'react'
import PropTypes from "prop-types"
import { max, min, extent } from "d3-array"
import { scaleLinear, scaleTime, scaleOrdinal } from "d3-scale"
import { timeHour } from "d3-time"
import { interpolateRound } from "d3-interpolate"
import { select } from 'd3-selection'
import { stack } from 'd3-shape'

import Histogram from "./Histogram"
// import Slider from "./Slider";

const SLIDER_HEIGHT = 30;
const colrs = ['#72D687', '#FB3F48']

export default class GraphArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false
    };
  }

  componentDidMount() {
    //console.log(this.props.data)
    this.makeHistogramData(this.props.data.features)
  }

  componentDidUpdate() {
    this.makeHistogramData(this.props.data.features)
  }

  makeStackedHistogramData = (data) => {

  }

  binData = (data, bins, binner, interval) => {
    let hist = []
    for (let i = 0; i < bins.length; i++) {
      hist[i] = 0
    }
    data.forEach( d => {
      const tid = binner(interval.floor(new Date(d.properties.unix_timestamp * 1000)))
      //console.log(tid)
      if (!hist[tid]) {
        hist[tid] = 1
      } else {
        hist[tid]++
      }
    })
    return hist
  }

  makeHistogramData = (data) => {
    const node = this.node
    const binner = scaleTime()
    const interval = timeHour
    const dateRange = extent(data, d => {
      return (d.properties.unix_timestamp * 1000)
    })
    const allIntervals = interval.range(interval.floor(dateRange[0]), interval.ceil(dateRange[1]))
    //console.log(allIntervals)

    binner.domain([allIntervals[0], allIntervals[allIntervals.length - 1]])
      .range([0, allIntervals.length - 1])
      .interpolate(interpolateRound)

    // divide data into answered vs unanswered calls
    const answeredCalls = data.filter( d => {
      return d.properties.unix_onscene
    })

    const unansweredCalls = data.filter( d => {
      return !d.properties.unix_onscene
    })

    // console.log(answeredCalls)
    // console.log(unansweredCalls)

    const allDataHist = this.binData(data, allIntervals, binner, interval)
    //console.log(allDataHist)

    const answeredHist = this.binData(answeredCalls, allIntervals, binner, interval)
    const unansweredHist = this.binData(unansweredCalls, allIntervals, binner, interval)

    // console.log(answeredHist)
    // console.log(unansweredHist)

    // create combined data for answered and unanswered call counts
    let combinedData = []
    for (let i = 0; i < allIntervals.length; i++) {
      let dataObj = {}
      dataObj.time = allIntervals[i]
      dataObj.answered = answeredHist[i]
      dataObj.unanswered = unansweredHist[i]
      combinedData.push(dataObj)
    }

    console.log(combinedData)

    const dataStackLayout = stack().keys(["answered", "unanswered"])
    const timeStackBars = dataStackLayout(combinedData)

    console.log(timeStackBars)

    const barWidth = this.props.size[0] / combinedData.length
    //console.log("barWidth", barWidth)
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(extent(combinedData, d => { return d.time }))
    //const maxVal = max(combinedData, d => { return d.count })
    //console.log(maxVal)
    const maxCount = max(allDataHist)
    // console.log(maxCount)
    const yScale = scaleLinear().range([this.props.size[1], 0])
                           .domain([0, maxCount])

    const zScale = scaleOrdinal()
      .range(colrs)
      .domain(["answered", "unanswered"])

    select(node)
      .append("g")
      .selectAll("g")
      .data(timeStackBars)
      .enter().append("g")
        .attr("fill", d => { return zScale(d.key) })
      .selectAll("rect")
      .data( d => { return d })
      .enter().append("rect")
        .attr("x", d => { return xScale(d.data.time) })
        .attr("y", d => { return yScale(d[1]) })
        .attr("height", d => { return yScale(d[0]) - yScale(d[1]) })
        .attr("width", barWidth)


    //   .selectAll("rect")
    //   .data(combinedData)
    //   .enter()
    //   .append("rect")
    //     .attr("class", "bar")
    //     .on("mouseover", this.props.onHover)

    // select(node)
    //   .selectAll("rect.bar")
    //   .data(combinedData)
    //   .exit()
    //   .remove()

    // select(node)
    //   .selectAll("rect.bar")
    //   .data(combinedData)
    //   .attr("x", (d,i) => xScale(d.time))
    //   .attr("y", d => { return yScale(d.count) })
    //   .attr("height", d => { return this.props.size[1] - yScale(d.count) })
    //   .attr("width", barWidth)
    //   // .style("fill", (d,i) => this.props.hoverElement === d.id ?
    //   //   "#FCBC34" : this.props.colorScale(i))
    //   .style("stroke", "black")
    //   .style("stroke-opacity", 0.25)
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