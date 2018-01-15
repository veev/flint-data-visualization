import React, { Component } from 'react'
import ReactTable from 'react-table'

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
      accessor: 'properties.postId'
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

    const postColumns = [{
      accessor: 'message'
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
            console.log(row.original)
            return (
              <div style={{ padding: "10px" }}>

                <ReactTable
                  data={activeData}
                  columns={postColumns}
                  showPagination={false}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "10px" }}>
                        Another Sub Component!
                      </div>
                    );
                  }}
                />
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