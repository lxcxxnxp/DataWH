const User = require('../models/User');
const bcrypt = require('bcrypt');


//Declaro el primer administrador si no existe aun
async function createFirstAdmin(){

    //Busco en base de datos si ya existe el admin que se registra como lupucharella@gmail.com
    let existsAdmin = await User.find({email: 'lupucharella@gmail.com'});
    //Si la respuesta es vacia lo creo
    if(existsAdmin == ''){

        //Hasheo contraseña
        let hashedPassword = await bcrypt.hash('Lu12345', 10);//Esta password deberia estar en archivo .ENV

        const newUser = new User({
            name: "Luciana",
            lastname: "Pucharella",
            email: "lupucharella@gmail.com",
            profile: "Admin",
            password: hashedPassword
        });

        try{
            const savedUser = await newUser.save();
            console.log(savedUser);
        }catch(e){
            console.log(e);
        }
    }
}


module.exports = createFirstAdmin;
