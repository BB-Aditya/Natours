const mongoose = require('mongoose');
import { isEmail } from 'validator';

const userSchema = new mongoose.Schema({

  name:{
    type: String,
    required: [true, "username is mandatory"]
  },

  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate : [ isEmail(val), "Please enter valid email"]
  },

  photo: String,

  password: {
    type:String,
    minlength:[8, "Password should contain more than 8 characters"],
    required: [true, "Password is necessary"]
  },

  confirmPassword: {
    type:String,
    validate:{
      validator: function(val){
         return val===this.password
      },
      message: "Passwords don't match"
    }
  }
});

const User = mongoose.model("User","userSchema");

module.exports = User;