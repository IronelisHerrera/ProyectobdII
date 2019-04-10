import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './auth/Signin'

import Menu from './core/Menu'
import { ROUTES } from "./const"
import { Typography } from '@material-ui/core';

const Background = (props) => {
  // return <div style={{backgroundImage: "src(https://as2.ftcdn.net/jpg/00/52/17/95/1000_F_52179507_7h0ZgjuVxJVnJU2C7e87AOvR47cAH8iF.jpg)"}} >
  return <div style={{ textAlign: "center", paddingTop: 247 }} >    
      <Typography variant="display4">
        Bienvenida
    </Typography>    
  </div>
}

class MainRouter extends Component {
  state =
    {
      isUserLogged: null,
      posts: []
    }

  componentDidMount() {
    //Ni idea para que es esto
    // const jssStyles = document.getElementById('jss-server-side')
    // if (jssStyles && jssStyles.parentNode) {
    //   jssStyles.parentNode.removeChild(jssStyles)
    // }
    this.setState({posts: []})
  }

  OnChangeStateCorreo = (value, callback) => {
    // this.setState({isUserLogged: value}, () => this.props.history.push("/home"));
    this.setState({ isUserLogged: value }, () => {
      callback();
      this.GetPosts();
    });
  }


  requestGetPosts = async () => {
    const correo = window.localStorage.getItem("usuario");
    const res = await fetch(`${ROUTES.POST.ROOT}?usuarioActual=${correo}`);
    const body = res.json()
    if (res.status != 200) throw Error(body.message)
    return body;
  }

  GetPosts = () => {
    this.requestGetPosts()
      // .then(res => this.setState({posts: res, loaded: 1}))
      .then(res => {
        // let { posts } = this.state;
        // console.log("RESULT: ", res);
        // posts.push({...res})      
        this.setState({ posts: res }, () => console.log("POSTSsss: ", this.state.posts));

      })
      .catch(err => {
        console.log(err);
        alert("Ha ocurrido un error cargando los posts")
      })
  }



  render() {
    const { isUserLogged, posts } = this.state;

    return (<div>
      <Menu isUserLogged={isUserLogged} requestGetPosts={this.requestGetPosts} />
      {/* <Feed isUserLogged={isUserLogged}/> */}
      <Switch>
        <Route exact path="/" component={() => <Background />} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={() => <Home isUserLogged={isUserLogged} posts={posts} updatePosts={this.GetPosts} />} />
        <Route path="/signin" component={(props) => <Signin {...props} OnChangeStateCorreo={this.OnChangeStateCorreo} />} />
      </Switch>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

    </div>)
  }
}

export default MainRouter
