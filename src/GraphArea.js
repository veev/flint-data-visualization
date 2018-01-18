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

  componentWillMount() {
    console.log(this.props.data)
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
    const barWidth = this.props.size[0] / this.props.data.length
    const xScale = scaleTime().range([0, this.props.size[0]])
                              .domain(extent(combinedData, d => {
                                return +d.time.getTime()
                              }))
    const maxVal = max(combinedData, d => { return d.count })
    console.log(maxVal)

    const yScale = linear().range([this.props.size[1], 0])
                           .domain([0, max])

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
      .style("fill", (d,i) => this.props.hoverElement === d.id ?
        "#FCBC34" : this.props.colorScale(i))
      .style("stroke", "black")
      .style("stroke-opacity", 0.25)

    // const bar = 

    // select(node)
    //   .selectAll("rect")
    //   .data(this.props.data)
    //   .enter()
    //   .append("rect")
    //     .attr("class", "bar")
    //     .on("mouseover", this.props.onHover)
  }

  // dragChange = dragging => {
  //   // TODO - debounce
  //   this.setState({ dragging });
  // };

  // onChange = selection => {
  //   const { data, onChange } = this.props;
  //   const sortedData = data.sort((a, b) => +a.x0 - +b.x0);
  //   const extent = [
  //     min(sortedData, ({ x0 }) => +x0),
  //     max(sortedData, ({ x }) => +x)
  //   ];
  //   onChange(selection.map(d => Math.max(extent[0], Math.min(extent[1], +d))));
  // };

  // reset = () => {
  //   this.props.onChange(null);
  // };

  render() {
  	// return null
    return (
      <div className="GraphArea">
        <svg 
          ref={node => this.node = node}
          width={this.props.size[0]}
          height={this.props.size[1]}>
        </svg>
      </div>
    )
  //   const {
  //     style,
  //     data,
  //     width,
  //     height,
  //     padding,
  //     sliderHeight,
  //     disableHistogram
  //   } = this.props;

  //   const innerHeight = height - padding * 2;
  //   const innerWidth = width - padding * 2;
  //   const histogramHeight = innerHeight - sliderHeight;

  //   const sortedData = data.sort((a, b) => +a.x0 - +b.x0);
  //   const extent = [
  //     min(sortedData, ({ x0 }) => +x0),
  //     max(sortedData, ({ x }) => +x)
  //   ];
  //   const maxValue = max(sortedData, ({ y }) => +y);
  //   const scale = linear().domain(extent).range([0, innerWidth]);
  //   scale.clamp(true);

  //   const selection = this.props.selection || extent;

  //   const overrides = {
  //     selection,
  //     data: sortedData,
  //     scale,
  //     max: maxValue,
  //     dragChange: this.dragChange,
  //     onChange: this.onChange,
  //     reset: this.reset,
  //     width: innerWidth,
  //     dragging: this.state.dragging
  //   };

  //   return (
  //     <div
  //       style={Object.assign({}, style, {
  //         width,
  //         padding,
  //         boxSizing: "border-box",
  //         position: "relative"
  //       })}
  //     >
  //       {!disableHistogram &&
  //         <Histogram
  //           {...Object.assign({}, this.props, overrides, {
  //             height: histogramHeight
  //           })}
  //         />
  //     	}
  //     </div>
  //   );
  // }
}
}

// GraphArea.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       x0: PropTypes.number,
//       x: PropTypes.number,
//       y: PropTypes.number
//     })
//   ).isRequired,
//   onChange: PropTypes.func.isRequired,
//   selectedColor: PropTypes.string,
//   unselectedColor: PropTypes.string,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   selection: PropTypes.arrayOf(PropTypes.number),
//   barStyle: PropTypes.object,
//   barBorderRadius: PropTypes.number,
//   barPadding: PropTypes.number,
//   histogramStyle: PropTypes.object,
//   sliderStyle: PropTypes.object,
//   showOnDrag: PropTypes.bool,
//   style: PropTypes.object,
//   handleLabelFormat: PropTypes.string,
//   disableHistogram: PropTypes.bool
// };

// GraphArea.defaultProps = {
//   selectedColor: "#0074D9",
//   unselectedColor: "#DDDDDD",
//   showOnDrag: false,
//   width: 400,
//   height: 200,
//   barBorderRadius: 2,
//   barPadding: 3,
//   padding: 20,
//   sliderHeight: 25,
//   handleLabelFormat: "0.3P"
// };