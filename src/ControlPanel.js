import React, { Component } from 'react'
import Toggle from 'react-toggle'
import MultiToggle from './MultiToggle'
import Dropdown from 'react-dropdown'


const viewOptions = [
  {
    displayName: 'Incidents',
    value: true
  }, {
    displayName: 'Photos',
    value: false
  }
]

const dayOptions = [
  'Show entire week', 'Friday May 5', 'Saturday May 6', 'Sunday May 7', 'Monday May 8', 'Tuesday May 9', 'Wednesday May 10', 'Thursday May 11', 'Friday May 12'
]

export default class ControlPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewMode: this.props.viewMode,
      showHeatmap: this.props.showHeatmap
    }
  }

  render() {
    const { viewMode, showHeatmap, timeframe } = this.props

    return (
      <div className="ControlPanel">
        <MultiToggle
          options={viewOptions}
          selectedOption={viewMode}
          onSelectOption={this.props.handleToggle}
        />
        <Dropdown
          options={dayOptions}
          onChange={this.props.handleDropdown}
          value={timeframe}
        />
        <label>
          <Toggle
            defaultChecked={showHeatmap}
            icons={false}
            onChange={this.props.handleHeatmapToggle} />
          <span>Show Heatmap of longest wait times</span>
        </label>
      </div>
    )
  }
}