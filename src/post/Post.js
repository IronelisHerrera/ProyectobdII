import React, { Component } from 'react'
import auth from './../auth/auth-helper'
import {Typography, Card, CardHeader, CardContent, CardActions, Avatar } from '@material-ui/core'
// import Typography from '@material-ui/core/Typography'
// import Avatar from '@material-ui/core/Avatar'
// import IconButton from '@material-ui/core/IconButton'
// import DeleteIcon from '@material-ui/icons/Delete'
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
// import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { remove, like, unlike } from './api-post.js'
import Comments from './Comments'
import DefaultPhoto from "../assets/images/user.svg"

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit,
  }
})

class Post extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  }

  
  checkLike = (likes) => {
    const jwt = auth.isAuthenticated()
    let match = likes.indexOf(jwt.user._id) !== -1
    return match
  }

  like = () => {
    let callApi = this.state.like ? unlike : like
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
        t: jwt.token
      }, this.props.post._id).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ like: !this.state.like, likes: data.likes.length })
        }
      })
  }

  updateComments = (comments) => {
    this.setState({ comments: comments })
  }

  deletePost = () => {
    const jwt = auth.isAuthenticated()
    remove({
      postId: this.props.post._id
    }, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.props.onRemove(this.props.post)
        }
      })
  }
  render() {
    const { classes } = this.props
    console.log(this.props.post)
    console.log(this.props.post.descripcion)
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar src={DefaultPhoto}/>
          }

          title={this.props.post.correo}
          subheader={(new Date(parseInt(this.props.post.fecha))).toDateString()}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.text}>
            {this.props.post.descripcion}
          </Typography>          
        </CardContent>
        {/* <CardActions>
          <IconButton className={classes.button} aria-label="Comment" color="secondary">
            <CommentIcon />
          </IconButton> <span>{this.state.comments.length}</span>
        </CardActions> */}
        <Divider />
        <Comments comentarios={this.props.post.comentarios}  />
      </Card>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default withStyles(styles)(Post)
