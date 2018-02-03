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
import audioMap from './data/flint-transcribed.json'

// import Histogram from "./Histogram"
// import Slider from "./Slider";
import Axis from './Axis'

const colrs = ['#72D687', '#FB3F48']

export default class GraphArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false
    }
    this.audioObjects = Object.values(audioMap)
  }

  componentDidMount() {
    this.makeCanvasGraph(graphData)
  //   //console.log(this.props.data)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)

  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log("shouldComponentUpdate")
    //return nextProps.data !== this.props.data
    return true
  }

  componentDidUpdate() {
    this.makeCanvasGraph(graphData)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)
  }

  graphAudioData = (data) => {

  }

  makeAxis = (data) => {
    const dateRange = [data[0].start, data[data.length - 1].end]
    const waitRange = extent(data, d => {
      return d.wait
    })
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const xAxis = axisBottom().scale(xScale)

  }

  makeCanvasGraph = (data) => {
    const canvas = this.canvas
    const ctx = canvas.getContext("2d")
    const w = canvas.width
    const h = canvas.height
    // console.log(this.props.size[0], this.props.size[1])
    //console.log(w, h)
    // const pixelRatio = window.devicePixelRatio
    // canvas.width = w * pixelRatio
    // canvas.height = h * pixelRatio
    //console.log(canvas.width, canvas.height)

    const dateRange = [data[0].start, data[data.length - 1].end]
    const waitRange = extent(data, d => {
      return d.wait
    })

    const audioRange = extent(this.audioObjects, d => {
      return new Date(d.date).getTime()
    })
    // console.log(dateRange)
    // console.log(audioRange)

    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const yScale = scalePow().exponent(0.7)
                              .range([this.props.size[1] - 45, 0])
                              .domain(waitRange)

    // TODO: Filter based on priority - via dropdown or buttons?
    const filtered = data.filter( d => {
      //return d.priority === '1'
      return d
    })

    ctx.clearRect(0, 0, this.props.size[0], this.props.size[1])
    filtered.map( (d,i) => {
      ctx.fillStyle = colrs[1] // sets the color to fill in the rectangle with
      ctx.fillRect(xScale(d.start), yScale(d.wait), this.getRectWidth(xScale, d, true), 1)
      ctx.fillStyle = colrs[0]
      ctx.fillRect(xScale(d.scene), yScale(d.wait), this.getRectWidth(xScale, d, false), 1)
    })

    // this.audioObjects.map( (d,i) => {
    //   ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    //   ctx.fillRect(xScale(new Date(d.date).getTime()), 0, 0.25, this.props.size[1] - 45)
    //   // ctx.beginPath()
    //   // ctx.moveTo(xScale(d.date), this.props.size[1] - 45)
    //   // ctx.lineTo(xScale(d.date), 0)
    //   // ctx.stroke()
    // })

  }

  makeIncidentGraph = (data) => {

    const node = this.node

    // assumes data is sorted by time (it is)
    const dateRange = [data[0].start, data[data.length - 1].end]
    const waitRange = extent(data, d => {
      return d.wait
    })

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
  }



  getScales = () => {
    const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })
    
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const yScale = scalePow().exponent(0.65)
                              .range([this.props.size[1] - 50, 0])
                              .domain(waitRange)

    return {xScale, yScale}
  }

  getRectWidth = (scale, d, total) => {
    let w = 0;
    if (total) {
      // total length of call duration
      w = scale(d.end) - scale(d.start)
    } else {
      // duration of onscene portion
      w = scale(d.end) - scale(d.scene)
    }
    
    //console.log(w)
    // clamp at 0 for few calls where onscene time is 
    // before start time (no seconds in raw data)
    if (w < 0) w = 0
    return w
  }

  render() {
  	// return null
    const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(dateRange)

    const xAxis = axisBottom().scale(xScale)

    const xCoord = xScale(this.props.currentTime)

    // const x = this.getScales().xScale
    // const y = this.getScales().yScale
    //console.log(this.props.currentTime)
    
    return (
      <div className="graphWrapper">
      <canvas width={this.props.size[0]} height={this.props.size[1]} ref={(el) => { this.canvas = el }} />
      <svg
        className="svgLayer"
        ref={node => this.node = node}
        width={this.props.size[0]}
        height={this.props.size[1]}>
        <Axis 
          h={this.props.size[1]}
          axis={xAxis}
          axisType="x"
        />
        <line
          className="currentTimeLine"
          x1={xCoord}
          y1={this.props.size[1] - 25}
          x2={xCoord}
          y2={7}
        />
      </svg>
      </div>
    )

    // return (
    //   <svg 
    //     ref={node => this.node = node}
    //     width={this.props.size[0]}
    //     height={this.props.size[1]}>
    //     <g className="graph">
    //       { graphData.map( (d, i) => {
    //         return (
    //         <g className="stackGroup" key={`group-${i}`}>
    //         <rect
    //           key={`total-${i}`}
    //           className="totalDuration"
    //           x={x(d.start)}
    //           y={y(d.wait)}
    //           width={this.getRectWidth(x, d, true)}
    //           height={1.5}
    //           fill={colrs[1]}
    //         />
    //         <rect 
    //           key={`onScene-${i}`}
    //           className="onSceneDuration" 
    //           x={x(d.scene)}
    //           y={y(d.wait)}
    //           width={this.getRectWidth(x, d, false)}
    //           height={1.5}
    //           fill={colrs[0]}
    //         />
    //       </g>
    //       )
    //     })}
    //     <Axis 
    //       h={this.props.size[1]}
    //       axis={xAxis}
    //       axisType="x"
    //     />
    //     </g>
    //   </svg>
    // )
  }
}