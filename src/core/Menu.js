import React from 'react'
import AppBar from '@material-ui/core//AppBar'
import Toolbar from '@material-ui/core//Toolbar'

import Typography from '@material-ui/core//Typography'
import IconButton from '@material-ui/core//IconButton'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search';
// import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core//Button'
import { Link } from "react-router-dom"
import { TextField, InputBase, List, ListItem, Dialog, DialogTitle, DialogContent, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/';
// import { fade } from '@material-ui/core//core/styles/colorManipulator';
import { fade } from '@material-ui/core//styles/colorManipulator';
import DefaultAvatar from "../assets/images/user.svg"

import { ROUTES } from "../const"

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});
const LinkMenu = (props) => {
  const { route, title, isUserLogged } = props;
  if (!isUserLogged) {
    return (
      <Link to={`/${route}`}>
        <Typography variant="title" style={{ color: "white", paddingLeft: 10, textDecoration: "none" }}  >
          {title}
        </Typography>
      </Link>
    )
  }

  return <div />
}

const ModalUsuarios = (props) => {
  const { data, open, closeModal, SeguirUsuario} = props;
  
  return <Dialog open={open} onBackdropClick={closeModal} >
    <DialogTitle>
      Coincidencias
    </DialogTitle>
    <DialogContent>
      
      <List>
        {data.map((item, i) => {
          return (
            <ListItem button onClick={() => SeguirUsuario(item)} >
              <ListItemAvatar>
                <Avatar src={DefaultAvatar}/>
              </ListItemAvatar>
              {/* <Typography variant="subheading">Usuario de ejemplo</Typography> */}
              <ListItemText primary={item.nombres}/>
            </ListItem>
          )
        })}
        {data.length == 0 && <Typography variant="display1">Sin coincidencias</Typography>}
      </List>
    </DialogContent>
  </Dialog>

}


class Menu extends React.Component {

  state =
  {
    usuarios: [], modalOpen: false,
    textoBuscar: ""
  }

  closeModal = () => this.setState({modalOpen: false});

  handleBuscarText = (event) =>
  {
    let { textoBuscar } = this.state;
    let value = event.target.value;
    textoBuscar = value;    
    this.setState({textoBuscar});
  }

  handleBuscarKey = (event) =>
  {
    console.log(event.key)
    if(event.key == "Enter")
    {
      this.getUsuarios();
      // this.setState({modalOpen: true})
    }
  }

  requestUsuarios = async() =>
  {
    let { textoBuscar } = this.state;
    const res = await fetch(`${ROUTES.USUARIO.BUSCAR}?value=${textoBuscar}`);
    const body = res.json();
    if(res.status != 200) throw Error(body.message)
    return body;
  }

  getUsuarios = () =>
  {
    this.requestUsuarios()
    .then(res => this.setState({usuarios: res, modalOpen: true}))
    .catch(err => {
      console.log(err);
      alert("Ha ocurrido un error solicitando los datos");
    })
  }

  requestSeguirUsuario = async (usuarioAseguir) =>
  {
    const usuarioActual = window.localStorage.getItem("usuario");
    const res = await fetch(`${ROUTES.USUARIO.SEGUIR}?from=${usuarioActual}&to=${usuarioAseguir.correo}`)
    const body = res.json();
    if(res.status != 200) throw Error(body.message)
    return body;
  }

  SeguirUsuario = (usuarioAseguir) =>
  {
    this.requestSeguirUsuario(usuarioAseguir)
    .then(res => {
      console.log(res);
      if(!res.error)
      {
        alert("Has empezado a seguir este usuario");
      }
    })
    .catch(err => {
      console.log(err);
      alert("Ha ocurrido un error")
    })
  }


  render() {
    const { isUserLogged, classes } = this.props;
    const { usuarios, modalOpen, textoBuscar } = this.state;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} type="title" color="inherit">
            Red social db
          </Typography>
          <Link to="/">
            <IconButton aria-label="Home">
              <HomeIcon />
            </IconButton>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            {/* <InputBase */}
            <InputBase
              placeholder="Buscar"
              value={textoBuscar}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={this.handleBuscarText}
              onKeyPress={this.handleBuscarKey}
            />
          </div>
          <div className={classes.grow} />

          <LinkMenu route="signup" title="Registro" isUserLogged={isUserLogged} />
          <LinkMenu route="signin" title="Iniciar sesión" isUserLogged={isUserLogged} />
          <ModalUsuarios data={usuarios} open={modalOpen} closeModal={this.closeModal} SeguirUsuario={this.SeguirUsuario} />
        </Toolbar>
      </AppBar>
    )
  }
}


// export default Menu;
export default withStyles(styles)(Menu);