module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const Joi = require("joi");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve all user
  router.get("/", users.findAll);

  // Retrieve a single user with id
  router.get("/:id", users.findOne);

  // Update a user with id
  router.put("/:id", users.update);

  // Delete a user with id
  router.delete("/:id", users.delete);

  // Delete all users
  router.delete("/donotgohere", users.deleteAll);

  app.use("/api/users", router);
};
