const mongoose = require('../additionals/Mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  expirationDate: {
    type: Date,
    required: function() {
      return this.isBuyNow === false
    }
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  isBuyNow: {
    type: Boolean,
    required: true
  },
  issuing: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  issuingUsername: {
    type: String,
    required: true
  },
  offers: [{
    issuerId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    issuerName : {
      require: true,
      type: String
    },
    price: {
      require: true,
      type: Number,
      min: 1
    }
  }]
});

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction;
