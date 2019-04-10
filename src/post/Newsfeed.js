import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import PostList from './PostList'
import { listNewsFeed } from './api-post.js'
import NewPost from './NewPost'

const styles = theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})
class Newsfeed extends Component {
  state = {
    posts: []
  }
  loadPosts = () => {

  }
  componentDidMount = () => {
    this.loadPosts()
  }
  addPost = (post) => {

  }
  removePost = (post) => {

  }
  render() {
    const { classes, isUserLogged } = this.props
    if (isUserLogged) {
      return (
        <Card className={classes.card}>
          <Typography type="title" className={classes.title}>
            Blablabla
          </Typography>
          <Divider />
          <NewPost addUpdate={this.addPost} />
          <Divider />
          <PostList removeUpdate={this.removePost} posts={this.state.posts} />
        </Card>
      )
    }
    return <div/>
  }
}
Newsfeed.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Newsfeed)
