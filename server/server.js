const express = require("express");
const app = express();
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const assert = require('assert');
// const mongo = require("mongodb")

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);
const dbName = 'prueba';
const port = process.env.port || 5000;

let db = null;
let arr = [];

const { USUARIO, POST, COMENTARIO, COMENTARIO_COMENTARIO } = require("./models")
const { ROUTES, COLLECTIONS } = require("./const");

client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);

    const collectionUsuario = db.collection("USUARIOS");
    const collectionPOST = db.collection("POSTS");
    // collectionUsuario.remove({});
    // collectionPOST.remove({});


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
        POST_NUEVO({ ...AUX, comentarios: [] }, db, result => res.send(result));
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
                console.log("USUARIO ACTUAL: ", usuarioActual)
                console.log("USUARIO ACTUAL: ", result[0])
                console.log("AMIGOS: ", mis_amigos)
                if(result[0].seguidos.length != 0)
                {
                    mis_amigos.forEach((item, i) => {
                        collection_posts.find({ correo: item }).toArray((err, result) => {
                            AddPosts(result);
                            if (i == mis_amigos.length - 1) {
                                res.send(arr)
                            }
                        });
                    })
                } else
                {
                    res.send(arr)
                }
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

    app.get(ROUTES.POST.COMENTAR, (req, res) => {
        let AUX = {...COMENTARIO}
        AUX = req.query;        
        POST_COMENTAR(AUX, db, result => {
            res.send(result)
        })
    });
    
    app.get(ROUTES.POST.COMENTAR_COMENTARIO, (req, res) => {
        let AUX = {...COMENTARIO_COMENTARIO}
        AUX = req.query;
        COMENTARIO_COMENTAR(AUX, db, result => {
            res.send(result)
        })
    });

    app.get("/admin/borrar/posts", (req, res) => {
        collectionPOST.remove({});
        res.send({error: false})
    })
    
    app.get("/admin/borrar/usuarios", (req, res) => {
        collectionUsuario.remove({});
        res.send({error: false})
    })


    app.get("/", (req, res) => {
        collectionUsuario.find({}).toArray((err, result) => {
            res.send(result);
        })
    })

    // collectionUsuario.find
    
    // collectionPOST.
    // collectionPOST.findOne({"_id": mongo_id}, (err, result) => {
    //     console.log(result)
    // })
    // const mongo_id = new mongo.ObjectID("5cae00359137cb5124c3694a")
    // collectionPOST.find({ "_id": mongo_id }).toArray((err, result) => console.log(result))
    

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

const POST_COMENTAR = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.POSTS);
    const mongo_id = new mongo.ObjectID(object._id)
    collection.find({ "_id": mongo_id }).toArray((err, result) => {
        let comentarios = result[0].comentarios;
        comentarios.push({usuario: object.usuario, comentario: object.comentario, fecha: + new Date() ,comentarios: []});
        collection.updateOne({"_id": mongo_id}, {$set: {comentarios: comentarios}}, (result) => {
            callback({...result, error: false})
        })
    })

}

const COMENTARIO_COMENTAR = (object, db, callback) => {
    //_id, to, from, fecha, comentario,
    // console.log("OBJETO: ", object)
    const collection = db.collection(COLLECTIONS.POSTS);    
    const respuesta = {usuario: object.from, comentario: object.comentario, fecha: + new Date()};
    const mongo_id = new mongo.ObjectID(object._id);
    //BUSCANDO EL POST
    collection.find({"_id": mongo_id}).toArray((err, result) => {
        let postActual = result[0];
        let comentarios = postActual.comentarios;
        for(let i = 0; i < comentarios.length; i++)
        {
            console.log(`${comentarios[i].usuario} == ${object.to}`)
            console.log(`${comentarios[i].fecha} == ${object.fecha}`)
            if(comentarios[i].usuario == object.to && comentarios[i].fecha == object.fecha)
            {
                //AQUI EL COMENTARIO A COMENTAR HA SIDO ENCONTRADO
                comentarios[i].comentarios.push(respuesta);
                break;
            }
        }

        // comentarios.push(respuesta);
        collection.updateOne({"_id": mongo_id}, {$set: {comentarios: comentarios}}, (result) => {
            callback({...result, error: false});
        })
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
            if (item.nombres.toLowerCase().startsWith(value.toLowerCase())) {
                data.push(item);
            }
        })
        callback(data);
    })
}

const USUARIOS_SEGUIR = (usuarioActual, usuarioAseguir, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    let usuario = {}
    console.log(`FROM: ${usuarioActual}, TO: ${usuarioAseguir}`)
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