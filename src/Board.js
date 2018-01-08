import React, { Component } from 'react'
// import TableExampleSelectableInvertedRow from './TableExampleSelectableInvertedRow'
import { Table } from 'semantic-ui-react'

export default class Board extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log(this.props.sourceData)
  }

  render() {
    let activeIncidents = this.props.sourceData.features
    // console.log(data)
    return(
      <div className="Board">
        {activeIncidents.map(activeIncident => {
          <TableExampleSelectableInvertedRow key={activeIncident.id} incidentInfo={activeIncident}/>
        })}
      </div>
    )
  }
}