import React, { Component } from 'react'
import { PlaybackControls, ProgressBar } from 'react-player-controls'
//import ProgressBar from './ProgressBar'
import GraphArea from './GraphArea'
import { PropTypes } from 'prop-types'

export default class Timeline extends Component {

  static propTypes = {
    totalTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: this.props.isPlaying,
      isPlayable: true,
      showPrevious: true,
      hasPrevious: false,
      showNext: true,
      hasNext: true,
      totalTime: this.props.totalTime,
      currentTime: this.props.currentTime,
      isSeekable: true,
      lastSeekStart: this.props.currentTime,
      lastSeekEnd: this.props.currentTime,

      graphWidth: 900,
      graphHeight: 0
    }
    // this.timer = null
  }

  componentWillMount() {
    //console.log(this.props.isPlaying)
    //this.mungeData(this.props.staticData)
    // const width = this.graphAreaDiv.clientWidth
    // const height = this.graphAreaDiv.clientHeight
    // this.setState({ graphWidth: width, graphHeight: height })

  }

  componentDidMount() {
    this.fitParentContainer()
    window.addEventListener('resize', this.fitParentContainer)
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitParentContainer)
  }

  getGraphSize() {
    const width = this.graphAreaDiv.clientWidth - 160
    const height = this.graphAreaDiv.clientHeight
    return { width, height }
  }

  fitParentContainer = () => {
    const { graphWidth } = this.state
    const currentContainerWidth = this.getGraphSize().width

    const shouldResize = graphWidth !== currentContainerWidth

    if (shouldResize) {
      this.setState({
        graphWidth: currentContainerWidth,
        graphHeight: this.getGraphSize().height
      })
    }
  }

  render() {
    const { isPlayable, showPrevious, showNext, isSeekable, graphWidth, graphHeight } = this.state
    const { currentTime, totalTime, isPlaying, staticData, formattedTime, hasNext, hasPrevious, startState } = this.props

    return(
      <div className={['Timeline', !startState && 'show'].join(' ')}>
        <div className="timeOutput">
          <div className="time">{formattedTime[1]}</div>
          <div className="day">{formattedTime[0]}</div>
        </div>
        <div className="GraphArea"
          ref={(graphAreaDiv) => this.graphAreaDiv = graphAreaDiv} >
          <GraphArea
            data={staticData}
            size={[graphWidth, graphHeight]}
            height={100}
            currentTime={this.props.unconvertTime(currentTime)}
            dateRange={this.props.dateRange}
            activeData={this.props.activeData}
          />
        </div>
        <div className="ControlArea">
          <PlaybackControls
            isPlayable={isPlayable}
            isPlaying={isPlaying}
            onPlaybackChange={this.props.handlePlay}
            showPrevious={showPrevious}
            showNext={showNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={this.props.handlePrevClip}
            onNext={this.props.handleNextClip}
            />
          <ProgressBar
            totalTime={totalTime}
            currentTime={currentTime}
            isSeekable={isSeekable}
            onSeek={this.props.handleSeek}
            onSeekStart={this.props.handleSeekStart}
            onSeekEnd={this.props.handleSeekEnd}
          />
        </div>
      </div>
    )
  }

}