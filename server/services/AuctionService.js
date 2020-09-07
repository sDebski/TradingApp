const Auction = require("../models/Auction");

const getAuctions = (queryParams) => Auction.where(queryParams);

const createAuction = async (issuer, auction) => {
    if(!!auction.expirationDate && auction.expirationDate <= Date.now()){
      throw "Invalid expiration date!";
    }

    try {
    return await new Auction({
      title: auction.title,
      expirationDate: auction.expirationDate,
      isActive: auction.isActive,
      price: auction.price,
      isBuyNow: auction.isBuyNow,
      issuing: issuer.id,
      issuingUsername: issuer.username
    }).save();
  } catch (err) {
    console.log(err);
    throw Auction.processError(err);
  }
};

const getAuctionById = (id) => new Promise((res) => res(Auction.findById(id)));

const isAuctionAcceptsOffers = (auction) => {
  if (auction.isActive === false) return false;
  if (auction.isBuyNow && auction.buyer) return false;
  if (auction.expirationDate && auction.expirationDate <= Date.now()) return false;

  return true;
}

const canAuctionBeModified = (auction) => auction.isActive === false;

const isOfferValid = (auction, offer) => {
  if (auction.isBuyNow) {
    return auction.price === offer;
  } else {
    return auction.price < offer;
  }
}

const placeOffer = async (auction, issuerId, price, issuerName) => {
  if (auction.issuing.equals(issuerId))
    throw "Auction owner cannot place offer";
  if (isAuctionAcceptsOffers(auction) === false)
    throw "Auction is not accepting offers";
  if (isOfferValid(auction, price) === false)
    throw "Invalid offer placed for auction";
  if (auction.isBuyNow === false)
    auction.price = price;
  let offer = { issuerId, issuerName, price};

  auction.buyer = issuerId;
  auction.offers.push(offer);
  await auction.save();

  return offer;
}

const updateAuction = async (auction, changes) => {
  for (let key in changes) {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      auction[key] = changes[key];
    } else {
      throw "Invalid property name.";
    }
  }
  await auction.save();
  return auction;
}

module.exports = {
  getAuctions,
  createAuction,
  getAuctionById,
  placeOffer,
  isAuctionAcceptsOffers,
  canAuctionBeModified,
  updateAuction
}
