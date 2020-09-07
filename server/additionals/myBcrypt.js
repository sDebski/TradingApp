const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const generateHash = (password) => bcrypt.hash(password, salt);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  generateHash,
  verifyPassword
};

