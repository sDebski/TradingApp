const Message = require("../models/Message");
const Mutex = require('async-mutex').Mutex;
const auctionService = require('../services/AuctionService')

const connectedClients = {};
const _mutex = new Mutex();

const setup = (socketIo) => {
  socketIo.on("connection", clientSocket => {
    console.log("conectuje: " + clientSocket.request.user.username)
    connectedClients[clientSocket.request.user.username] = clientSocket;
    checkForMessages(clientSocket.request.user.username, clientSocket);

    clientSocket.on("sendMessage", data => {
      let recipient = connectedClients[data.recipient];
      let messageDelivered = false;

      if (recipient) {
        messageDelivered = true;
        recipient.emit("message", {
          message: data.message,
          sender: clientSocket.request.user.username
        });
      }
      new Message({
        message: data.message,
        sender: clientSocket.request.user.username,
        recipient: data.recipient,
        delivered: messageDelivered
      }).save();
    })

    clientSocket.on("placeOffer", data => betProcedure(socketIo, clientSocket, data.auctionId, data.offer, connectedClients))

    clientSocket.on("disconnect", () => {
      console.log('disconecting: ' + clientSocket.request.user.username)
      delete connectedClients[clientSocket.request.user.username];
    });
  });
}

const checkForMessages = (username, clientSocket) => {
  return Message.where({ recipient: username, delivered: false}).exec()
    .then(pendingMessages => {
      if (pendingMessages.length === 0 ) return;
      pendingMessages.forEach(pendingMessage => clientSocket.emit("message", {
        message: pendingMessage.message,
        sender: pendingMessage.sender
      }));
      Message.updateMany(
        { _id: { $in: pendingMessages.map(x => x._id)} },
        { $set: { delivered: true }}
      ).exec();
    });
}

const betProcedure = async (socketIo, socket, auctionId, offer, connectedClients) => {
  let release = await _mutex.acquire();
  let auction = await auctionService.getAuctionById(auctionId);

  if( auction === null) socket.emit("auctionBetResult", { successful: false, msg: "Auction not found"});
  try {

    let lastBidder = auction.offers[auction.offers.length -1].issuerName
    let auctionTitle = auction.title

    let createOffer = await auctionService.placeOffer(
      auction,
      socket.request.user.id,
      offer,
      socket.request.user.username
    )
    socket.emit("auctionBetResult", { successful: true, auction, createOffer });#
    socketIo.emit("auctionBet", { auction })

    if (auction.offers.length > 0) {
      sendMessageFromServer({
        connectedClients: connectedClients,
        lastBidder: lastBidder,
        message: `You have been auctioned on ${auctionTitle}`,
        sender: '@SERVER@'
      })
    }
  } catch (err) {
    socket.emit("auctionBetResult", { successful: false, msg: err })
  }
  release();
}

const sendMessageFromServer = (data) => {
  let recipient = connectedClients[data.lastBidder]
  let messageDelivered = false;

  if (recipient) {
    messageDelivered = true;
    recipient.emit("message", {
      message: data.message,
      sender: data.sender
    });
  }
  new Message({
    message: data.message,
    sender: data.sender,
    recipient: data.lastBidder,
    delivered: messageDelivered
  }).save();

}



module.exports = setup;
