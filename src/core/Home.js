import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Newsfeed from './../post/Newsfeed'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
})

class Home extends Component {
  state = {
    defaultPage: true
  }

  render() {
    const { classes, isUserLogged, posts, updatePosts } = this.props
    return (
      <div className={classes.root}>
        <Grid spacing={24}>
          <Grid xs={12}  >
            <Grid container justify="center">
              <Grid item xs={8} sm={7}>
                <Newsfeed isUserLogged={isUserLogged} posts={posts} updatePosts={updatePosts} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
