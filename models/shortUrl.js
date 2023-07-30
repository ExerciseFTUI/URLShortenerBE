const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: false,
    unique: true,
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: false,
    default: 0,
  },
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
