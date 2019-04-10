const ROUTES =
{

    SESION: 
    {
        LOGIN: "/sesion/login"
    },

    USUARIO: 
    {
        ROOT: "/usuarios",
        NUEVO: "/usuarios/nuevo",
        BUSCAR: "/usuarios/buscar",
        SEGUIR: "/usuarios/seguir"
    },

    POST: 
    {
        ROOT: "/posts",
        NUEVO: "/posts/nuevo",
        USUARIO: "/posts/usuario",
        COMENTAR: "/posts/comentar"
    }

}

const COLLECTIONS =
{
    USUARIOS: "USUARIOS",
    POSTS: "POSTS",
    SEGUIDOS: "SEGUIDOS",
    SEGUIDORES: "SEGUIDORES"
}


module.exports = { ROUTES, COLLECTIONS };