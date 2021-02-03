const response = require('../responses/response');
//Models
const { companySchema } = require('../models/Companies');
const { citySchema } = require('../models/Regions');
const {nameJoi, companyJoi, idJoi } = require('../validations/joiValidations');


class Companies{

    async newCompany(req,res){
        
        let cityName1 = req.params.city;
        let cityName = cityName1.replace(/-/g, ' ');
        let company = req.body;

        try{

            if(cityName.length <= 1) throw "Nombre de ciudad invalido";

            let {error} = companyJoi.validate(company);
            if( error ) throw error.details;

            //Primero busco la ciudad a la que pertenece la compania nueva
            let city = await citySchema.findOne({ name : cityName });

            if(city == null) throw "No existe tal ciudad";

            //Luego creo la nueva compania
            let newCompany = new companySchema(company);

            //Guardo la compania y obtengo el id
            let { _id } = await newCompany.save();

            //Busco la compania recien creada y le agrego la ciudad
            let thisCompany = await companySchema.findById(_id);

            await thisCompany.city.push(city);

            //Por ultimo vuelvo a guardar la compania ya con su ciudad dentro
            let createdCompany = await thisCompany.save();
            let resp = new response(false,202,"Compañia creada", createdCompany)
            res.send(resp);


        }catch(e){

            if(e.code == 11000){
                let resp = new response(true,400,"Alguno de los datos de la compania ya existen", e.keyValue)
                res.send(resp);
                console.error(e);
            

            }else{
                let resp = new response(true,400,"Error al cargar compania", e)
                res.send(resp);
                console.error(e);
            }
            
        }
    }

    async updateCompany(req,res){

        let companyId = req.params.id;

        let cityName1 = req.params.city;
        let cityName = cityName1.replace(/-/g, ' ');

        let company = req.body;

        try{

            if(cityName.length <= 1) throw "Nombre de ciudad invalido";
                
            if(companyId.length != 24) throw "Id de compañia invalido";
            
            let {error} = companyJoi.validate(company);
            if( error ) throw error.details;


            //Primero busco la ciudad a la que va a pertenecer la compania a actualizar
            let city = await citySchema.findOne({ name : cityName });

            if(city == null) throw "No existe tal ciudad";

            //Busco la compania por id y la actualizo con los nuevos datos 
            let {_id} = await companySchema.findByIdAndUpdate( companyId, company );
            if(_id === null) throw "Id de compañia no encontrado";

            //Busco la compania recien Actualizada y quito la ciudad vieja y agrego la nueva
            let thisCompany = await companySchema.findById(_id);

            await thisCompany.city.pop();
            await thisCompany.city.push(city);
            await thisCompany.save();

            let resp = new response(false,202,"Compañia modificada correctamente", thisCompany)
            res.send(resp);


        }catch(e){

            console.log(e);
            let resp = new response(true,400,e)
            res.send(resp);
        }
    }

    async deleteCompany (req,res){

        let id = req.params;

        try{

            if(id._id.length != 24) throw "Id de compañia invalido";
            
            let deleted = await companySchema.findByIdAndDelete(id);

            if(deleted === null) throw "Id de compania no encontrado";

            let resp = new response(false,202,"Compañia eliminada correctamente",deleted)
            res.send(resp);
                
        }catch(e){

            console.log(e);

            let resp = new response(true,400,e)
            res.send(resp);

        }
    }
    
    async getCompanies (req,res){

        try{

            let companies = await companySchema.find({},{__v:0}).populate(
                {
                    path: 'city',
                    select: 'name'
                }
            );

            let resp = new response(false,200,"Listas de compañias", companies)
            res.send(resp);


        }catch(e){

            console.log(e);
            res.send(e);
        }
    }
}

module.exports = new Companies();