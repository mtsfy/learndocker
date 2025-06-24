const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const dotenv = require("dotenv");
const KeyValue = require("./model");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("hello guys using compose!");
});

app.get("/status", (req, res) => {
  res.json({ status: "OK!", timestamp: new Date().toISOString() });
});

app.post("/store", async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      res.status(400).json({
        message: "Missing parameters: key and/or value.",
      });
      return;
    }

    const keyExists = await KeyValue.findOne({ key });

    if (keyExists) {
      res.status(400).json({
        message: "Duplicate: key already exists.",
      });
      return;
    }

    const newKey = await KeyValue.create({
      key,
      value,
    });

    res.status(201).json({
      message: "Successfully created key-value.",
      data: newKey.toJSON(),
    });
  } catch (error) {
    console.log("[GET /store] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

app.get("/store/:key", async (req, res) => {
  try {
    const { key } = req.params;

    const keyData = await KeyValue.findOne({ key });

    if (!keyData) {
      res.status(404).json({
        message: "Invalid: key doesn't exist.",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully fetched key.",
      data: keyData.toJSON(),
    });
  } catch (error) {
    console.log("[GET /store/:key] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

app.put("/store/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      res.status(400).json({
        message: "Missing parameters: value.",
      });
      return;
    }

    const updatedKeyData = await KeyValue.findOneAndUpdate({ key }, { value }, { new: true });

    if (!updatedKeyData) {
      return res.status(404).json({
        message: "Invalid: key doesn't exist.",
      });
    }

    res.status(200).json({
      message: "Successfully updated key.",
      data: updatedKeyData.toJSON(),
    });
  } catch (error) {
    console.log("[PUT /store/:key] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

app.delete("/store/:key", async (req, res) => {
  try {
    const { key } = req.params;

    const deletedKeyData = await KeyValue.findOneAndDelete({ key });

    if (!deletedKeyData) {
      return res.status(404).json({
        message: "Invalid: key doesn't exist.",
      });
    }

    res.status(200).json({
      message: "Successfully deleted key.",
    });
  } catch (error) {
    console.log("[DELETE /store/:key] ERROR:", error);
    res.status(500).json({
      message: "InternalServerError",
      error,
    });
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
