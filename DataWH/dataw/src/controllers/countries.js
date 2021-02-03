const response = require('../responses/response');
//Models
const { citySchema, countrySchema, regionSchema } = require('../models/Regions');
const {nameJoi} = require('../validations/joiValidations');
const {idJoi} = require('../validations/joiValidations');

class Countries{


    async newCountry(req,res) {

        let country = req.body;
        let idRegion = req.params;

        try{
            
            let region = await regionSchema.findById(idRegion);

            if(region == null) throw "No existe region con ese id";

            let existCountry = await countrySchema.find(country);

            if(existCountry != '') throw "Ya existe el pais que quiere crear";

            //Creo el pais
            let newCountry = new countrySchema(country);


            //Guardo el pais y obtengo el id
            let { _id } = await newCountry.save();

            //Pusheo dentro de la region a quien pertenece
            await region.countries.push( newCountry );

            //Guardo nuvamente region
            await region.save();

            let resp = new response(false,202,"Pais creado correctamente", _id);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e);
        }
    };

    async deleteCountry(req,res) {

        let idCountry = req.params;

        try{
            //Busco el pais a remover y traigo sus ciudades 
            let {cities} = await countrySchema.findOne(idCountry);
            console.log(cities);
            
            //Elimino cada ciudad del pais a eliminar
            cities.forEach( async (idCity) => { await citySchema.findByIdAndDelete(idCity) });

            //Luego elimino elimino pais
            let deletedCountry = await countrySchema.findByIdAndDelete(idCountry);

            let resp = new response(false,202,"Pais eliminado correctamente", deletedCountry);
            res.send(resp);

        }catch(e){
            let resp = new response(true,400,"No se pudo eliminar Pais correctamente",e );
            res.send(resp);
        }
    };

    async updateCountry (req,res) {

        let idCountry = req.params;
        let newName = req.body;

        try{
            let { error } = nameJoi.validate(newName);
            if(error) throw error;

            let update = await countrySchema.updateOne(idCountry,newName);

            let resp = new response(false,202,"Nombre de Pais modificado correctamente",update )
            res.send(resp);

        }catch(e){
            
            let resp = new response(true,400,"No se pudo actualizar nombre de pais",e )
            res.send(resp);
        }
    };

    //No estoy seguro si voy a necesitar de esta ruta
    async getCountries(req,res) {

    };


}

module.exports = new Countries();