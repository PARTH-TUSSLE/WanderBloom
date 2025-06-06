const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passprtLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
})// username and password -> passport local mongoose

userSchema.plugin(passprtLocalMongoose);

module.exports = mongoose.model('User', userSchema);