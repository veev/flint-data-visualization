import React, { Component } from 'react'

export default class MessageIcon extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fillColor: "#0084ff",
      postActive: this.props.postActive
    }
  }

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="20"
           height="20" 
           viewBox="96 93 322 324"
           onMouseEnter={() => this.setState({ fillColor: "#fff" })}
           onMouseLeave={() => this.setState({ fillColor: "#0084ff" })}
        >
        <path d="M257 93c-88.918 0-161 67.157-161 150 0 47.205 23.412 89.311 60 116.807V417l54.819-30.273C225.449 390.801 240.948 393 257 393c88.918 0 161-67.157 161-150S345.918 93 257 93zm16 202l-41-44-80 44 88-94 42 44 79-44-88 94z" fill={ this.props.postActive ? "#fff" : this.state.fillColor }/>
      </svg>
    )
  }
}



  


