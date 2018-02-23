import React, { Component } from 'react'
import { max, min, extent, histogram } from 'd3-array'
import { scaleLinear, scaleTime, scaleOrdinal, scalePow } from 'd3-scale'
import { timeHours, timeHour } from 'd3-time'
// import { interpolateRound } from 'd3-interpolate'
import { select } from 'd3-selection'
import { stack } from 'd3-shape'
// import { nest } from 'd3-collection'
import { axisBottom } from 'd3-axis'

//import { quadtree } from 'd3-geom'
import { zoom } from 'd3-zoom'
import { transform } from 'd3-transform'
//import moment from 'moment'

import graphData from './data/d3data.json'

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

    this.bins = []
    // this.zoom = zoom()
    //               .scaleExtent([-5, 5])
    //               .translateExtent([[-1, -1], [this.props.size[0]+1, this.props.size[1]+1]])
    //               .extent([[-1, -1], [this.props.size[0]+1, this.props.size[1]+1]])
    //               .on('zoom', this.zoomed)
  }

  componentDidMount() {

    //this.makeCanvasGraph(graphData)
    // console.log(select(this.svgLayer))
    // select(this.svgLayer).call(this.zoom)
   const nextScale = this.getScales(1, this.props.dateRange).xScale
   this.bins = this.binData(graphData, this.props.dateRange, nextScale)
   //console.log(this.bins)

  //   //console.log(this.props.data)
  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)

  }

  componentWillUpdate(nextProps) {
    // console.log(nextProps.dateRange, this.props.dateRange)
    // console.log(nextProps.dateRange[0] !== this.props.dateRange[0] || nextProps.dateRange[1] !== this.props.dateRange[1])
    //return nextProps.data !== this.props.data
    if (nextProps.dateRange[0] !== this.props.dateRange[0] || nextProps.dateRange[1] !== this.props.dateRange[1]) {
      this.bins.length = 0
      const nextScale = this.getScales(1, nextProps.dateRange).xScale
      this.bins = this.binData(graphData, nextProps.dateRange, nextScale)
    }
  }

  componentDidUpdate() {

    //this.makeCanvasGraph(graphData)
    // select(this.canvas).call(this.zoom)
   this.makeBinnedCanvasGraph(this.bins)

  //   //this.makeHistogramData(this.props.data.features)
  //   //this.makeIncidentGraph(this.props.data.features)
  //   //this.makeIncidentGraph(graphData)
  //   //this.makeAxis(graphData)
  }

  // makeAxis = (data) => {
  //   const xS = this.getScales(1).xScale
  //   const xAxis = axisBottom().scale(xS)

  // }

  binData = (data, timeExtent, xScl) => {
    // console.log(data)
    // Determine the first and list dates in the data set
    //const timeExtent = extent(data, function(d) { return d.start })
    const hourBins = timeHours(timeHour.offset(timeExtent[0],-1),
                               timeHour.offset(timeExtent[1],1))

    console.log(timeExtent)
    console.log(hourBins)
    // console.log(typeof(hourBins[0]))
    // console.log(moment(data[0].start))

    // Use the histogram layout to create a function that will bin the data
    // const binByHour = histogram()
    //   .value( (d, i) => {
    //     return d.start
    //   })
    //   .domain(timeExtent)
    //   .thresholds(hourBins)

    //console.log(binByHour(data))
      
    //console.log(i)
    const bins = []

    // console.log(xScl(hourBins[0]), xScl(hourBins[hourBins.length - 1]))
   // console.log(xScl(data[0].start))

    for (let i=0; i < hourBins.length - 1; i++) {
      let bin = {}

      bin.values = []
      if (bin.values.length > 0) bin.values.length = 0
      
      //let count = 0
      const x0 = hourBins[i]
      const x1 = hourBins[i + 1]
      bin['x0'] = x0
      bin['x1'] = x1

      // console.log('x0', xScl(x0), 'x1', xScl(x1))

      const incidentArray = []
      incidentArray.length = 0
     // console.log(incidentArray)
      data.forEach( (d) => {
        
        // if incident has an end time
        if (d.end > 0) {
          /*
          // contained within the hour
          if (xScl(d.start) >= xScl(x0) && xScl(d.start) < xScl(x1) && xScl(d.end) >= xScl(x0) && xScl(d.end) <= xScl(x1)) {
            incidentArray.push(d)
            return
          } 
          // OR case, end or start is before or after
          else if (xScl(d.start) > xScl(x0) && xScl(d.start) < xScl(x1) || xScl(d.end) > xScl(x0) && xScl(d.end) < xScl(x1)) {
            incidentArray.push(d)
            return
          }
          // check ending
          // else if (xScl(d.end) >= xScl(x0) && xScl(d.end) < xScl(x1)) {
          //   incidentArray.push(d)
          //   return
          // }
          // contains an hour within incident
          else if (xScl(d.start) <= xScl(x0) && xScl(d.end) >= xScl(x1)) {
            incidentArray.push(d)
            return
          }
          //ends before the hour is up
          // else if (xScl(d.start) <= xScl(x0) && xScl(d.end) <= xScl(x1)) {
          //   incidentArray.push(d)
          //   return
          // }
          // 
          */
          // Victor's amazing greedy algorithm realization - this works the same as above
          if ((xScl(d.start) <= xScl(x0) && xScl(d.end) < xScl(x0)) ||
               (xScl(d.start) > xScl(x1) && xScl(d.end) >= xScl(x1))) {
            return
          } else if (xScl(d.start) === xScl(d.end)) {
            return
          }
          // console.log('d.start', xScl(d.start), 'd.end', xScl(d.end))
          incidentArray.push(d)
        } 
        // case with made up durations (wait is 3600)
        else {
          if (xScl(d.start)  >= xScl(x0) && xScl(d.start) < xScl(x1)) {
            incidentArray.push(d)
            return
          }
        }
        
      })
      //console.log(incidentArray)
      //console.log('bin.values', bin.values)
      bin.values = incidentArray
      bins.push(bin)
    }
    console.log(bins)
    return bins
  }

  makeBinnedCanvasGraph = (bins) => {
    const canvas = this.canvas
    const ctx = canvas.getContext("2d")
    const w = canvas.width
    const h = canvas.height

    //console.log(this.state.mouseX, this.state.mouseY)

    ctx.clearRect(0, 0, this.props.size[0], this.props.size[1])
    bins.forEach( (bin,i) => {
      bin.values.sort( (a,b) => {
        return a.wait - b.wait
      })
      //console.log(bin)
      //const ht = h / bin.values.length
      //console.log(ht)
      const ht = (h - 30) / 38//bin.values.length
      const xPos = (w / bins.length) * i

      //console.log(xPos, (xPos + w/bins.length))


      bin.values.forEach( (d,j) => {
        //console.log(ht * j)
        if (this.state.mouseX >= xPos && 
          this.state.mouseX <= xPos + w/(bins.length) &&
          this.state.mouseY >= (h - 30) - (ht * j) &&
          this.state.mouseY <= (h - 30) - (ht * j) - ht - 1) {
          //console.log(d)
        }

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

    // const mouseCanvas = this.mouseCanvas
    // const mouseCtx = mouseCanvas.getContext("2d")
    // const maxWidth = 40

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

    const xScl = this.getScales(scalar, this.props.dateRange).xScale
    const yScl = this.getScales(scalar, this.props.dateRange).yScale

    // console.log(this.state.mouseX, this.state.mouseY)
    console.log(xScl(this.props.currentTime)/scalar)

    graphData.forEach( (d,i) => {
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
    graphData.forEach( (d,i) => {
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

  getScales = (scalar, dateRange) => {
    //const dateRangeGD = [graphData[0].start, graphData[graphData.length - 1].end]
    const waitRange = extent(graphData, d => {
      return d.wait
    })
    //console.log(dateRangeGD)
    //console.log(this.props.dateRange)

    const xScale = scaleTime().range([0, (this.props.size[0]) * scalar])
                              .domain([+dateRange[0], +dateRange[1]])
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
    //const position = this.svgLayer.getBoundingClientRect()
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

    const x = this.getScales(1, this.props.dateRange).xScale
    //const y = this.getScales(1).yScale

    const xAxis = axisBottom()
                    .scale(x)
                    .ticks(14)
                    // .tickFormat( d => {

                    // })
    const xCoord = x(this.props.currentTime)

    // console.log(this.props.activeData)
    // console.log(this.props.currentTime)
    // const filteredCalls = this.filterActiveCalls(this.props.currentTime)
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
  }
}