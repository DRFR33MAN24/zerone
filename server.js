const express = require("express");
const config = require("config");
const path = require("path");
const db = require("./database");

const app = express();
app.use(express.json());

db.authenticate()
  .then(() => {
    console.log("Authenticated");
    db.sync({ force: true });
    //db.close();
  })
  .catch(err => {
    console.log("Unable to connect", err);
  });

app.use("/api/contacts", require("./routes/api/contacts"));
app.use("/api/dashboard", require("./routes/api/dashboard"));

const port = process.env.PORT || 5000;

const server = app.listen(port);
process.on("SIGINT", () => {
  console.log(" Closing DB connection and server");
  db.close();
  server.close();
});
