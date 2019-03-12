const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name:{
        trim:true,
        type:String,
        required:true
    },
    email:{
        trim:true,
        type:String,
        required:true
    },
    password:{
        trim:true,
        type:String,
        required:true
    },
    avatar:{
        trim:true,
        type:String,
        required:true
    },
    date:{
        trim:true,
        type:Date,
        default:Date.now
    }
})
module.exports = User = mongoose.model('User', UserSchema);