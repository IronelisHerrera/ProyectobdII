import React, {Component} from 'react'
import {Card, CardActions, CardContent, Button, TextField, Typography, Icon} from '@material-ui/core'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import { ROUTES } from "../../const"

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

class Signin extends Component {
  state = {
      email: '',
      password: '',
      error: '',      
  }
 
  clickSubmit = () => {
    let { email } = this.state;
    this.requestLogin()
    .then(res => {
      if(res.length == 0)
      {
        alert("Usuario y/o contraseñas incorrectos");
      } else
      {
        //Guardar el usuario logeado en el navegador
        this.props.OnChangeStateCorreo(email, () => this.props.history.push("/home") );
        window.localStorage.setItem("correo", email);        
      }
      console.log(res);
    })
    .catch(err => {
      console.log(err);
      alert("Ha ocurrido un error");
    })
  }

  requestLogin = async () => {
    const { email, password } = this.state;
    const res = await fetch(`${ROUTES.SESION.LOGIN}?correo=${email}&clave=${password}`)
    const body = res.json();
    if(res.status != 200) throw Error(body.message)
    return body;
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  render() {
    const {classes} = this.props    

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Iniciar sesión
          </Typography>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>ENTRAR</Button>
        </CardActions>
      </Card>
    )
  }
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signin)