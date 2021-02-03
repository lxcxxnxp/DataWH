const response = require('../responses/response');
const User = require('../models/User');
const {idJoi,updateUserJoi} = require('../validations/joiValidations');

class Admin{

    async getUsers(req,res){

        let { id } = req.params;

        // Busco todos los usuarios en db excepto quien los pide del lado cliente
        let users = await User.find({ _id: { $ne: id } },{ __v:0, password:0, date:0 });

        let resp = new response(false,200,"Lista de usuarios",users)
        res.send(resp);
    };

    async deleteUser(req,res){

        let id = req.params;
        try{
            //Validar con Joi primero
            const { error } = idJoi.validate(id);

            if(error) throw error.details[0].message;

            let deleted = await User.findByIdAndDelete(id);

            if(deleted === null) throw "Id de usuario no encontrado";

            let resp = new response(false,202,"Usuario eliminado correctamente",deleted)
            res.send(resp);

        }catch(e){

            console.log(e);
            let resp = new response(true,400,e)
            res.send(resp);
        }

    };

    async updateUser(req,res){

        let id = req.params;

        let {name,lastname,email,profile} = req.body;

        try{
            
            if( id._id.length != 24 ) throw "Id incorrecto";

            const { error } = updateUserJoi.validate(req.body);
            if(error) throw error.details[0].message;

            let updated = await User.findByIdAndUpdate(id,
                { 
                    name : name,
                    lastname: lastname,
                    email: email,
                    profile: profile 
                }
            );
            if(updated === null) throw "Id de usuario no encontrado";

            let resp = new response(false,202,"Usuario actualizado correctamente",updated)
            res.send(resp);


        }catch(e){

            console.log(e);
            let resp = new response(true,400,e)
            res.send(resp);
        }

    }
}

module.exports = new Admin();