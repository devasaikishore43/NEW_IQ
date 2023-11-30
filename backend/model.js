// const mongoose = require('mongoose');

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        first_name:{
            type:String,
            required:true
        }, 
        last_name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique: true
        },
        password:{
            type:String,
            required:true
        }, 
        phone:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        todo:{
            type:Array
        },
        date:{
            type:Date,
        },
        pic:{
            type:String,
        }
    }
);

module.exports = mongoose.model("UserSchema", UserSchema);


