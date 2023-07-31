const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  avatar: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  universitas: { type: String, required: false },
  fakultas: { type: String, required: false },
  jurusan: { type: String, required: false },
  angkatan: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
