module.exports = (app) => {
  const fs = require("fs");
  const https = require("https");
  return https.createServer({
    key: fs.readFileSync("./server/https/localhost.key"),
    cert: fs.readFileSync("./server/https/localhost.cert")
  }, app);
};
