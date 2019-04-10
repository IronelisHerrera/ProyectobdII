import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
// import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
// import EditProfile from './user/EditProfile'
// import Profile from './user/Profile'

import Menu from './core/Menu'


class MainRouter extends Component {
  // Removes the server-side injected CSS when React component mounts

  state = 
  {
    isUserLogged: null
  }

  componentDidMount() {
    //Ni idea para que es esto
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  OnChangeStateCorreo = (value, callback) =>
  {
    // this.setState({isUserLogged: value}, () => this.props.history.push("/home"));
    this.setState({isUserLogged: value}, () => callback());
  }


  render() {
    const { isUserLogged } = this.state;
    
    return (<div>
      <Menu isUserLogged={isUserLogged} />
      {/* <Feed isUserLogged={isUserLogged}/> */}
      <Switch>
        {/* <Route exact path="/" component={() => <Home isUserLogged={isUserLogged}/> }/> */}
        <Route path="/signup" component={Signup}/>
        <Route path="/home" component={() => <Home isUserLogged={isUserLogged} />}/>
        <Route path="/signin" component={(props) => <Signin {...props} OnChangeStateCorreo={this.OnChangeStateCorreo} /> }/>
      </Switch>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>

    </div>)
  }
}

export default MainRouter
