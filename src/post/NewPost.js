import React, {Component} from 'react'
import  { Button, TextField, Card, CardHeader, CardContent, CardActions } from '@material-ui/core'

import {withStyles} from '@material-ui/core/styles'
import { ROUTES } from "../const"

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

  sendPost = () =>
  {
    this.requestSendPost()
    .then(res => {
      if(!res.ok)
      {
        alert("Ha ocurrido un error haciendo el post");
      }
    })
    .catch(err => {
      console.log(err);
      alert("Ha ocurrido un error haciendo el post");
    })
  }
  
  requestSendPost = async() =>
  {
    const { texto } = this.state;
    const correo = window.localStorage.getItem("correo");
    // descripcion: "",
    // correo: ""
    const res = await fetch(`${ROUTES.POST.NUEVO}?descripcion=${texto}&correo=${correo}&fecha=${+ new Date()}`);
    const body = res.json()
    if(res.status != 200) throw Error(body.message)
    return body;
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
        <Button color="primary" variant="raised" disabled={this.state.text === ''} onClick={this.sendPost} className={classes.submit}>POST</Button>
      </CardActions>
    </Card>
  </div>)
  }
}



export default withStyles(styles)(NewPost)
// export default withStyles(styles)(Newsfeed)