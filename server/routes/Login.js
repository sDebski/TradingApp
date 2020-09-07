const express = require("express");
const router = express.Router();

const passport = require("../additionals/Passport");

router.route("/")
  .post(passport.authenticate("local"), (req, res) => {
    try {
      res.status(200).send(req.user)
    } catch {
      console.log(console.log('error przy logowaniu'))
    }
  })
  .get((req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.json(req.user);
      } else {
        res.status(401).send();
      }
    } catch {
      console.log('error przy sprawdzaniu autentykacji')
    }
  })
  .delete((req, res) => {
    req.logout()
    res.status(200).send();
  })

module.exports = router;
