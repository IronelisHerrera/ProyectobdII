const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);
const dbName = 'prueba';
const port = process.env.port || 5000;

let db = null;

const { USUARIO, POST } = require("./models")
const { ROUTES, COLLECTIONS } = require("./const");

client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);

    const collectionUsuario = db.collection("USUARIOS");
    // collectionUsuario.remove({});


    app.get(ROUTES.USUARIO.NUEVO, (req, res) => {
        let AUX = { ...USUARIO };
        AUX = req.query;
        USUARIOS_NUEVO({...AUX, seguidos: [], seguidores: []}, db, () => {
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
        let AUX = {...POST};
        AUX = req.query;
        POST_NUEVO(AUX, db, result => res.send(result));
    });
    
    app.get(ROUTES.POST.ROOT, (req, res) => {        
        POST_ROOT(db, (result) => res.send(result));
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
    collection.insertOne(object, (err, result) => {
        callback(result);
    })
}

const POST_ROOT = (usuarioActual ,db, callback) => { //usuarioActual es el correo
    const collection_posts = db.collection(COLLECTIONS.POSTS);
    const collection_seguidos = db.collection(COLLECTIONS.SEGUIDOS);
    let arr = []; 
    let mis_amigos = [];
    //OBTENIENDO LOS POST DE MI USUARIO
    collection_posts.find({correo: usuarioActual}).toArray((err, result) => {
        arr = [...result];
        //OBTENIENDO LA GENTE QUE SIGO
        collection_seguidos.find({usuario: usuarioActual}).toArray((err, result) => {
            mis_amigos = [...result];
            mis_amigos.forEach(item => {
                collection_posts.find(item).toArray((err, result) => {
                    arr = [...result];
                });
            })
            console.log(arr);
            callback(arr);
        })

    })
    collection.find({}).toArray((err, result) => {
        callback(result);
    })
}

const USUARIOS_NUEVO = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    collection.insertOne(object, (err, result) => {
        callback(result);
    })
}

const USUARIOS_BUSCAR = (value, db, callback) =>
{
    const collection = db.collection(COLLECTIONS.USUARIOS);
    let data = []
    collection.find({}).toArray((err, result) => {
        result.forEach(item => {
            if(item.nombres.startsWith(value))
            {
                data.push(item);
            }
        })
        callback(data);
    })
}

const USUARIOS_SEGUIR = (usuarioActual, usuarioAseguir, db, callback) =>
{
    const collection = db.collection(COLLECTIONS.USUARIOS);
    let usuario = {}
    collection.find({correo: usuarioActual}).toArray((err, result) => {
        if(result.length > 0)
        {
            usuario = {...result[0]};
            //VERIFICAR SI YA SIGUE A ESTE USUARIO
            let alreadyFollowed = false;
            let item = null;
            for(let i = 0; i < usuario.seguidos.length; i ++)
            {
                item = usuario.seguidos[i];
                
                if(item == usuarioAseguir)
                {
                    alreadyFollowed = true;
                    callback({error: true})
                    break;
                }
            }
            console.log(alreadyFollowed)
            if(!alreadyFollowed)
            {
                usuario.seguidos.push(usuarioAseguir);
                collection.updateOne({correo: usuarioActual}, {$set: { seguidos: usuario.seguidos}}, (result) => {
                    callback({error: false})
                })
            } 
        }
        
        // callback(result)
        
    })
}




app.listen(port, () => console.log("Connect on port: " + port))