import React, { Component } from 'react'

export default class CommentDrawer extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const isOpen = this.props.isCommentDrawerOpen;
    return (
      <div className={`boardComments${isOpen ? ' open' : ''}`}>

      </div>
    )
  }
}