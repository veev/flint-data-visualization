import React from 'react'
import { Table } from 'semantic-ui-react'

const TableExampleSelectableInvertedRow = () => (
  <Table celled selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Notes</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row onSelect={console.log("row click")}>
        <Table.Cell>John</Table.Cell>
        <Table.Cell>Approved</Table.Cell>
        <Table.Cell textAlign='right'>None</Table.Cell>
      </Table.Row>
      <Table.Row onSelect={console.log("row click")}>
        <Table.Cell>Jamie</Table.Cell>
        <Table.Cell>Approved</Table.Cell>
        <Table.Cell textAlign='right'>Requires call</Table.Cell>
      </Table.Row>
      <Table.Row onSelect={console.log("row click")}>
        <Table.Cell>Jill</Table.Cell>
        <Table.Cell>Denied</Table.Cell>
        <Table.Cell textAlign='right'>None</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

export default TableExampleSelectableInvertedRow;