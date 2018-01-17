import React, { Component } from 'react'
import find from 'lodash.find'

export default class CallBoard extends Component {
	constructor (props) {
		super(props)
    this.state = {
      openIncidents: []
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

  makeRows = (data) => {
    return data.map( row => {
      const incidentIsOpen = this.state.openIncidents.includes(row.properties.id)
      return (
        <div className="boardWrapper" key={row.properties.id}>
          <div className="boardRow"
            onMouseEnter={() => this.props.handleHighlight(row)}
            onMouseLeave={() => this.props.handleHighlight(this.props.defaultFeature)}
          >
            <div className="boardRow-type">{row.properties.type}</div>
            <div className="boardRow-priority">{row.properties.priority}</div>
            <div className="boardRow-activeTime">{row.properties.time}</div>
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
            <div className="bogus-padding">{this.insertComments(row)}</div>
          </div>
        </div>
      )
    })
  }

  insertComments = (row) => {
    const post = find(this.props.postData, ['id', row.properties.postId]);
    if (post !== undefined) {
      console.log(post.comments)
      return (
        <div className="postMessageWrapper">
          <div className="postMessage">{post.message}</div>
          {post.comments.data.length > 0 ? 
          <div className="postCommentWrapper">{"test"}</div> : 
          null }
        </div>
      )
    }
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