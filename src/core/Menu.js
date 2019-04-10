import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Button from 'material-ui/Button'
import { Link } from "react-router-dom"

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
  
  return <div/>
}

class Menu extends React.Component {
  render() {
    const { isUserLogged } = this.props;
    
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit">
            BLABLABLA
          </Typography>
          <Link to="/">
            <IconButton aria-label="Home">
              <HomeIcon />
            </IconButton>
          </Link>
          <LinkMenu route="signup" title="Registro" isUserLogged={isUserLogged} />
          <LinkMenu route="signin" title="Iniciar sesión" isUserLogged={isUserLogged} />

        </Toolbar>
      </AppBar>
    )
  }
}


export default Menu;
