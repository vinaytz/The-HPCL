const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userType: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("Users", UserSchema)