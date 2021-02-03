const { Schema, model } = require('mongoose');

//Creo Schema de ciudades
const citySchema = new Schema({

    name: { type: String, unique: true }
});
const city = model('City', citySchema);

const countrySchema = new Schema({

    name: { type: String, unique: true },

    cities: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
    }]
});
const country = model('Country',countrySchema);


const regionSchema = new Schema ({

    name: { type: String, unique: true },

    countries : [{
        type: Schema.Types.ObjectId,
        ref: 'Country'
    }]
});


module.exports = {

    regionSchema : model('Region',regionSchema),
    countrySchema : country,
    citySchema : city

};
