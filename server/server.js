const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);
const dbName = 'prueba';
const port = process.env.port || 5000;

let db = null;
let arr = [];

const { USUARIO, POST } = require("./models")
const { ROUTES, COLLECTIONS } = require("./const");

client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);

    const collectionUsuario = db.collection("USUARIOS");
    const collectionPOST = db.collection("POSTS");
    // collectionUsuario.remove({});
    collectionPOST.remove({});


    app.get(ROUTES.USUARIO.NUEVO, (req, res) => {
        let AUX = { ...USUARIO };
        AUX = req.query;
        USUARIOS_NUEVO({ ...AUX, seguidos: [], seguidores: [] }, db, () => {
            res.status(200);
            res.send({ error: false });
        });
    });

    app.get(ROUTES.SESION.LOGIN, (req, res) => {
        const USUARIO = req.query;
        INICIAR_SESION(USUARIO, db, (result) => {
            res.send(result);
        })

    })

    app.get(ROUTES.POST.NUEVO, (req, res) => {
        let AUX = { ...POST };
        AUX = req.query;
        POST_NUEVO({...AUX, comentarios: []}, db, result => res.send(result));
    });

    app.get(ROUTES.POST.ROOT, (req, res) => {
        const { usuarioActual } = req.query;
        const collection_posts = db.collection(COLLECTIONS.POSTS);
        const collection_usuarios = db.collection(COLLECTIONS.USUARIOS);
        let mis_amigos = [];
        //OBTENIENDO LOS POST DE MI USUARIO
        collection_posts.find({ correo: usuarioActual }).toArray((err, result) => {
            arr = [...result];
            //OBTENIENDO LA GENTE QUE SIGO
            collection_usuarios.find({ correo: usuarioActual }).toArray((err, result) => {
                // console.log(result[0].seguidos)
                mis_amigos = [...result[0].seguidos];
                mis_amigos.forEach((item, i) => {
                    collection_posts.find({ correo: item }).toArray((err, result) => {
                        AddPosts(result);
                        if (i == mis_amigos.length - 1) {
                            res.send(arr)
                        }
                    });
                })
            })
        })
    });

    app.get(ROUTES.USUARIO.BUSCAR, (req, res) => {
        const { value } = req.query;
        USUARIOS_BUSCAR(value, db, (result) => {
            res.send(result);
            res.status(200);
        })
    });

    app.get(ROUTES.USUARIO.SEGUIR, (req, res) => {
        const { from, to } = req.query;
        USUARIOS_SEGUIR(from, to, db, (result) => res.send(result));
    });

    app.get(ROUTES.POST.USUARIO, (req, res) => {
        const { usuario } = req.query;
        POST_USUARIO(usuario, db, (result) => res.send(result));
    });




    app.get("/", (req, res) => {
        collectionUsuario.find({}).toArray((err, result) => {
            res.send(result);
        })
    })

    // collectionUsuario.find


});







const INICIAR_SESION = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    collection.find(object).toArray((err, result) => {
        callback(result);
    })
}

const POST_NUEVO = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.POSTS);
    console.log(object)
    collection.insertOne(object, (err, result) => {
        callback(result);
    })
}



function AddPosts(item) {
    arr.push(...item);
}

const POST_ROOT = (usuarioActual, db, callback) => { //usuarioActual es el correo
    const collection_posts = db.collection(COLLECTIONS.POSTS);
    const collection_usuarios = db.collection(COLLECTIONS.USUARIOS);
    let mis_amigos = [];
    //OBTENIENDO LOS POST DE MI USUARIO
    collection_posts.find({ correo: usuarioActual }).toArray((err, result) => {
        arr = [...result];
        //OBTENIENDO LA GENTE QUE SIGO
        collection_usuarios.find({ correo: usuarioActual }).toArray((err, result) => {
            // console.log(result[0].seguidos)
            mis_amigos = [...result[0].seguidos];
            mis_amigos.forEach((item, i) => {
                collection_posts.find({ correo: item }).toArray((err, result) => {
                    AddPosts(result);
                    if (i == mis_amigos.length - 1) {

                    }
                });
            })
            console.log("A VER: ", arr)
            callback(arr);
        })
    })
}

const POST_USUARIO = (usuario, db, callback) => {
    const collection_posts = db.collection(COLLECTIONS.POSTS);
    collection_posts.find({ correo: usuario }).toArray((err, result) => {
        callback(result)
    })
}

const USUARIOS_NUEVO = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    collection.insertOne(object, (err, result) => {
        callback(result);
    })
}

const USUARIOS_BUSCAR = (value, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    let data = []
    collection.find({}).toArray((err, result) => {
        result.forEach(item => {
            if (item.nombres.startsWith(value)) {
                data.push(item);
            }
        })
        callback(data);
    })
}

const USUARIOS_SEGUIR = (usuarioActual, usuarioAseguir, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    let usuario = {}
    collection.find({ correo: usuarioActual }).toArray((err, result) => {
        if (result.length > 0) {
            usuario = { ...result[0] };
            //VERIFICAR SI YA SIGUE A ESTE USUARIO
            let alreadyFollowed = false;
            let item = null;
            for (let i = 0; i < usuario.seguidos.length; i++) {
                item = usuario.seguidos[i];

                if (item == usuarioAseguir) {
                    alreadyFollowed = true;
                    callback({ error: true })
                    break;
                }
            }
            console.log(alreadyFollowed)
            if (!alreadyFollowed) {
                usuario.seguidos.push(usuarioAseguir);
                collection.updateOne({ correo: usuarioActual }, { $set: { seguidos: usuario.seguidos } }, (result) => {
                    callback({ error: false })
                })
            }
        }

        // callback(result)

    })
}




app.listen(port, () => console.log("Connect on port: " + port))