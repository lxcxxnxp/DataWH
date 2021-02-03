const response = require('../responses/response');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwtSign} = require('../global/envs');
const {loginJoi} = require('../validations/joiValidations');


async function login(req,res){

    let {email,password} = req.body;

    //Validar con Joi primero
    const { error }= loginJoi.validate(req.body);

    if( error ){

        res.send( error );
        return;
    }
    //Verifico que exista el usuario
    // Busco todos los usuarios en db
    let users = await User.find();

    const findByEmail = users.find(user => user.email === email);
    //Si el email = undefined quiere decir que no existe tal usuario
    if(findByEmail == undefined) {
        let resp = new response(true,403,'No existe usuario con ese email');
        res.send(resp);  
        return;
    }
    const findProfile = await User.find( {email: email});
    const profile = findProfile[0].profile;
    const idUser = findProfile[0]._id;

    const user = {
        profile: profile,
        id: idUser
    }

    const emailDB = findByEmail.email;
    const hashedPass = findByEmail.password;

    //Creo objeto usuario para enviar dentrod el payload
    let infoUser= {
        email: emailDB
    };

    try{
        // Si la contraseña corresponde CREO Y ENVIO token

        if(await bcrypt.compare(password,hashedPass)) {

            // Creo el Token
            const accessToken = jwt.sign(infoUser,jwtSign, {expiresIn: "8h"} );

            let resp = new response(false,202,user,accessToken);
            res.send(resp);

        }else{

            let resp = new response(true,403,'Contraseña incorrecta');
            res.send(resp);
        }

    }catch(error){

        res.status(500).send();
    }
    
}


module.exports = login;