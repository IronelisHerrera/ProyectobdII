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
        BUSCAR: "/usuarios/buscar"
    },

    POST: 
    {
        ROOT: "/posts",
        NUEVO: "/posts/nuevo"
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