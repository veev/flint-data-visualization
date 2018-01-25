import React, { Component } from 'react'
import Toggle from 'react-toggle'
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
      showHeatmap: this.props.showHeatmap
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
    const { viewMode, showHeatmap } = this.props

    return (
      <div className="ControlPanel">
        <MultiToggle
          options={viewOptions}
          selectedOption={viewMode}
          onSelectOption={this.props.handleToggle}
        />
        <label>
          <Toggle
            defaultChecked={showHeatmap}
            icons={false}
            onChange={this.props.handleHeatmapToggle} />
          <span>Show Heatmap of length of call</span>
        </label>
      </div>
    )
  }
}