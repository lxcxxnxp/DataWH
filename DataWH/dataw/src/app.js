const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes/router');
const middlewares = require('./middlewares/middGlobals');
const {db, URI_connection } = require('./database/mongo_connection');
const createFirstAdmin = require('./controllers/createFirstAdmin');



//Varios middlewares
middlewares(app);

//Router
app.use('/',router);

//DB conection
db.once('open',()=>{ 

    console.log(`Mongo database connected to ${URI_connection}`);
    createFirstAdmin();
});
db.on('error', console.error.bind(console, 'connection error'));



//MIDLEWARE DE MANEJO DE ERRORES
app.use((req, res)=>{

    respuesta = new Response(true, 404, "URL not found GG");
    res.status(404).send(respuesta);
});
app.use((err, req, res, next) => {

    if (!err) { //no hay error
        return next();
    }
    console.log(JSON.stringify(err));

    res.status(500).send("An unexpected error has ocurred GG"+err);
});

app.listen(port,()=>{

    console.log(`Servidor escuchando en puerto ${port}`)
})