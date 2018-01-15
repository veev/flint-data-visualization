import React, { Component } from 'react'
import ReactTable from 'react-table'
import find from 'lodash.find';

export default class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //selectedRow: 0
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

  componentWillMount() {

  }

  getActiveTime = (ts) => {
    console.log(this.props.currentTime);
    let t = this.props.currentTime;
    // let strt = feature.properties.unix_timestamp;
    if (t >= ts) {
      return t - ts;
    }
  }

  formatSeconds = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  }

  render() {
    const { activeData, postData } = this.props

    const columns = [{
      Header: 'Type',
      accessor: 'properties.type', // String-based value accessors!
      width: 90
    }, {
      Header: 'Priority',
      accessor: 'properties.priority',
      width: 70
    }, {
      Header: 'Time Active',
      accessor: 'properties.unix_timestamp',
      Cell: ({value}) => this.formatSeconds(this.getActiveTime(value))
    }, {
      Header: 'Posts',
      accessor: 'properties.postId',
      width: 70
    }, {
      Header: 'Posts',
      expander: true,
      // Header: () => <strong>More</strong>,
      width: 65,
      Expander: ({ isExpanded, ...rest }) =>
        <div>
          {isExpanded
            ? <span>&#x2299;</span>
            : <span>&#x2295;</span>}
        </div>,
      style: {
        cursor: "pointer",
        fontSize: 25,
        padding: "0",
        textAlign: "center",
        userSelect: "none"
      }
    }]

    const postMessages = [{
      Cell: row => (
                <div style={{ "whiteSpace": "normal" }}>
                {row.original.message}
                </div>
            )
    }]

    const messageReplies = [{
      Cell: row => (
              <div style={{ "whiteSpace": "normal" }}>
                {console.log(row)}
                {row.original.message}
              </div>
        )
    }]

    return(
      <div className="Board">
        <ReactTable
          data={activeData}
          columns={columns}
          className="-striped -highlight"
          showPagination={false}
          noDataText="No Active Calls"
          freezeWhenExpanded={true}
          style={{
            height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          getTrProps={(state, rowInfo, column) => {
            return {
              onMouseEnter: (e) => {
                //console.log(handleHighlight)
                //console.log('A Td Element was hovered!')
                // console.log('it produced this event:', e)
                //console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo.original)
                this.props.handleHighlight(rowInfo.original)
                //this.setState({ selectedRow: rowInfo.original })
              },
              onMouseLeave: (e) => {
                this.props.handleHighlight(this.props.defaultFeature)
              }
            }
          }}
          SubComponent={ (row) => {
            let post = find(postData, ['id', row.original.properties.postId]);
            if (post != undefined) {
              console.log(post)
            }
            return (
              <div style={{ padding: "20px" }}>
                {(post != undefined) ? post.message : ''}
                {(post != undefined && post.comments.data.length > 0) ?
                  <ReactTable
                  data={post.comments.data}
                  columns={postMessages}
                  showPagination={false}
                  SubComponent={row => {
                    console.log(row.original)
                    return (
                      <div>
                        {(row.original.comment_count > 0) ? 
                          row.original.replies.data.map( (item, i) => {
                            console.log(item)
                            return <li key={i}>{item.message}</li>
                          }) :  ''
                      }
                      </div>
                    );
                  }}
                  /> : ''
                }
              </div>
            );
          }}
          onExpandedChange={(e) => {
            //console.log(e)
          }}
        />
      </div>
    )
  }
}