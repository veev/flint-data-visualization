import React, { Component } from 'react'
import MultiToggle from './MultiToggle'

const viewOptions = [
  {
    displayName: 'Incidents',
    value: true
  }, {
    displayName: 'Photos',
    value: false
  }
]

export default class ControlPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewMode: this.props.viewMode,
      groupSize: 2
    }

  }

  // onViewModeSelect = (value) => {
  //   this.setState()
  // }
  onGroupSizeSelect = (value) => {
    console.log(value)
    this.setState({ viewMode: value })
  }

  render() {
    const { viewMode, groupSize } = this.props

    return (
      <div className="ControlPanel">
        <MultiToggle
          options={viewOptions}
          selectedOption={viewMode}
          onSelectOption={this.props.handleToggle}
        />
      </div>
    )
  }
}