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
import { TextField, InputBase } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/';
// import { fade } from '@material-ui/core//core/styles/colorManipulator';
import { fade } from '@material-ui/core//styles/colorManipulator';

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

class Menu extends React.Component {
  render() {
    const { isUserLogged, classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} type="title" color="inherit">
            BLABLABLA
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
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <div className={classes.grow} />

          <LinkMenu route="signup" title="Registro" isUserLogged={isUserLogged} />
          <LinkMenu route="signin" title="Iniciar sesión" isUserLogged={isUserLogged} />

        </Toolbar>
      </AppBar>
    )
  }
}


// export default Menu;
export default withStyles(styles)(Menu);