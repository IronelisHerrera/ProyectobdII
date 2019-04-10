import React, {Component} from 'react'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create} from './api-post.js'
import auth from './../auth/auth-helper'
import IconButton from 'material-ui/IconButton'
import PhotoCamera from 'material-ui-icons/PhotoCamera'

const styles = theme => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing.unit*3}px 0px 1px`
  },
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing.unit*3,
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none'
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: '90%'
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename:{
    verticalAlign: 'super'
  }
})

class NewPost extends Component {
  state = {
    texto: ""
  }

  componentDidMount = () => {
    
  }
  clickPost = () => {
    
  }
  handleChange = event => {
    let value = event.target.value;
    this.setState({texto: value});
  }
  render() {
    const {classes} = this.props;
    const { texto } = this.state;
    return (<div className={classes.root}>
      <Card className={classes.card}>
      
      <CardContent className={classes.cardContent}>
        <TextField
            placeholder="Comparte tus pensamientos ..."
            multiline
            rows="3"
            value={texto}
            onChange={this.handleChange}
            className={classes.textField}
            margin="normal"
        />
        
      </CardContent>
      <CardActions>
        <Button color="primary" variant="raised" disabled={this.state.text === ''} onClick={this.clickPost} className={classes.submit}>POST</Button>
      </CardActions>
    </Card>
  </div>)
  }
}

NewPost.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
}

export default withStyles(styles)(NewPost)
