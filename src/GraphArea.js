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
//import { quadtree } from 'd3-geom'
import { zoom } from 'd3-zoom'
import { transform } from 'd3-transform'
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
      dragging: false,
      mouseX: 0,
      mouseY: 0,
      // zoomTransform: null
    }
    //this.audioObjects = Object.values(audioMap)
    // this.zoom = zoom()
    //               .scaleExtent([-5, 5])
    //               .translateExtent([[-1, -1], [this.props.size[0]+1, this.props.size[1]+1]])
    //               .extent([[-1, -1], [this.props.size[0]+1, this.props.size[1]+1]])
    //               .on('zoom', this.zoomed)
  }

  componentDidMount() {
    this.makeCanvasGraph(graphData)
    // console.log(select(this.svgLayer))
    // select(this.svgLayer).call(this.zoom)
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
    // select(this.canvas).call(this.zoom)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)
  }

  // zoomed = () => {
  //   console.log('zoomed')
  //   this.setState({ 
  //     zoomTransform: transform
  //   })
  // }

  graphAudioData = (data) => {

  }

  makeAxis = (data) => {
    const xS = this.getScales(1).xScale
    const xAxis = axisBottom().scale(xS)

  }

  makeCanvasGraph = (data) => {

    const canvas = this.canvas
    const ctx = canvas.getContext("2d")
    const w = canvas.width
    const h = canvas.height

    const mouseCanvas = this.mouseCanvas
    const mouseCtx = mouseCanvas.getContext("2d")
    const maxWidth = 40

    const scalar = 4.0
    // const factory = quadtree()
    //                   .extent([
    //                     [0, 0],
    //                     [w, h-30]
    //                   ])

    // const tree = factory(graphData)

    //var col = ctx.getImageData(this.state.mouseX, this.state.mouseY, 1, 1).data
    //console.log(col)
    // console.log(this.props.size[0], this.props.size[1])
    //console.log(w, h)
    // const pixelRatio = window.devicePixelRatio
    // canvas.width = w * pixelRatio
    // canvas.height = h * pixelRatio
    //console.log(canvas.width, canvas.height)

    const xScl = this.getScales(scalar).xScale
    const yScl = this.getScales(scalar).yScale

    console.log(this.state.mouseX, this.state.mouseY)
    console.log(xScl(this.props.currentTime)/scalar)

    graphData.map( (d,i) => {
      if (this.state.mouseX >= xScl(d.start) && 
          this.state.mouseX <= (xScl(d.start) + this.getRectWidth(xScl, d, true)) &&
          this.state.mouseY >= yScl(d.wait) &&
          this.state.mouseY <= yScl(d.wait) + 1) {
        console.log(d)
      }
    })

    // TODO: Filter based on priority - via dropdown or buttons?
    // const filtered = data.filter( d => {
    //   return d.priority === '3'
    //   //return d
    // })
    //const filtered = this.filterActiveCalls(this.props.currentTime)

    ctx.clearRect(0, 0, w, h)
    graphData.map( (d,i) => {
      ctx.fillStyle = colrs[1] // sets the color to fill in the rectangle with
      ctx.fillRect(xScl(d.start)/scalar, yScl(d.wait)/scalar, this.getRectWidth(xScl, d, true) / scalar, 1)
      ctx.fillStyle = colrs[0]
      ctx.fillRect(xScl(d.scene)/scalar, yScl(d.wait)/scalar, this.getRectWidth(xScl, d, false) / scalar, 1)
    })

    // mouseCtx.clearRect(0, 0, w, h)
    // mouseCtx.fillStyle= '#fff'
    // mouseCtx.fillRect(xScl(this.props.currentTime)/scalar, 0, maxWidth, h)
    // graphData.map( (d,i) => {
    //   mouseCtx.fillStyle = "#ff00ff"
    //   mouseCtx.fillRect(xScl(d.start), yScl(d.wait), this.getRectWidth(xScl, d, true), 1)
    // })
  }

  getScales = (scalar) => {
    //const dateRangeGD = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })
    //console.log(dateRangeGD)
    //console.log(this.props.dateRange)

    const xScale = scaleTime().range([0, (this.props.size[0]) * scalar])
                              .domain([+this.props.dateRange[0], +this.props.dateRange[1]])
                              .clamp(true)

    const yScale = scalePow().exponent(0.7)
                              .range([0, (this.props.size[1] - 30) * scalar])
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

  onMouseMove = (e) => {
    //console.log(this.ref)
    const position = this.svgLayer.getBoundingClientRect()
    // console.log(e.nativeEvent.offsetX)
    // console.log(e.nativeEvent.offsetY)

    this.setState({ mouseX: e.nativeEvent.offsetX, mouseY: e.nativeEvent.offsetY });
  }

  render() {
  	// return null
    // const dateRange = [graphData[0].start, graphData[graphData.length - 1].end]
    // const waitRange = extent(graphData, d => {
    //   return d.wait
    // })
    // const xScale = scaleTime().range([0, this.props.size[0]])
    //                           .domain(dateRange)

    const x = this.getScales(1).xScale
    const y = this.getScales(1).yScale

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

    // console.log(this.state.mouseX, this.state.mouseY)
    
    return (
      <div className="graphWrapper">
      <canvas
        width={this.props.size[0]}
        height={this.props.size[1]}
        ref={(el) => { this.canvas = el }}
      />
      <canvas 
        ref={(el) => { this.mouseCanvas = el }}
        width={this.props.size[0]}
        height={this.props.size[1]}
      />
      <svg
        className="svgLayer"
        ref={(node) => { this.svgLayer = node }}
        onMouseMove = {this.onMouseMove}
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