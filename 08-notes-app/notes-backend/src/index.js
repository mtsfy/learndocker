const express = require("express");
const bodyParser = require("body-parser");
const { noteRouter } = require("./routes");
const connectDB = require("./db");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello from notes!");
});

app.get("/status", (req, res) => {
  res.json({ status: "OK!", timestamp: new Date().toISOString() });
});

app.use("/api/notes", noteRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Notes server running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start notes server:", error);
    process.exit(1);
  }
};

startServer();
