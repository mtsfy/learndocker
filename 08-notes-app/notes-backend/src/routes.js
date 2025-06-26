const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { Note } = require("./models");

const noteRouter = express.Router();
const noteBookAPI = process.env.NOTEBOOK_API_URL;

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({
      message: "IDERR: Note not found.",
    });
    return;
  }
  next();
};

noteRouter.post("/", async (req, res) => {
  try {
    const { title, content, noteBookId } = req.body;

    let validId = null;
    if (noteBookId) {
      if (!mongoose.Types.ObjectId.isValid(noteBookId)) {
        res.status(400).json({
          message: "IDERR: Notebook not found.",
        });
        return;
      }
      console.log("BACKEND NOTEBOOK API:", noteBookAPI);
      try {
        const res = await axios({
          method: "GET",
          url: `${noteBookAPI}/${noteBookId}`,
        });
        if (res.status === 404) {
          res.status(400).json({
            message: `Notebook with ID \"${noteBookId}\" not found.`,
          });
          return;
        }
        validId = noteBookId;
      } catch (error) {
        console.error({
          message: "Error verifying the notebook ID. Upstream notebooks service not available. Storing note with provided ID for later validation.",
          noteBookId,
          error: error,
        });
      }
    }

    if (!title || !content) {
      res.status(400).json({
        message: "Missing required fields: name and content",
      });
      return;
    }

    const newNote = await Note.create({
      title,
      content,
      noteBookId: validId,
    });

    res.status(201).json({
      message: "Successfully created note.",
      data: newNote.toJSON(),
    });
  } catch (error) {
    console.log("[POST /api/notes] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteRouter.get("/", async (req, res) => {
  try {
    const notes = await Note.find({});

    res.status(200).json({
      message: "Successfully fetched all notes.",
      data: notes,
    });
  } catch (error) {
    console.log("[GET /api/notes] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteRouter.get("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      res.status(404).json({
        message: "Note not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully fetched note.",
      data: note.toJSON(),
    });
  } catch (error) {
    console.log("[GET /api/notes/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteRouter.put("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!note) {
      res.status(404).json({
        message: "Note not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully updated note.",
      data: note.toJSON(),
    });
  } catch (error) {
    console.log("[PUT /api/notes/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});
noteRouter.delete("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      res.status(404).json({
        message: "Note not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully deleted note.",
    });
  } catch (error) {
    console.log("[DELETE /api/notes/:id] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

module.exports = { noteRouter };
