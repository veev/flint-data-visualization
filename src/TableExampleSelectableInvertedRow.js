import React from 'react'
import { Table } from 'semantic-ui-react'

const TableExampleSelectableInvertedRow = (props) => (
  <Table celled selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Active Time</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>{props.incidentInfo.properties.type}</Table.Cell>
        <Table.Cell>Approved</Table.Cell>
        <Table.Cell textAlign='right'>{props.incidentInfo.properties.time}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

export default TableExampleSelectableInvertedRow;