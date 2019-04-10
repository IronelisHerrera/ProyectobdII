import React, { Component } from 'react'
import { CardHeader, ListItem, ListItemAvatar, ListItemText, Dialog, DialogContentText, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DefaultPhoto from "../assets/images/user.svg"
import { ROUTES } from "../const"

const styles = theme => ({
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: '96%'
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing.unit,
    margin: `2px ${theme.spacing.unit * 2}px 2px 2px`
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em'
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer'
  }
})

const ComentarEnComentario = (props) => {
  const { comentario, classes, open, CloseModal, nuevoComentario, handleChangeNuevoComentario, ResponderComentario } = props;
  return (
    <Dialog open={open} onBackdropClick={CloseModal}>
      <DialogTitle>
        {`Respuesta a ${comentario.usuario}`}
      </DialogTitle>
      <DialogContent>
        <TextField
          // onKeyDown={this.addComment}
          multiline
          value={nuevoComentario}
          onChange={handleChangeNuevoComentario}
          placeholder="Escribe un comentario"
          className={classes.commentField}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={ResponderComentario} >Responder</Button>
      </DialogActions>
    </Dialog>
  )
}

class Comments extends Component {
  state = {
    text: '',
    modalComentario: false,
    comentarioActual: {},
    nuevoComentario: ""//Para el comentario dentro de comentario
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleChangeNuevoComentario = event => {
    this.setState({ nuevoComentario: event.target.value })
  }

  addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault()
      this.requestAddComment()
        .then(res => {
          //Actualizar comentarios
          this.props.updatePosts();
        })
        .catch(err => {
          console.log(err);
          alert("Ha ocurrido un error agregando el comentario");
        })
    }
  }

  requestAddComment = async () => {
    const { text } = this.state;
    const { post } = this.props;
    const usuarioActual = window.localStorage.getItem("usuario");
    const res = await fetch(`${ROUTES.POST.COMENTAR}?_id=${post._id}&usuario=${usuarioActual}&comentario=${text}`)
    const body = res.json();
    if (res.status != 200) throw Error(body.message)
    return body;
  }

  requestResponderComentario = async() =>
  {
    // http://localhost:5000/posts/comentar/comentario?_id=5cae17113d252953b497743f&from=juan@gmail.com&to=ronal2w@gmail.com&comentario=prueba&fecha=1554913048318
    let { post } = this.props;
    let { comentarioActual, nuevoComentario } = this.state;
    const usuarioActual = window.localStorage.getItem("usuario");
    const res = await fetch(`${ROUTES.POST.COMENTAR_COMENTARIO}?_id=${post._id}&from=${usuarioActual}&to=${comentarioActual.usuario}&comentario=${nuevoComentario}&fecha=${comentarioActual.fecha}`);
    const body = res.json()
    if(res.status != 200) throw Error(body.message)
    return body;    
  }

  ResponderComentario = () =>
  {
    this.requestResponderComentario()
    .then(res => {
      //Actualizar comentarios
      this.props.updatePosts();
    })
    .catch(err => {
      console.log(err);
      alert("Ha ocurrido un error")
    })
  }


  deleteComment = comment => event => {

  }

  OpenModalResponderComentario = (comentario) => {
    let { comentarioActual, modalComentario } = this.state;
    comentarioActual = comentario;
    modalComentario = true;
    this.setState({ comentarioActual, modalComentario });
  }

  CloseModal = () => this.setState({ modalComentario: false })

  render() {
    const { classes, updatePosts } = this.props
    const { modalComentario, comentarioActual, nuevoComentario } = this.state;
    const commentBody = item => {
      console.log("ITEM: ", item)
      return (
        <div>
          <ListItem button onClick={() => this.OpenModalResponderComentario(item)} >
            <ListItemAvatar>
              <Avatar src={DefaultPhoto} />
            </ListItemAvatar>
            <ListItemText primary={item.usuario} secondary={item.comentario} />
          </ListItem>
          <div style={{paddingLeft: 50}} >
            {item.comentarios.map((v, i) => {
              console.log("COMENTARIOS: ", v)
              return <ListItem button onClick={() => this.OpenModalResponderComentario(v)} >
                <ListItemAvatar>
                  <Avatar src={DefaultPhoto} />
                </ListItemAvatar>
                <ListItemText primary={v.usuario} secondary={v.comentario} />
              </ListItem>
            })}
          </div>
        </div>
      )
    }

    return (<div>
      <CardHeader
        avatar={
          <Avatar className={classes.smallAvatar} src={DefaultPhoto} />
        }
        title={<TextField
          onKeyDown={this.addComment}
          multiline
          value={this.state.text}
          onChange={this.handleChange('text')}
          placeholder="Escribe un comentario"
          className={classes.commentField}
          margin="normal"
        />}
        className={classes.cardHeader}
      />
      {this.props.comentarios.map((item, i) => {
        return <CardHeader          
          title={commentBody(item)}
          className={classes.cardHeader}
          key={i} />
      })
      }
      <ComentarEnComentario classes={classes} open={modalComentario} comentario={comentarioActual} nuevoComentario={nuevoComentario} 
      handleChangeNuevoComentario={this.handleChangeNuevoComentario} CloseModal={this.CloseModal} ResponderComentario={this.ResponderComentario} />
    </div>)
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
}

export default withStyles(styles)(Comments)
