const jwt = require('jsonwebtoken');
const { jwtSign } = require('../global/envs');

const response = require('../responses/response');


function auth(req,res,next){

    try{

        const token = req.headers.authorization.split(' ')[1];
        // Verifico el token con la firma secreta y el token enviado por el cliente
        const verifyToken = jwt.verify(token,jwtSign);
        let resp = new response(false,200,"Usuario autenticado",verifyToken);
        res.send(resp);
        

    }catch(err){

        let resp = new response(true,403,"Usuario no autenticado");
        res.send(resp);
    }

}

module.exports = auth;