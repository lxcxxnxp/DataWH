const response = require('../responses/response');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {registerJoi} = require('../validations/joiValidations');


const register = async(req,res)=>{

    let { name, lastname, email, profile, password } = req.body;

    //Validar con Joi primero
    const { error }= registerJoi.validate(req.body);

    if( error ){

        res.send( error );
        return;
    }
    // Verifico que no exista un usuario con el mismo email
    // Busco todos los usuarios en db
    let users = await User.find();

    const findByEmail = users.find(user => user.email === email);

    //Si el email es distinto de  undefined quiere decir que ya existe tal usuario
    if(findByEmail != undefined){

        let resp = new response(true,403,'Ya existe un usuario con ese email');
        res.send(resp);

    }else{

        //Hasheo contraseña
        let hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            lastname: lastname,
            email: email,
            profile: profile,
            password: hashedPassword
        });

        try{
            const savedUser = await newUser.save();
            console.log(savedUser);

            let resp = new response(false,202,'Nuevo usuario creado',savedUser);
            res.send(resp);

        }catch(e){
            console.log(e);
        }
    }
};

module.exports = register;