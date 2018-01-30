import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { max, min, extent } from 'd3-array'
import { scaleLinear, scaleTime, scaleOrdinal, scalePow } from 'd3-scale'
import { timeHour } from 'd3-time'
import { interpolateRound } from 'd3-interpolate'
import { select } from 'd3-selection'
import { stack } from 'd3-shape'
import { nest } from 'd3-collection'
import { axisBottom } from 'd3-axis'
import graphData from './data/d3data.json'

// import Histogram from "./Histogram"
// import Slider from "./Slider";
import Axis from './Axis'

const SLIDER_HEIGHT = 30;
const colrs = ['#72D687', '#FB3F48']

export default class GraphArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false
    };
  }

  // componentDidMount() {
  //   //console.log(this.props.data)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)

  // }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log("shouldComponentUpdate")
    //return nextProps.data !== this.props.data
    return true
  }

  // componentDidUpdate() {
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)
  // }

  makeAxis = (data) => {
    const dateRange = [data[0].start, data[data.length - 1].end]
    const waitRange = extent(data, d => {
      return d.wait
    })
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const xAxis = axisBottom().scale(xScale)

  }

  makeIncidentGraph = (data) => {

    const node = this.node

    // assumes data is sorted by time (it is)
    const dateRange = [data[0].start, data[data.length - 1].end]
    const waitRange = extent(data, d => {
      return d.wait
    })

    // console.log(this.props.size)
    // console.log(dateRange)
    // console.log(waitRange)
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    // const yScale = scaleLinear().range([this.props.size[1], 0])
    //                             .domain(waitRange)

    const yScale = scalePow().exponent(0.65)
                              .range([this.props.size[1] - 50, 0])
                              .domain(waitRange)

    // const yScale = scaleLinear().range([this.props.size[1], 0])
    //     .domain(extent(data, d => return d.properties.priority ))

    var boxes = select(node)
      .append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("class", "bar-group")

    boxes.append("rect")
        // .attr("class", "stacked")
      // .attr("stacked_state", function(d) { return "st"+d.state; })
      .attr("x", function(d) {
          //console.log(xScale(d.start))
          return xScale(d.start);
        })
      .attr("y", function(d) {
        return yScale(d.wait);
      })
      .attr("width", function(d) {
        let w = xScale(d.end) - xScale(d.start)
          if (w < 0) w = 0
          return w
      })
      .attr("height", 1.5)
      .style("fill", function(d) {
          return colrs[1];
      })
      .style("opacity", 1.0)

  boxes.append("rect")
      .attr("x", function(d) {
          return xScale(d.scene);
        })
      .attr("y", function(d) {
        return yScale(d.wait);
      })
      .attr("width", function(d) {
        let w = xScale(d.end) - xScale(d.scene)
          if (w < 0) w = 0
          return w
      })
      .attr("height", 1.5)
      .style("fill", function(d) {
          return colrs[0];
      })
      .style("opacity", 1.0)

  // select(node)
  //       .selectAll("line")
  //       .exit()
  //       .remove()

  // var line = select(node)
  //     .append("line")
  //       .attr("class", "line")
  //     .attr("x1", xScale(this.props.unconvertTime(this.props.currentTime) * 1000))
  //     .attr("y1", this.props.size[1])
  //     .attr("x2", xScale(this.props.unconvertTime(this.props.currentTime) * 1000))
  //     .attr("y2", 0)
  //     .style("stroke", "white")

  // TODO: follow new structure as outlined in this tutorial: 
  // http://www.adeveloperdiary.com/react-js/integrate-react-and-d3/
      // select(node)
      // .append("g")
      // .selectAll("g")
      // .data(timeStackBars)
      // .enter().append("g")
      //   .attr("fill", d => { return zScale(d.key) })
      // .selectAll("rect")
      // .data( d => { return d })
      // .enter().append("rect")
      //   .attr("x", d => { return xScale(d.data.time) })
      //   .attr("y", d => { return yScale(d[1]) })
      //   .attr("height", d => { return yScale(d[0]) - yScale(d[1]) })
      //   .attr("width", barWidth)
      //     .style("stroke", "black")
      //     .style("stroke-opacity", 0.05)

    /*

    select(node)
      .selectAll("rect")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")

    select(node)
        .selectAll("rect.bar")
        .data(data)
        .exit()
        .remove()

    select(node)
        .selectAll("rect.bar")
        .data(data)
        .attr("x", d => { 
          //console.log(xScale(d.properties.unix_timestamp * 1000))
          return xScale(d.properties.unix_timestamp * 1000) 
        })
        .attr("y", d => {
          //console.log(yScale(d.properties.waitTime)) 
          return yScale(d.properties.waitTime) 
        })
        .attr("height", 2)
        .attr("width", d => {
          let w = xScale(d.properties.unix_end * 1000) - xScale(d.properties.unix_timestamp * 1000)
          if (w < 0) w = 0
          return w
        })
        .attr("fill", colrs[1])
          .style("stroke", "black")
          .style("stroke-opacity", 0.05)

    select(node)
      .selectAll("rect")
      .data(answeredCalls)
      .enter().append("rect")
        .attr("class", "onSceneBar")

    select(node)
        .selectAll("rect.onSceneBar")
        .data(answeredCalls)
        .exit()
        .remove()

    select(node)
        .selectAll("rect.onSceneBar")
        .data(answeredCalls)
        .attr("x", d => {
          console.log(xScale(d.properties.unix_onscene * 1000))
          return xScale(d.properties.unix_onscene * 1000)
        })
        .attr("y", d => yScale(d.properties.waitTime))
        .attr("height", 2)
        .attr("width", d => {
          let w = xScale(d.properties.unix_end * 1000) - xScale(d.properties.unix_onscene * 1000)
          if (w < 0) w = 0
          return w
        })
        .attr("fill", colrs[0])
          .style("stroke", "black")
          .style("stroke-opacity", 0.05)


          */

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

    //console.log(combinedData)

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
          .style("stroke", "black")
          .style("stroke-opacity", 0.05)


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

  getScales = () => {
    const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })

    // console.log(this.props.size)
    // console.log(dateRange)
    // console.log(waitRange)
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    // const yScale = scaleLinear().range([this.props.size[1], 0])
    //                             .domain(waitRange)

    const yScale = scalePow().exponent(0.65)
                              .range([this.props.size[1] - 50, 0])
                              .domain(waitRange)

    return {xScale, yScale}
  }

  getRectWidth = (scale, d) => {
    let w = scale(d.end) - scale(d.start)
    //console.log(w)
    if (w < 0) w = 0
    return w
  }

  render() {
    console.log("in render")
  	// return null
    const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const xAxis = axisBottom().scale(xScale)

    const x = this.getScales().xScale
    const y = this.getScales().yScale

    // const rectangles = graphData.forEach((d, i) => {
    //   <g className="stackGroup">
    //   <rect
    //     key={"total-"+i}
    //     className="totalDuration"
    //     x={x(d.start)}
    //     y={y(d.wait)}
    //     width={this.getRectWidth(x, d)}
    //     height={1.5}
    //     fill={colrs[1]}
    //   />
    //   <rect className="onSceneDuration" />
    // </g>
    // })

    return (
      <svg 
        ref={node => this.node = node}
        width={this.props.size[0]}
        height={this.props.size[1]}>
        <g className="group">
          { graphData.map( (d, i) => {
            return (
            <g className="stackGroup" key={`group-${i}`}>
            <rect
              key={`total-${i}`}
              className="totalDuration"
              x={x(d.start)}
              y={y(d.wait)}
              width={this.getRectWidth(x, d)}
              height={1.5}
              fill={colrs[1]}
            />
            <rect className="onSceneDuration" />
          </g>
          )
        })}
        
        <Axis 
          h={this.props.size[1]}
          axis={xAxis}
          axisType="x"
        />
        </g>
      </svg>

    )
  }
}