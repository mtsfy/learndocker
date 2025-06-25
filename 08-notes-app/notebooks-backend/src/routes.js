const express = require("express");
const { NoteBook } = require("./models");
const mongoose = require("mongoose");

const noteBooksRouter = express.Router();

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({
      message: "IDERR: Notebook not found.",
    });
    return;
  }
  next();
};

noteBooksRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Missing parameter: name",
      });
      return;
    }

    const newNoteBook = await NoteBook.create({
      name,
      description: description ? description : null,
    });

    res.status(201).json({
      message: "Successfully created notebook.",
      data: newNoteBook.toJSON(),
    });
  } catch (error) {
    console.log("[POST /api/notebooks] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteBooksRouter.get("/", async (req, res) => {
  try {
    const noteBooks = await NoteBook.find({});

    res.status(200).json({
      message: "Successfully fetched all notebooks.",
      data: noteBooks,
    });
  } catch (error) {
    console.log("[GET /api/notebooks] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteBooksRouter.get("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const noteBook = await NoteBook.findOne({
      _id: id,
    });

    if (!noteBook) {
      res.status(404).json({
        message: "Notebook not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully fetched notebook.",
      data: noteBook.toJSON(),
    });
  } catch (error) {
    console.log("[GET /api/notebooks/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteBooksRouter.put("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const noteBook = await NoteBook.findByIdAndUpdate(id, { name, description }, { new: true });

    if (!noteBook) {
      res.status(404).json({
        message: "Notebook not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully updated notebook.",
      data: noteBook.toJSON(),
    });
  } catch (error) {
    console.log("[PUT /api/notebooks/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteBooksRouter.delete("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const noteBook = await NoteBook.findByIdAndDelete(id);

    if (!noteBook) {
      res.status(404).json({
        message: "Notebook not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully deleted notebook.",
    });
  } catch (error) {
    console.log("[DELETE /api/notebooks/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

module.exports = { noteBooksRouter };
