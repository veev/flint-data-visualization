import React, { Component } from 'react'
import find from 'lodash.find'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import { map_range } from './utils'
import { interpolateRgb } from 'd3-interpolate'
import { scaleLinear, scalePow } from 'd3-scale'
import MessageIcon from './MessageIcon'
import CommentDrawer from './CommentDrawer'

const timeout = ms => new Promise(res => setTimeout(res, ms))

export default class CallBoard extends Component {
	constructor (props) {
		super(props)
    this.state = {
      openIncidents: [],
      openPost: {},
      isCommentDrawerOpen: false,
      rowIsHighlighted: false
    }
    // need this to format moment durations
    momentDurationFormatSetup(moment)
	}

  static defaultProps = {
    // need a fallback feature object for when no row is highlighted
    // needs to have eventNumber property to work with map.setFilter
    defaultFeature: {
      type: 'Feature',
      geometry: { },
      properties: {
        eventNumber: ''
      }
    }
  }

  toggleOpenIncident = (r) => {
    const temp = this.state.openIncidents
    if (this.state.openIncidents.includes(r)) {
      temp.pop(r)
    } else {
      temp.push(r)
    }
    this.setState({ openIncidents: temp })
  }

  setPostInfo = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId])
    this.setState({ openPost: post || {} })
  }

  isPostActive = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId])
    if (post.id === this.state.openPost.id && this.state.isCommentDrawerOpen) {
      return true
    } else if (post.id === this.state.openPost.id && !this.state.isCommentDrawerOpen) {
      return false
    }
  }

  handleBadgeClick = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId])
    // clicked on same post if it's open
    if (post.id === this.state.openPost.id) {
      //console.log("same post", this.state.openPost)
      this.setState({ isCommentDrawerOpen: false })
      timeout(800).then(() => {
        this.setState({ openPost: {} })
      })
    } 
    // first time clicked on a post
    else if (Object.keys(this.state.openPost).length === 0) {
      //console.log("empty post start", this.state.openPost)
      this.setPostInfo(row)
      this.setState({ isCommentDrawerOpen: true })
    } 
    // clicked on a different post if it's already open
    else {
      //console.log("post is open", this.state.openPost)
      this.setState({ isCommentDrawerOpen: false })
      //await timeout(1000)
      timeout(800).then(() => {
        this.setPostInfo(row)
        this.setState({ isCommentDrawerOpen: true })
      })
      
    }
    //this.setState({ isCommentDrawerOpen: !this.state.isCommentDrawerOpen }
  }

  // TODO: get updated elapsed time from active incidents in app
  getActiveTime = (ts) => {
    //console.log(this.props.currentTime, ts)
    const t = this.props.currentTime
    if (t >= ts) {
      //console.log(t - ts)
      return t - ts
    }
  }

  getStatusBar = (ts) => {
    //get width of elapsed time, up to an hour (60 sec * 60 min)
    const elapsedTime = this.getActiveTime(ts) / 1000
    let barWidth = map_range(elapsedTime, 0, 3600, 0, 100)
    if (barWidth > 100) barWidth = 100
    return barWidth
  }

  formatSeconds = (millis) => {
    return moment.duration(millis, 'milliseconds').format('hh:mm:ss', { trim: false })
  }

  // highlightOn = (row) => {
  //   // this calls a function in the main App to update highlightedFeature
  //   this.props.handleHighlight(row)
  // }

  // handleRowHighlight = (row) => {
  //   const activeRow = (row.properties.id === this.props.mapHighlightedFeature.properties.id)
  //   this.setState({ rowIsHighlighted: activeRow })
  // }

  // componentWillUpdate(nextProps, nextState) {
  //   //console.log(nextProps, nextState)
  // }
  getIncidentColor = (incident) => {
    //console.log(+incident.properties.elapsedTime)
    let colr, colrScl;
    if (incident.properties.status === 'notAssigned' || incident.properties.status === 'waitingforUnit') {
      //colr = '#FB3F48'
      colrScl = scaleLinear()
          .domain([0, 7200])
          //.range(['#FBF23F', '#FB3F48'])
          //'#F7F7F7', '#FBF23F', 
          //.range(['#FB943F', '#FB3F48'])
          .range(['#FEF877', '#FB3F48'])
          .interpolate(interpolateRgb)
          .clamp(true)

      colr = colrScl(+incident.properties.elapsedTime)

    } else if (incident.properties.status === 'onScene') {
      //colr = '#31CE75'
      colrScl = scaleLinear()
          .domain([1800, 18000])
          .range(['#31CE75', '#19673A'])
          .interpolate(interpolateRgb)
          .clamp(true)

      colr = colrScl(+incident.properties.elapsedTime)

    } else {
      colr = '#FF00FF'
    }
    return colr
  }

  makeRows = (data) => {
    return data.map( row => {
      //const incidentIsOpen = this.state.openIncidents.includes(row.properties.id)
      const rowIsHighlighted = (row.properties.id === this.props.mapHighlightedFeature.properties.id || row.properties.id === this.props.boardHighlightedFeature.properties.id)
      const numComments = this.getNumComments(row)
      //this.handleRowHighlight(row)
      return (
        <div className="boardWrapper" key={row.properties.id}>
          <div className={"boardRow " + (rowIsHighlighted ? "highlight" : "")}
            onMouseEnter={() => this.props.handleHighlight(row)}
            onMouseLeave={() => this.props.handleHighlight(this.props.defaultFeature)}
          >
            <div className="boardColumn boardColumn-type">{row.properties.type}</div>
            <div className="boardColumn boardColumn-activeTime">{this.formatSeconds(this.getActiveTime(row.properties.unix_timestamp))}</div>
            <div className="boardColumn boardColumn-status">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#dadada',
                  borderRadius: '2px'
                }}
              >
                <div
                  style={{
                    width: `${this.getStatusBar(row.properties.unix_timestamp)}%`,
                    height: '100%',
                    backgroundColor: `${this.getIncidentColor(row)}`,
                    // row.properties.status === 'notAssigned' || row.properties.status === 'waitingforUnit' ? '#FB3F48'
                    //   : row.properties.status === 'onScene' ? '#72D687'
                    //   : '#ff2e00',
                    borderRadius: '2px',
                    transition: 'all .2s ease-out'
                  }}
                />
              </div>
            </div>
            {row.properties.postId.length ?
            (<div 
              className="boardColumn boardRow-expander" 
              onClick={() => this.handleBadgeClick(row)}>
                <div className="badge-wrapper">
                  <MessageIcon 
                    postActive={this.isPostActive(row)}
                  />
                  <div className="likesBadge" width={`${numComments.stringLength + 0.5}em`}>{numComments.numComments}</div>
                </div>
              </div>) :
            <div className="boardColumn boardRow-expander">
              <div className="badge-wrapper"></div>
            </div>}
          </div>
        </div>
      )
    })
  }

  getNumComments = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId])
    if (post !== undefined) {
      const stringLength = (post.numComments).toString().length
      return {numComments: post.numComments, stringLength}
    }
  }

	render() {

    const { activeData, startState } = this.props

		return (
      <div className={['grossWrapper', !startState && 'show'].join(' ')}>
        <div className="Board">
          <div className="boardDescription">
          The amount of active incidents at a given moment. Some incidents have been waiting for officers to appear for over an hour.
          </div>
          <div className="boardHeader">
            <div className="boardColumn boardColumn-type">Type</div>
            <div className="boardColumn boardColumn-activeTime">Elapsed Time</div>
            <div className="boardColumn boardColumn-status">Status</div>
            <div className="boardColumn boardColumn-expander">Posts</div>
          </div>
          <div className="boardContent">{this.makeRows(activeData)}</div>
        </div>
        <CommentDrawer 
          isCommentDrawerOpen={this.state.isCommentDrawerOpen}
          postData={this.state.openPost}
        />
      </div>

		)
	}
}