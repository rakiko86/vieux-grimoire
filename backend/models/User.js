const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,  // Convertit les emails en minuscules
    trim: true        // Supprime les espaces en début et fin
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'], // Validation de longueur minimale
  },
  createdAt: {
    type: Date,
    default: Date.now // Date de création par défaut
  }
});

// Plugin pour valider l'unicité de l'email
userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('User', userSchema);