const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const Joi = require("joi");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/:name", (req, res) => {
  db.sequelize
    .query("CALL get_email(:name)", { replacements: { name: req.params.name } })
    .then((v) => {
      console.log(v);
      if (v.length == 0) {
        res.json({ message: "User not found" });
      } else {
        res.json(v);
      }
    });
  // res.json({ message: "Welcome to backend application." });
});

require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
