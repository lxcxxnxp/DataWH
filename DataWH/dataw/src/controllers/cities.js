const response = require('../responses/response');
//Models
const { citySchema, countrySchema, regionSchema } = require('../models/Regions');

const {nameJoi} = require('../validations/joiValidations');
const {idJoi} = require('../validations/joiValidations');

class Cities{

    async newCity(req,res){

        let city = req.body;
        let idCountry = req.params;

        try{

            let country = await countrySchema.findById(idCountry);

            if(country == null) throw "No existe pais con ese id";

            let existsCity = await citySchema.find(city);

            if(existsCity != '') throw "Ya existe la ciudad que quiere crear";

            //Creo la ciudad
            let newCity = new citySchema(city);

            //Guardo la nueva ciudad y obtengo el id creado
            let {_id} = await newCity.save();

            //Pusheo nueva ciudad dentro de su pais
            await country.cities.push(newCity);

            //Guardo nuevamente el pais
            await country.save();

            let resp = new response(false,202,"Ciudad creada correctamente", _id);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e);
        }

    };

    async deleteCity(req,res) {

        let idCity = req.params;

        try{

            let { error } = idJoi.validate(idCity);
            if(error) throw "Id invalido";

            let deletedCity = await citySchema.findByIdAndDelete(idCity);

            if(deletedCity == null) throw "No existe ciudad con ese id";

            let resp = new response(false,202,"Ciudad eliminada correctamente", deletedCity);
            res.send(resp);

        }catch(e){
            let resp = new response(true,400,"No se pudo eliminar ciudad correctamente",e );
            res.send(resp);
        }
    };

    async updateCity(req,res){

        let idCity = req.params;
        let newName = req.body;

        try{
            let { error } = nameJoi.validate(newName);
            if(error) throw error;

            let update = await citySchema.updateOne(idCity,newName);

            if(update.n === 0) throw "No existe ciudad con ese id";

            let resp = new response(false,202,"Nombre de ciudad modificado correctamente",update )
            res.send(resp);

        }catch(e){
            
            let resp = new response(true,400,"No se pudo actualizar nombre de ciudad",e )
            res.send(resp);
        }
    };

    async getCities(req,res){

        try{

            let cities = await citySchema.find({},{__v:0, _id: 0});


            let resp = new response(false,200,"Lista de Ciudades completa", cities)
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e)
            res.send(resp);
        }
    }


}

module.exports = new Cities();