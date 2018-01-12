import React, { Component } from 'react'
// import TableExampleSelectableInvertedRow from './TableExampleSelectableInvertedRow'
import { Table } from 'semantic-ui-react'

export default class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentWillMount() {
    //console.log(this.props.sourceData)
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const activeIncidents = this.props.activeData
    // const { contextRef } = this.state

    return(
      <div className="Board" ref={this.handleContextRef}>
        <Table celled selectable compact>
          <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Priority</Table.HeaderCell>
                <Table.HeaderCell>Active Time</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
          <Table.Body>
          { activeIncidents.map(activeIncident => {
            // <TableExampleSelectableInvertedRow key={activeIncident.id} incidentInfo={activeIncident}/>
            return(
                <Table.Row key={activeIncident.properties.id}>
                  <Table.Cell>{activeIncident.properties.type}</Table.Cell>
                  <Table.Cell>{activeIncident.properties.priority}</Table.Cell>
                  <Table.Cell>{activeIncident.properties.time}</Table.Cell>
                </Table.Row>
              ) 
            })
          }
          </Table.Body>
        </Table>
      </div>
    )
  }
}