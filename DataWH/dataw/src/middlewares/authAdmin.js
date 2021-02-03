const jwt = require('jsonwebtoken');
const { jwtSign } = require('../global/envs');
const User = require('../models/User');
const response = require('../responses/response');


async function authAdmin(req,res,next){

    try{

        const token = req.headers.authorization.split(' ')[1];
        // Verifico el token con la firma secreta y el token enviado por el cliente
        const verifyToken = jwt.verify(token,jwtSign);

        //Busco el pefil de quien quiere realizar la accion
        const findProfile = await User.find( {email: verifyToken.email});

        const profile = findProfile[0].profile;
        
        if(profile == 'Admin'){

            next();
            
        } else { 
            
            let resp = new response(true,403,"Usted no posee los privilegios para realizar esta operacion");
            res.send(resp);
        }

    }catch(err){

        let resp = new response(true,403,"Usted no posee los privilegios para realizar esta operacion");
        res.send(resp);
    }
}

module.exports = authAdmin;