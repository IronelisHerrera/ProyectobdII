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
    fecha: "",
    comentarios: []
}

const COMENTARIO_COMENTARIO =
{
    _id: "",
    to:"",
    from:"",
    fecha:"",
    comentario:""
}

module.exports = { USUARIO, POST, COMENTARIO, COMENTARIO_COMENTARIO };