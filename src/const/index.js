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
    POSTS: "POSTS"
}


module.exports = { ROUTES, COLLECTIONS };