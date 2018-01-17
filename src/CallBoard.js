import React, { Component } from 'react'
import find from 'lodash.find'

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

  getActiveTime = (ts) => {
    console.log(this.props.currentTime, ts)
    let t = this.props.currentTime
    // let strt = feature.properties.unix_timestamp;
    if (t >= ts) {
      return t - ts
    }
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
            <div className="boardRow-type">{row.properties.type}</div>
            <div className="boardRow-priority">{row.properties.priority}</div>
            <div className="boardRow-activeTime">{this.formatSeconds(this.getActiveTime(row.properties.unix_timestamp))}</div>
            {row.properties.postId.length ?
            (<div 
              className="boardRow-expander" 
              onClick={() => this.toggleOpenIncident(row.properties.id)}>
                <div>
                  {incidentIsOpen
                    ? <span>&#x2299;</span>
                    : <span>&#x2295;</span>}
                </div>
              </div>) :
            null }
          </div>
          <div className={"boardRow-openIncident " + (incidentIsOpen ? "boardRow-openIncident-open" : "")} >
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
        <div className="postMessageWrapper">
          <div className="postMessage">{post.message}</div>
          {post.comments ? 
          <div className="postCommentWrapper">{this.insertComments(post.comments.data)}</div> : 
          null }
        </div>
      )
    }
  }

  insertComments = (comments) => {
    //console.log(comments)
    return comments.map( (comment, i) => {
      console.log(comment)
      return (
        <div className="whyDoWeNeedThisDiv">
        <div className="postComment" key={`${comment.id}-${i}`}>{comment.message}</div>
        {(comment.comment_count > 0) ?
        <ul className="commentReplyWrapper">{this.insertReplies(comment.replies.data)}</ul> :
        null }
        </div>
      )
    })
  }

  insertReplies = (replies) => {
    return (
      <ul>
        {replies.map( reply => {
          //console.log(reply)
          return <li className="commentReply" key={reply.id}>{reply.message}</li>
        })
      }
      </ul>
    )
  }

	render() {

    const { activeData, postData } = this.props

		return (
      <div className="Board" >
        <div className="boardHeader">
          <div className="boardHeader-type">Type</div>
          <div className="boardHeader-priority">Priority</div>
          <div className="boardHeader-activeTime">Time Active</div>
          <div className="boardHeader-posts">Posts</div>
        </div>
        <div className="boardContent">{this.makeRows(activeData)}</div>
      </div>
		)
	}
}