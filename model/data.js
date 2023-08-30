const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    name:{
        type: String,
        required: true
    },
    origin:{
     type: String,
     required: true
    },
    destination:{
        type: String,
        required: true
    },
    secret_key: {
        type: String,
        required: true
    }
  });
  
const Data = mongoose.model('Data', DataSchema);

module.exports = Data;