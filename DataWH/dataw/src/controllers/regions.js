const response = require('../responses/response');
//Models
const { citySchema, countrySchema, regionSchema } = require('../models/Regions');
const {nameJoi} = require('../validations/joiValidations');
const {idJoi} = require('../validations/joiValidations');

class Regions{

    //Region
    async newRegion(req,res) {

        let region = req.body;

        try{

            let { error } = nameJoi.validate(region);
            if(error) throw "nombre de region invalido";

            const newRegion = new regionSchema(region);
            const { _id } = await newRegion.save();
    
            let resp = new response(false,202, "Region creada exitosamente" , _id );
            res.send(resp);

        }catch(e){


            let resp = new response(true,400,e);
            res.send(resp);
           
        }
    };

    async deleteRegion(req,res) {

        let idRegion = req.params;

        try{
            //Busco la region a remover y traigo sus countries hijos
            let {countries} = await regionSchema.findOne(idRegion);
            console.log(countries);

            countries.forEach( async (element) => {
                //Encuentro id´s de ciudades de cada pais dentro de la region
                let {cities} = await countrySchema.findById( element );

                //Elimino cada ciudad
                cities.forEach(async (idCity)=>{

                    await citySchema.findByIdAndDelete(idCity);
                });
                //Luego elimino cada pais
                await countrySchema.findByIdAndDelete(element);
            });
            //Por ultimo elimino la region
            let deletedRegion = await regionSchema.findByIdAndDelete(idRegion);

            let resp = new response(false,202,"Region eliminada correctamente", deletedRegion);
            res.send(resp);

        }catch(e){
            let resp = new response(true,400,"No se pudo eliminar Region correctamente",e );
            res.send(resp);
        }
    };

    async updateRegion(req,res) {

        let idRegion = req.params;
        let newName = req.body;
        try{
            let { error } = nameJoi.validate(newName);
            if(error) throw error;

            let update = await regionSchema.updateOne(idRegion,newName);
            let resp = new response(false,202,"Nombre de Region modificado correctamente",update )
            res.send(resp);

        }catch(e){
            
            let resp = new response(true,400,"No se pudo actualizar nombre de region",e )
            res.send(resp);
        }

    };
    async getRegions(req,res) {

        try{

            let regions = await regionSchema.find({},{__v:0}).populate(
                {   
                    path:'countries cities',
                    select: 'name',
                    populate:{
                        path:'cities',
                        select:'name'
                    }
                }
            );

            let resp = new response(false,200,"Lista de Regiones completa", regions)
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e)
            res.send(resp);
        }


    };
}

module.exports = new Regions();