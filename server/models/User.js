const mongoose = require('../additionals/Mongoose');
const bcrypt = require('../additionals/myBcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(uniqueValidator);
userSchema.methods.isValidPassword = function (password)  {
  return bcrypt.verifyPassword(password, this.password)
};

const User = mongoose.model('User', userSchema);

module.exports = User;
