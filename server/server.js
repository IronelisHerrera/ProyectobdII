const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);
const dbName = 'prueba';
const port = process.env.port || 5000;

let db = null;

const { USUARIO } = require("./models")
const { ROUTES, COLLECTIONS } = require("./const");

client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);

    const collectionUsuario = db.collection("USUARIOS");


    app.get(ROUTES.USUARIO.NUEVO, (req, res) => {
        let AUX = { ...USUARIO };
        AUX = req.query;
        NUEVO_USUARIO(AUX, db, () => {
            res.status(200);
            res.send({ error: false });
        });
    });

    app.get(ROUTES.SESION.LOGIN, (req, res) => {
        const USUARIO = req.query;
        console.log("USUARIO: ", USUARIO)
        INICIAR_SESION(USUARIO, db, (result) => {
            res.send(result);
        })

    })

    app.get("/", (req, res) => {
        collectionUsuario.find({}).toArray((err, result) => {
            res.send(result);
        })
    })


});





const NUEVO_USUARIO = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    collection.insertOne(object, (err, result) => {
        assert.equal(err, null);

        callback(result);
    })
}

const INICIAR_SESION = (object, db, callback) => {
    const collection = db.collection(COLLECTIONS.USUARIOS);
    collection.find(object).toArray((err, result) => {
        callback(result);
    })
}





app.listen(port, () => console.log("Connect on port: " + port))