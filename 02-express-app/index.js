const express = require("express");
const bodyParser = require("express");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = ["john", "mark", "luke"];

app.get("/", (req, res) => {
  res.send("hello guys");
});

app.post("/add", (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "missing name",
      });
    }

    if (users.includes(name)) {
      return res.status(400).json({
        message: "user already added",
      });
    }

    users.push(name);

    return res.status(201).json({
      message: "user added successfully",
    });
  } catch (error) {
    return res.status(501).json({
      message: error,
    });
  }
});

app.get("/users", (req, res) => {
  try {
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(501).json({
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
