const bcrypt = require("../additionals/myBcrypt");
const User = require("../models/User");

const getAllUsers = () => User.find({});

const getUserById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return User.findOne({_id: id});
  }
  return null;
};

const addUser = async (username, password) => {
  try
  {
    return await new User({
      username: username,
      password: await bcrypt.generateHash(password)
    }).save();
  } catch (error) {
    console.log(error);
    throw User.processError(error);
  }
}


module.exports =
  {
    addUser,
    getAllUsers,
    getUserById
  }
