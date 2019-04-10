import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Icon, Typography, TextField, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Link, Route } from 'react-router-dom'


import { ROUTES } from "../const"

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Signup extends Component {
  state = {
    nombres: '',
    clave: '',
    correo: '',
    open: false,
    error: ''
  }

  //Controlar los input
  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  

  requestNewUser = async () => {
    const { nombres, clave, correo } = this.state;
    const res = await fetch(`${ROUTES.USUARIO.NUEVO}?nombres=${nombres}&clave=${clave}&correo=${correo}`);
    const body = res.json();
    if (res.status != 200) throw Error(body.message)
    return body;
  }

  NewSubmit = () => {
    this.requestNewUser()
      .then(res => {
        console.log(res);
        this.setState({open: true})
        // this.props.history.push("/signin");
          
      })
      .catch(err => {
        console.log(err);
        alert("Ha ocurrido un error");
      })
  }



  render() {
    const { classes } = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Registrar
          </Typography>
          <TextField id="nombres" label="Nombre" className={classes.textField} value={this.state.nombres} onChange={this.handleChange('nombres')} margin="normal" /><br />
          <TextField id="correo" type="correo" label="Correo" className={classes.textField} value={this.state.correo} onChange={this.handleChange('correo')} margin="normal" /><br />
          <TextField id="clave" type="password" label="Clave"  className={classes.textField} value={this.state.clave} onChange={this.handleChange('clave')} margin="normal" />
          <br /> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.NewSubmit} className={classes.submit}>
            REGISTRAR
          </Button>
        </CardActions>
      </Card>
      <Dialog open={this.state.open} disableBackdropClick={true}>
        <DialogTitle>Registrar usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La cuenta se ha creado correctamente
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="raised">
              Iniciar sesión
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup)
