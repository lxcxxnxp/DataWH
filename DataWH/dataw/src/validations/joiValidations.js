const Joi = require('joi');
const { Schema } = require('mongoose');


const loginSchema = Joi.object({

    email: Joi.string().email({ tlds: { allow: false } }).required(),
    
    password: Joi.string().min(8).alphanum().required()
});

const registerSchema = Joi.object({

    name: Joi.string().min(2).required(),

    lastname: Joi.string().min(2).required(),

    email: Joi.string().email({ tlds: { allow: false } }).required(),

    profile: Joi.string().valid('Admin','User').required(),

    password: Joi.string().min(8).alphanum().required()

});

const nameSchema = Joi.object({

    name: Joi.string().min(2)
});

const idSchema = Joi.object({

    _id: Joi.string().alphanum().min(24).max(24).required()
});

const updateUserSchema = Joi.object({

    name: Joi.string().min(2).required(),

    lastname: Joi.string().min(2).required(),

    email: Joi.string().email({ tlds: { allow: false } }).required(),

    profile: Joi.string().valid('Admin','User').required(),


});

const companySchema = Joi.object({

    name: Joi.string().min(2).required(),

    address: Joi.string().min(2).required(),

    email: Joi.string().email({ tlds: { allow: false } }).required(),

    phone: Joi.string().min(6).required()

});

const contactSchema = Joi.object({

    name: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    position: Joi.string().min(2).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    position: Joi.string().min(2).required(),
    company: Joi.string().alphanum().min(24).max(24).required(),
    region: Joi.string().max(40),
    country: Joi.string().max(40),
    city: Joi.string().max(40),
    address: Joi.string().min(0),
    interest: Joi.string(),
    contactChannels : Joi.array()



})


module.exports = {
   
    loginJoi : loginSchema,

    registerJoi : registerSchema,

    nameJoi : nameSchema,

    idJoi : idSchema,

    updateUserJoi : updateUserSchema,
    
    companyJoi : companySchema,

    contactJoi : contactSchema

}
