const express = require("express");
const path = require("path");
const https = require("https");

const app = express();

app.use(express.static(__dirname + "/pages"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "./pages/index.html"));
});

app.get("/timezone", (req, res) => {
  let t = req.query.t;
  let result = "";

  https
    .get(
      "https://www.timeapi.io/api/Time/current/zone?timeZone=" + t,
      (response) => {
        response.on("data", (chunk) => {
          result = JSON.parse(chunk.toString())["time"] || "invalid timezone";
          res.render("timezone", { timezone: result });
        });
      }
    )
    .on("error", (err) => {
      console.log(err.message);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./pages/404.html"));
});

app.listen(PORT, () => console.log("server started"));
