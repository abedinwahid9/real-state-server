const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("real state server running");
});

app.listen(port, () => {
  console.log(`real state server running ${port}`);
});
