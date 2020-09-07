const express = require("express");
const router = express.Router();

const auctionService = require("../services/AuctionService");

router.route("/")
  .get(async (req, res) => {
    let { page, limit, ...query } = req.query;
    console.log(req.query)
    let auctions = await auctionService.getAuctions({
      isActive: true,
      $or: [
        {
          isBuyNow: true,
          expirationDate: { $gt: Date.now() },
          buyer: null
        },
        {
          isBuyNow: true,
          expirationDate: null,
          buyer: null
        },
        {
          isBuyNow: false,
          expirationDate: { $gt: Date.now() }
        }
      ],
      ...query
    })

    await res.json({
      page: page,
      limit: limit,
      totalAmount: auctions.length,
      totalPages: Math.ceil(auctions.length / limit),
      auctions: auctions.reverse().slice((page-1) * limit, (page-1) * limit + limit),
    });
  })
  .post(async (req, res) => {
    if(req.isAuthenticated()){
      try {
        let auction = await auctionService.createAuction(req.user, req.body);
        return res.status(201).json(auction);
      } catch (err) {
        return res.status(400).json(err);
      }
    } else {
      return res.status(401).send();
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    let auction = await auctionService.getAuctionById(req.params.id);
    auction === null
      ? res.status(404).send()
      :await res.json(auction);
  })
  .patch(async (req, res) => {
    if(req.isAuthenticated()){
      try {
        let auction = await auctionService.getAuctionById(req.params.id);
        if(auction === null) return res.status(404).send();
        if(auction.issuing.equals(req.user.id) === false) {
          return res.status(403).send();
        }
        if(auction.isActive){
          return res.status(400).json({msg: "Active auctions cannot be modified."});
        }
        await auctionService.updateAuction(auction, req.body);
        return res.status(204).send();
      } catch (err) {
        return res.status(400).json({msg: err});
      }
    } else {
      return res.status(401).send();
    }

  });

router.route("/:id/offers")
  .get(async (req, res) => {
    let auction = await auctionService.getAuctionById(req.params.id);
    auction === null
      ? res.status(404).send()
      : await res.json(auction.offers);
  })

module.exports = router;
