const express = require("express");
const bodyParser = require("body-parser");
const { noteBooksRouter } = require("./routes");
const connectDB = require("./db");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello from notebooks!");
});

app.get("/status", (req, res) => {
  res.json({ status: "OK!", timestamp: new Date().toISOString() });
});

app.use("/api/notebooks", noteBooksRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Notebooks server running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start notebooks server:", error);
    process.exit(1);
  }
};

startServer();
