import React, { Component } from 'react'
import moment from 'moment'

export default class CommentDrawer extends Component {
  constructor(props) {
    super(props)

  }

  formatFacebookTime = (date) => {
    return moment(date).format("MMM Do YYYY") + " at " + moment(date).format("h:mma")
  }

  insertPost = () => {
    //const post = find(this.props.postData, ['id', row.properties.postId]);
    const post = this.props.postData
    if (post === {} ) {
      return null
    } else {
      return (
        <div className="post-wrapper">
          <div className="post">
            <div className="post-info">
              <div className="avatar"></div>
                <div className="metadata">
                  <div className="account">Flint Police Operations</div>
                  <div className="time">{this.formatFacebookTime(post.created_time)}</div>
                </div>
            </div>
            <div className="post-body"><p>{post.message}</p></div>
            {post.comments ? 
            <div className="postCommentWrapper">{this.insertComments(post.comments.data)}</div> : 
            null }
          </div>
        </div>
      )
    }
  }

  insertComments = (comments) => {
    //console.log(comments)
    return comments.map( (comment, i) => {
      //console.log(comment)
      return (
        <div className="whyDoWeNeedThisDiv" key={`why${i}`}>
        <div className="postComment" key={`${comment.id}-${i}`}><p>{comment.message}</p></div>
        {(comment.replies) ?
        <ul className="commentReplyWrapper">{this.insertReplies(comment.replies.data)}</ul> :
        null }
        </div>
      )
    })
  }

  insertReplies = (replies) => {
    return (
      <ul>
        {replies.map( (reply, i) => {
          //console.log(reply)
          return <li className="commentReply" key={`${reply.id}-${i}`}>{reply.message}</li>
        })
      }
      </ul>
    )
  }

  render() {
    const isOpen = this.props.isCommentDrawerOpen;
    return (
      <div 
        className={`boardComments${isOpen ? ' open' : ''}`}>
        <div className="bogus-padding">{this.insertPost()}</div>
      </div>
    )
  }
}