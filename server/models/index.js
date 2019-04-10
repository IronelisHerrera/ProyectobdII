const USUARIO  =
{
    nombres: "",
    correo: "",
    clave: "",
    seguidores: [],
    seguidos: []
}

const POST =
{
    descripcion: "",
    correo: "",
    fecha: "",
    comentarios: []
}

const COMENTARIO =
{
    _id: "", //ID DEL POST
    usuario:"",
    comentario:"",
    comentarios: []
}

module.exports = { USUARIO, POST, COMENTARIO };