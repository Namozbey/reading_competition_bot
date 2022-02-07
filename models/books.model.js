const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1 },
    is_auto: { type: Boolean, required: true, default: true },
    author: { type: String, minlength: 1 },
    img: { type: String, trim: true, minlength: 1 },
    category: { type: String, minlength: 1 },
    description: { type: String, trim: true, minlength: 1 },
    readers: [
      {
        name: String,
        page: Number,
        id: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
