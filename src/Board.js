import React, { Component } from 'react'
import ReactTable from 'react-table'

export default class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {}
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
    const activeIncidents = this.props.activeData

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
    }]

    return(
      <div className="Board">
        <ReactTable
          data={activeIncidents}
          columns={columns}
          className="-striped -highlight"
          showPagination={false}
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
              },
              onMouseLeave: (e) => {
                this.props.handleHighlight(this.props.defaultFeature)
              }
            }
          }}
        />
      </div>
    )
  }
}