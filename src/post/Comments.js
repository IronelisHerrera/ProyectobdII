import React, { Component } from 'react'
import auth from './../auth/auth-helper'
import { CardHeader, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { comment, uncomment } from './api-post.js'
import DefaultPhoto from "../assets/images/user.svg"

const styles = theme => ({
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: '96%'
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing.unit,
    margin: `2px ${theme.spacing.unit * 2}px 2px 2px`
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em'
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer'
  }
})

class Comments extends Component {
  state = { text: '' }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }
  addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault()

    }
  }

  deleteComment = comment => event => {
    const jwt = auth.isAuthenticated()
    uncomment({
      userId: jwt.user._id
    }, {
        t: jwt.token
      }, this.props.postId, comment).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.props.updateComments(data.comments)
        }
      })
  }
  render() {
    const { classes } = this.props
    const commentBody = item => {
      return (
        <ListItem>
          <ListItemAvatar>
            <Avatar src={DefaultPhoto} />
          </ListItemAvatar>
          <ListItemText primary={item.usuario} secondary={item.comentario}/>
        </ListItem>
      )
      // return (
      //   <p className={classes.commentText}>
          
      //     <span>{item.usuario}</span>
      //     <br />
      //     {item.comentario}
      //     <span className={classes.commentDate}>
            
      //     </span>
      //   </p>
      // )
    }

    return (<div>
      <CardHeader
        // avatar={
        //   <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+auth.isAuthenticated().user._id}/>
        // }
        title={<TextField
          onKeyDown={this.addComment}
          multiline
          value={this.state.text}
          onChange={this.handleChange('text')}
          placeholder="Escribe un comentario"
          className={classes.commentField}
          margin="normal"
        />}
        className={classes.cardHeader}
      />
      {this.props.comentarios.map((item, i) => {
        return <CardHeader
          // avatar={
          //   <Avatar className={classes.smallAvatar} src={'/api/users/photo/'+item.postedBy._id}/>
          // }
          title={commentBody(item)}
          className={classes.cardHeader}
          key={i} />
      })
      }
    </div>)
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
}

export default withStyles(styles)(Comments)
