const mongoose = require("../additionals/Mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  delivered: {
    type: Boolean,
    required: true
  }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
