const mongoose = require('mongoose');
const {URI_connection} = require('../global/envs');

//Conect To DB
mongoose.connect(URI_connection,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

const db = mongoose.connection;



module.exports = {
    db: db,
    URI_connection: URI_connection
}