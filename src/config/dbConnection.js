const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("mongodb connected");
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = dbConnect;
