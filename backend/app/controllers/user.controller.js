const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const Joi = require("joi");
var nodemailer = require("nodemailer");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request

  const data = req.body;

  const schema = Joi.object({
    firstName: Joi.string().required().max(15),
    lastName: Joi.string().required().max(15),
    email: Joi.string()
      .email()
      .pattern(new RegExp("^[a-zA-Z0-9]+@miraclesoft.com$"))
      .required(),
    password: Joi.string().required(),
    // state: Joi.string().required(),
  });

  const { value, err } = schema.validate(data);

  const pass = schema.validate(data);
  if (pass.error) {
    console.log(pass.error);

    res.status(400).send({ status: "error", error: pass.error });
  } else {
    // Create a user

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      // state: req.body.state,
    };

    // Save user in the database
    User.create(user)
      .then((data) => {
        var transporter = nodemailer.createTransport({
          host: "smtp.miraclesoft.com",
          port: 587,
          auth: {
            user: "",
            pass: "",
          },
        });

        const message = {
          from: "mdoshi@miraclesoft.com",
          to: "mdoshi@miraclesoft.com",

          // to: ${options.userEmail},
          subject: "User Registered",
          text:
            "Registered a new user with name: " +
            user.firstName +
            " " +
            user.lastName +
            " and Email Address: " +
            user.email,
        };

        transporter.sendMail(message, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.send(data);
      })
      .catch((err) => {
        console.log(err.message);

        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  }
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: `User was updated successfully with id=${id}.`,
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: `User was deleted successfully with id = ${id}!`,
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};
