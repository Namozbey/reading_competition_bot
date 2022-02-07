const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, trim: true },
    username: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      unique: true,
    },
    id: { type: Number, required: true },
    selected_book: { type: String, default: null },
    type: { type: String, required: true, minlength: 3, default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
