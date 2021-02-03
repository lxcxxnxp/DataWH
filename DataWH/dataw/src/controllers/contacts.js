const response = require('../responses/response');
const { contactSchema } = require('../models/Contacts');
const { contactJoi }  = require('../validations/joiValidations');


class Contacts{


    async newContact(req,res){

        let { name, lastname, position, email, company, region, country, city, address, interest, contactChannels } = req.body;

        try{
            //Valido con Joi los campos requeridos
            let { error } = contactJoi.validate(req.body);
            if(error) throw error;

            let contact = {
                name: name,
                lastname: lastname,
                position: position,
                email: email,
                company: company,
                region: region,
                country: country,
                city: city,
                address: address,
                interest: interest
            }

            console.log(contact);
            
            let newContact = new contactSchema(contact);
    
            //Guardo el contacto y obtengo el id creado
            let {_id} = await newContact.save();

            //Busco el contacto recien creado y le agrego los canales de contacto
            let thisContact = await contactSchema.findById(_id);
            await thisContact.contactChannel.push(contactChannels);
            await thisContact.save();
    
            let resp = new response(false,200,"Id de contacto", thisContact);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e)
        }
    }
    async updateContact(req,res){

        let { name, lastname, position, email, company, region, country, city, address, interest, contactChannels } = req.body;
        let id = req.params;

        try{
            
            if( id._id.length != 24 ) throw "Id incorrecto";

            const { error } = contactJoi.validate(req.body);
            if(error) throw error;

            let contact = {
                name: name,
                lastname: lastname,
                position: position,
                email: email,
                address: address,
                interest: interest
            }

            let updated = await contactSchema.findByIdAndUpdate(id,contact);

            //Busco el contacto y le agrego los canales de contacto
            let thisContact = await contactSchema.findById(id);
            await thisContact.contactChannel.pop();
            await thisContact.contactChannel.push(contactChannels);
            await thisContact.region.pop();
            await thisContact.region.push(region);
            await thisContact.country.pop();
            await thisContact.country.push(country);
            await thisContact.city.pop();
            await thisContact.city.push(city);
            await thisContact.company.pop();
            await thisContact.company.push(company);

            await thisContact.save();

            if(updated === null) throw "Id de contacto no encontrado";

            let resp = new response(false,202,"Contacto actualizado correctamente",updated)
            res.send(resp);


        }catch(e){

            console.log(e);
            let resp = new response(true,400,e)
            res.send(resp);
        }
    }
    async getContacts(req,res){

        try{

            let contacts = await contactSchema.find({},{__v:0}).populate(
                {   
                    path:'company region country city',
                    select: 'name'
                }
            );
            
            let resp = new response(false,200,"Lista de conctactos completa", contacts)
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e)
            res.send(resp);
        }
    }
    async deleteContacts(req,res){

        let idsContacts = req.body;

        console.log(idsContacts);

        try{
            //Por cada id del array voy a eliminar uno por uno
            idsContacts.forEach(async (contactId) => {

                let deleted = await contactSchema.findByIdAndDelete({_id: contactId});
                console.log(deleted);
            });

            let resp = new response(false,202,"Contactos eliminado correctamente");
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,"No se pudo eliminar Contactos correctamente",e );
            res.send(resp);
        }

    }
    async getContactById(req,res){

        let id = req.params;
        
        try{

            let contact = await contactSchema.findById(id).populate(
                {   
                    path:'company region country city',
                    select: 'name'
                }
            );
            let resp = new response(false,200,"Contacto", contact);
            res.send(resp);

        }catch(e){

            let resp = new response(true,404,"Contacto no encontrado", e);
            res.send(resp);
        }
    }
    async sortContacts(req,res){

        //order traera 1 o -1;
        // Si es 1 ordenaremos ascendente , 0 descendentemente.
        let order = req.params.order;
        //Sera el campo por cual ordenar los contactos
        let field = req.params.field;

        try{

            let contacts = await contactSchema.find({},{__v:0}).populate(
                {   
                    path:'company region country city',
                    select: 'name'
                }
            ).sort({[field]: [order]});;

            let resp = new response(false,200,"Lista de conctactos completa", contacts);
            res.send(resp);

        }catch(e){
            console.log(e)
            let resp = new response(true,400,e)
            res.send(resp);
        }
    }
}

module.exports = new Contacts();


