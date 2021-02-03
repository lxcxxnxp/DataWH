const { Schema, model } = require('mongoose');


//Creo schema de user

const UserSchema = new Schema({

    name: { 
        type: String, 
        required:true 
    },
    lastname:{ 
        type: String, 
        required:true 
    },
    email:{ 
        type: String, 
        unique: true, 
        required:true 
    },
    profile:{ 
        type: String, 
        enum: ['Admin','User'], 
        required:true 
    },
    password:{ 
        type: String, 
        required:true 
    },
    date: { 
        type:Date, 
        default: new Date() 
    }

})

module.exports = model('User',UserSchema);