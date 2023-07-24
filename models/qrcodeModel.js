const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    url: { type: String, required: true },
    shortUrl: { type: String },
    qrLogo: { type: String },
    title: { type: String },
    customColor: { type: String },
    scan: { type: Number },
  },
  { timestamps: true }
);

const Qr = mongoose.model("Qr", qrSchema);

module.exports = Qr;
