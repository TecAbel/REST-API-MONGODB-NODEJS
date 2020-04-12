const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido' 
}


let usuarioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio']
        },
        email: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        },
        img: {
            type: String,
            required: false
        },
        role: {
            type: String,
            default: 'USER_ROLE',
            enum: validRoles
        },
        estado: {
            type: Boolean,
            default: true
        },
        google: {
            type: Boolean,
            default: false
        }
    }
);

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);