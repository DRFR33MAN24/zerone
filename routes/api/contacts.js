const express = require("express");
const { Sequelize } = require("../../database");
const router = express.Router();

const Contact = require("../../models/Contact");

router.post("/", async (req, res) => {
  console.log("getContacts");
  const { val, searchBy } = req.body;
  const splitedVal = val.split(" ");
  let contacts;
  try {
    if (searchBy === "name") {
      if (splitedVal.length !== 2 && splitedVal[0].length > 6) {
        contacts = await Contact.findAll({
          raw: true,
          nest: true,
          where: {
            name: { [Sequelize.Op.like]: "%" + val + "%" }
          }
        });
      }
      contacts = await Contact.findAll({
        raw: true,
        nest: true,
        where: {
          name: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.like]: "%" + splitedVal[0] + "%" },
              { [Sequelize.Op.like]: "%" + splitedVal[1] + "%" }
            ]
          }
        }
      });
    } else {
      contacts = await Contact.findAll({
        raw: true,
        nest: true,
        where: { phone: { [Sequelize.Op.like]: "%" + val + "%" } }
      });
    }
  } catch (error) {
    console.log(error);
  }

  res.json(contacts);
});

router.post("/getByName", async (req, res) => {
  console.log("getByName");
  const { name } = req.body;
  let contacts;
  try {
    contacts = await Contact.findAll({
      raw: true,
      nest: true,
      where: { name: { [Sequelize.Op.like]: "%" + name + "%" } }
    });
  } catch (error) {
    console.log(error);
  }

  res.json(contacts);
});

router.post("/getByPhone", async (req, res) => {
  const { phone } = req.body;
  let contacts;
  try {
    contacts = await Contact.findAll({
      raw: true,
      nest: true,
      where: { name: { [Op.like]: "%" + phone + "%" } }
    });
  } catch (error) {
    console.log(error);
  }

  res.json(contacts);
});

router.post("/upload", async (req, res) => {
  const { name, phone } = req.body;
  console.log(name);
  try {
    contacts = await Contact.create({
      name: name,
      phone: phone
    });
  } catch (error) {
    console.log(error);
  }

  res.send("200");
});

router.post("/delete", async (req, res) => {
  const { userId } = req.body;

  try {
    contacts = await Contact.update(
      { userId: "DELETE" },
      { where: { userId: userId } }
    );
  } catch (error) {
    console.log(error);
  }

  res.send("200");
});

module.exports = router;
