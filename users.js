const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  region: { type: String },
  animal: {
    name: String,
    age: String,
    description: String,
    animalImage: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);
