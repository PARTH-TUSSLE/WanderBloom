const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderbloom";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then((res) => {
    console.log("Connection to DB Successful!");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "683da897fa27f3fae6288bec",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
