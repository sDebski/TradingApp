const express = require("express");
const errorHandler = require('errorhandler');
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const logger = require('morgan');

require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const mongoStore = new MongoStore({ mongooseConnection: mongoose.connection });
const app = express();

app.use(cors({
  credentials: true,
  origin: true
}));

app.use(express.static('dist'))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore
}));

app.use(passport.initialize());
app.use(passport.session());

if ("development" === env) {
  app.use(logger("dev"));
  app.use(errorHandler());
} else {
  app.use(logger("short"));
}

const usersRoute = require("./routes/User");
const auctionRoute = require("./routes/Auction");
const loginRoute = require("./routes/Login");
const messengerRoute = require("./routes/Messanger");

app.use("/api/login", loginRoute);
app.use("/api/users", usersRoute);
app.use("/api/auctions", auctionRoute);
app.use("/api/messenger", messengerRoute);


app.use((req, res) => {
  res.status(404).json({
    error: `URL NOT FOUND: ${req.method} ${req.originalUrl}`
  });
});

const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 4000;
const server = require("./https/https")(app).listen(httpsPort);

console.log(`Listening:  HTTP: ${httpPort} | HTTPS: ${httpsPort}`);

const passportSocketIo = require("passport.socketio");
const io = require("socket.io")(server);
io.use(passportSocketIo.authorize({
  key: "connect.sid",
  secret: process.env.APP_SECRET,
  store: mongoStore,
  passport: passport,
  cookieParser: cookieParser
}));

require("./additionals/Socket")(io);

module.exports = app;
