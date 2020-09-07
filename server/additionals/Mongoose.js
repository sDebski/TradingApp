const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTIONSTRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

mongoose.connection
  .on("open", () => console.log("Connection started"))
  .on("error", () => console.error.bind(console, "Error with MongoDB connection"));

module.exports = mongoose;
