import React, { Component } from 'react'
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
import Comments from './Comments'
import DefaultPhoto from "../assets/images/user.svg"
import { isNull, isNullOrUndefined } from 'util';

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
    comments: [],    
  }

  
  checkLike = (likes) => {
    
  }

  like = () => {
    
  }

  updateComments = (comments) => {
    
  }

  deletePost = () => {
    
  }
  render() {
    const { classes, post, updatePosts } = this.props;    
    let ubicacion = "";
    console.log("POST: ", post)
    if(post.ciudad != "null")
    {      
      
      console.log("ENTRA: ", post.ciudad)
      ubicacion = `${post.pais}, ${post.ciudad}`;
    } 

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar src={DefaultPhoto}/>
          }

          title={this.props.post.correo}
          subheader={
            <span>
              {(new Date(parseInt(this.props.post.fecha))).toDateString()}
              <br/>
              {ubicacion}
            </span>
          }

          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.text}>
            {this.props.post.descripcion}
          </Typography>          
        </CardContent>        
        <Divider />
        <Comments post={post} updatePosts={updatePosts} comentarios={post.comentarios}  />
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
