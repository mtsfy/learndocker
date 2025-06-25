const mongoose = require("mongoose");

const noteBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const NoteBook = mongoose.model("NoteBook", noteBookSchema);

module.exports = { NoteBook };
