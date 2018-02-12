import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { max, min, extent, histogram } from 'd3-array'
import { scaleLinear, scaleTime, scaleOrdinal, scalePow } from 'd3-scale'
import { timeHours, timeHour } from 'd3-time'
import { interpolateRound } from 'd3-interpolate'
import { select } from 'd3-selection'
import { stack } from 'd3-shape'
import { nest } from 'd3-collection'
import { axisBottom } from 'd3-axis'
import moment from 'moment'
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
    //this.makeCanvasGraph(graphData)
    this.binData(graphData)
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
   // this.makeCanvasGraph(graphData)
    this.binData(graphData)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)
  }

  graphAudioData = (data) => {

  }

  makeAxis = (data) => {
    const xS = this.getScales().xScale
    const xAxis = axisBottom().scale(xS)

  }

  binData = (data) => {
    // console.log(data)
    // Determine the first and list dates in the data set
    const timeExtent = extent(data, function(d) { return d.start })
    const hourBins = timeHours(timeHour.offset(timeExtent[0],-1),
                               timeHour.offset(timeExtent[1],1))

    // console.log(timeExtent)
    // console.log(hourBins)
    // console.log(typeof(hourBins[0]))
    // console.log(moment(data[0].start))

    // Use the histogram layout to create a function that will bin the data
    const binByHour = histogram()
      .value( (d, i) => {
        return d.start
      })
      .domain(timeExtent)
      .thresholds(hourBins)

    //console.log(binByHour(data))
      
    //console.log(i)
    let bins = []
    const xScl = this.getScales().xScale
    for (let i=0; i < hourBins.length - 1; i++) {
      let bin = {}
      bin.values = []
      let count = 0
      const x0 = hourBins[i]
      const x1 = hourBins[i + 1]
      bin['x0'] = x0
      bin['x1'] = x1

      let incidentArray = []
      data.forEach( (d) => {
        // if incident has an end time
        if (d.end > 0) {
          // contained within the hour
          if (xScl(d.start) >= xScl(x0) && xScl(d.start) < xScl(x1)) {
            incidentArray.push(d)
            return
          } 
          // check ending
          else if (xScl(d.end) >= xScl(x0) && xScl(d.end) < xScl(x1)) {
            incidentArray.push(d)
            return
          }
          // contains an hour within incident
          else if (xScl(d.start) <= xScl(x0) && xScl(d.end) >= xScl(x1)) {
            incidentArray.push(d)
            return
          }
        } 
        // case with made up durations (wait is 3600)
        else {
          if (xScl(d.start)  >= xScl(x0) && xScl(d.start) < xScl(x1)) {
            incidentArray.push(d)
            return
          }
        }
        
      })
      bin.values = incidentArray
      bins.push(bin)
    }
    //console.log(bins)

    const canvas = this.canvas
    const ctx = canvas.getContext("2d")
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, this.props.size[0], this.props.size[1])
    bins.map( (bin,i) => {
      bin.values.sort( (a,b) => {
        return a.priority - b.priority
      })
      console.log(bin)
      //const ht = h / bin.values.length
      //console.log(ht)
      const ht = (h - 30) / 38//bin.values.length
      const xPos = (w / bins.length) * i
      bin.values.map( (d,j) => {

        // console.log(ht * j)
        // console.log(xScl(bin.x0))
        // console.log(xScl(bin.x1))
        if (d.answered === "yes") {
          ctx.fillStyle = colrs[0]
          ctx.fillRect(xPos, (h - 30) - (ht * j), w/bins.length - 1, (ht - 1))
        } else {
          ctx.fillStyle = colrs[1]
          ctx.fillRect(xPos, (h - 30) - (ht * j), w/bins.length - 1, (ht - 1))
        }

        
      })
      
      // ctx.fillStyle = colrs[1] // sets the color to fill in the rectangle with
      // ctx.fillRect(xScl(d.start), yScl(d.wait), this.getRectWidth(xScl, d, true), 1)
      // ctx.fillStyle = colrs[0]
      // ctx.fillRect(xScl(d.scene), yScl(d.wait), this.getRectWidth(xScl, d, false), 1)
    })
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

    const xScl = this.getScales().xScale
    const yScl = this.getScales().yScale

    // TODO: Filter based on priority - via dropdown or buttons?
    // const filtered = data.filter( d => {
    //   return d.priority === '3'
    //   //return d
    // })
    //const filtered = this.filterActiveCalls(this.props.currentTime)

    ctx.clearRect(0, 0, this.props.size[0], this.props.size[1])
    graphData.map( (d,i) => {
      ctx.fillStyle = colrs[1] // sets the color to fill in the rectangle with
      ctx.fillRect(xScl(d.start), yScl(d.wait), this.getRectWidth(xScl, d, true), 1)
      ctx.fillStyle = colrs[0]
      ctx.fillRect(xScl(d.scene), yScl(d.wait), this.getRectWidth(xScl, d, false), 1)
    })
  }

  getScales = () => {
    //const dateRangeGD = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })

    //console.log(dateRangeGD)
    //console.log(this.props.dateRange)

    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain([+this.props.dateRange[0], +this.props.dateRange[1]])
                              .clamp(true)

    const yScale = scalePow().exponent(0.7)
                              .range([this.props.size[1] - 30, 0])
                              .domain(waitRange)

    return {xScale, yScale}
  }

  getRectWidth = (scale, d, total) => {
    let w = 0
    if (total) {
      // total length of call duration
      w = scale(d.end) - scale(d.start)
    } else {
      // duration of onscene portion
      w = scale(d.end) - scale(d.scene)
    }

    // clamp at 0 for few calls where onscene time is 
    // before start time (no seconds in raw data)
    if (w < 0) w = 0
    return w
  }

  filterActiveCalls = (time) => {
    const filtered = graphData.filter( (d) => {
      return (time >= d.start && time <= d.end)
    })
    return filtered
  }

  render() {
  	// return null
    // const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    // const waitRange = extent(graphData, d => {
    //   return d.wait
    // })
    // const xScale = scaleTime().range([0, this.props.size[0]])
    //                           .domain(dateRange)

    const x = this.getScales().xScale
    const y = this.getScales().yScale

    const xAxis = axisBottom()
                    .scale(x)
                    .ticks(14)
                    // .tickFormat( d => {

                    // })
    const xCoord = x(this.props.currentTime)

    // console.log(this.props.activeData)
    // console.log(this.props.currentTime)
    const filteredCalls = this.filterActiveCalls(this.props.currentTime)
    //console.log(filteredCalls)
    
    return (
      <div className="graphWrapper">
      <canvas width={this.props.size[0]} height={this.props.size[1]} ref={(el) => { this.canvas = el }} />
      <svg
        className="svgLayer"
        ref={node => this.node = node}
        width={this.props.size[0]}
        height={this.props.size[1]}>
        <Axis 
          h={this.props.size[1] + 5}
          axis={xAxis}
          axisType="x"
        />
        <g className="graph">
          {filteredCalls ?
            filteredCalls.map( (d, i) => {
              return (
                <rect
                  key={`active-${i}`}
                  className="activeRects"
                  x={x(d.start)}
                  y={y(d.wait)}
                  width={this.getRectWidth(x, d, true)}
                  height={1}
                  fill={'#fff'}
                />
              )
            }) : null
          }
        </g>
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