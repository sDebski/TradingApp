const express = require("express");
const router = express.Router();

const userService = require("../services/UserService");
const auctionService = require("../services/AuctionService");


router.route("/")
  .get(async (_, res) => res.json(await userService.getAllUsers()))
  .post(async (req, res) => {
    if(!("username" in req.body) || !("password" in req.body)){
      res.status(400).send({msg: "Missing username or password."});
    } else {
      try {
        await res.status(201).json(await userService.addUser(req.body.username, req.body.password));
      }
      catch (regServiceErr) {
        await res.status(422).json(regServiceErr);
      }
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    if(req.isAuthenticated()){
      let user = await userService.getUserById(req.params.id);
      return (req.user.id !== req.params.id) ? res.status(403).send() : res.json(user);
    } else {
      return res.status(401).send();
    }
  });

router.route("/:id/auctions")
  .get(async (req, res) => {
    if (req.isAuthenticated() == false){
      return res.status(401).send();
    }
    if(req.user.id != req.params.id){
      return res.status(403).send();
    }
    let ownedAuctions = await auctionService.getAuctions({
      issuing: req.user.id,
      expirationDate: {
        $gt: Date.now()
      }
    });

    return res.json(ownedAuctions);
  });

router.route("/:id/history")
  .get(async (req, res) => {
    if (req.isAuthenticated()){
      if(req.user.id != req.params.id){
        return res.status(403).send();
      }
      let ownedClosedAuctions = await auctionService.getAuctions({
        issuing: req.user.id,
        expirationDate: { $lte: Date.now() }
      });
      return res.json(ownedClosedAuctions);
    } else {
      return res.status(401).send();
    }
  });

router.route("/:id/observed")
  .get(async (req, res) => {
    if (req.isAuthenticated()){
      if(req.user.id != req.params.id){
        return res.status(403).send();
      }
      let observed = await auctionService.getAuctions({
        expirationDate: { $gt: Date.now() },
        offers: { $elemMatch: { issuerId: req.user.id }},
        isBuyNow: false
      });
      return res.json(observed);
    } else {
      return res.status(401).send();
    }
  });

router.route("/:id/observed/won")
  .get(async (req, res) => {
    if (req.isAuthenticated()){
      if(req.user.id != req.params.id){
        return res.status(403).send();
      }
      let wonAuctions = await auctionService.getAuctions({
        $or: [
          {
            isBuyNow: true,
            buyer: req.params.id
          },
          {
            isBuyNow: false,
            expirationDate: {
              $lte: Date.now()
            },
            buyer: req.params.id
          }
        ]
      });
      return res.json(wonAuctions);
    } else {
      return res.status(401).send();
    }
  });


module.exports = router;
