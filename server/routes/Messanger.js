const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.route("/:recipient") // slownik

  .get(async (req, res) => {
    return res.json(await Message.where({$or:[
        {"recipient": req.user.username, "sender":req.params.recipient},
        {"recipient": req.params.recipient, "sender":req.user.username}
      ]}))
  })

module.exports = router;
