import React, { Component } from 'react'
import find from 'lodash.find'
import { map_range } from './utils'
import { interpolateHcl, interpolateRgb } from 'd3-interpolate'
import { scaleLinear, scalePow } from 'd3-scale'

export default class CallBoard extends Component {
	constructor (props) {
		super(props)
    this.state = {
      openIncidents: [],
      rowIsHighlighted: false
    }
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
    this.setState({
      openIncidents: temp
    })
  }

  // TODO: get updated elapsed time from active incidents in app
  getActiveTime = (ts) => {
    //console.log(this.props.currentTime, ts)
    const t = this.props.currentTime
    // let strt = feature.properties.unix_timestamp;
    if (t >= ts) {
      //console.log(t - ts)
      return t - ts
    }
  }

  getStatusBar = (ts) => {
    //get width of elapsed time, up to an hour (60 sec * 60 min)
    const elapsedTime = this.getActiveTime(ts)
    let barWidth = map_range(elapsedTime, 0, 3600, 0, 100)
    if (barWidth > 100) barWidth = 100
    return barWidth
  }

  formatSeconds = (seconds) => {
    // ok to do if elapsed seconds are under 24 hours
    return new Date(seconds * 1000).toISOString().substr(11, 8)
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
      const incidentIsOpen = this.state.openIncidents.includes(row.properties.id)
      const rowIsHighlighted = (row.properties.id === this.props.mapHighlightedFeature.properties.id || row.properties.id === this.props.boardHighlightedFeature.properties.id)
      //this.handleRowHighlight(row)
      return (
        <div className="boardWrapper" key={row.properties.id}>
          <div className={"boardRow " + (rowIsHighlighted ? "highlight" : "")}
            onMouseEnter={() => this.props.handleHighlight(row)}
            onMouseLeave={() => this.props.handleHighlight(this.props.defaultFeature)}
          >
            <div className="boardColumn boardColumn-type">{row.properties.type}</div>
            <div className="boardColumn boardColumn-priority">{row.properties.priority}</div>
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
              onClick={() => this.toggleOpenIncident(row.properties.id)}>
                <div>
                  {incidentIsOpen
                    ? <span>&#x2299;</span>
                    : <span>&#x2295;</span>}
                </div>
              </div>) :
            <div className="boardColumn boardRow-expander"></div>}
          </div>
          <div className={"boardColumn boardRow-openIncident " + (incidentIsOpen ? "boardColumn boardRow-openIncident-open" : "")} >
            <div className="bogus-padding">{this.insertPost(row)}</div>
          </div>
        </div>
      )
    })
  }

  insertPost = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId]);
    if (post !== undefined) {
      // console.log(row.properties.postId)
      // console.log(post.comments.data)
      return (
        <div className="post-wrapper">
          <div className="post">
            <div className="post-info">
              <div className="avatar"></div>
                <div className="metadata">
                  <div className="account">Flint Police Operations</div>
                  <div className="time">{post.created_time}</div>
                </div>
            </div>
            <div className="post-body"><p>{post.message}</p></div>
            {post.comments ? 
            <div className="postCommentWrapper">{this.insertComments(post.comments.data)}</div> : 
            null }
          </div>
        </div>
      )
    }
  }

  insertComments = (comments) => {
    //console.log(comments)
    return comments.map( (comment, i) => {
      //console.log(comment)
      return (
        <div className="whyDoWeNeedThisDiv" key={`why${i}`}>
        <div className="postComment" key={`${comment.id}-${i}`}><p>{comment.message}</p></div>
        {(comment.replies) ?
        <ul className="commentReplyWrapper">{this.insertReplies(comment.replies.data)}</ul> :
        null }
        </div>
      )
    })
  }

  insertReplies = (replies) => {
    return (
      <ul>
        {replies.map( (reply, i) => {
          //console.log(reply)
          return <li className="commentReply" key={`${reply.id}-${i}`}>{reply.message}</li>
        })
      }
      </ul>
    )
  }

	render() {

    const { activeData, postData } = this.props

		return (
      <div className="Board">
        <div className="boardDescription">
        The amount of active incidents at a given moment. Some incidents have been waiting for officers to appear for over an hour.
        </div>
        <div className="boardHeader">
          <div className="boardColumn boardColumn-type">Type</div>
          <div className="boardColumn boardColumn-priority">Priority</div>
          <div className="boardColumn boardColumn-activeTime">Elapsed Time</div>
          <div className="boardColumn boardColumn-status">Status</div>
          <div className="boardColumn boardColumn-expander">Posts</div>
        </div>
        <div className="boardContent">{this.makeRows(activeData)}</div>
      </div>
		)
	}
}