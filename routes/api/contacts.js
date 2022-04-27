const express = require("express");
const { Sequelize } = require("../../database");
const router = express.Router();
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");
const activate = require("../../emailTemplates/activate");
const Contact = require("../../models/Contact");
const Hash = require("../../models/Hash");


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
            name: { [Sequelize.Op.like]: "%" + val + "%" },
            userID: { [Sequelize.Op.not]: 'deleted' }
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
          },
          userID: { [Sequelize.Op.not]: 'deleted' }
        }
      });
    } else {
      contacts = await Contact.findAll({
        raw: true,
        nest: true,
        where: {
          phone: { [Sequelize.Op.like]: "%" + val + "%" },
          userID: { [Sequelize.Op.not]: 'deleted' }
        }
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
      where: {
        name: { [Sequelize.Op.like]: "%" + name + "%" },
        userID: { [Sequelize.Op.not]: 'deleted' }
      }
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
      where: {
        name: { [Op.like]: "%" + phone + "%" },
        userID: { [Sequelize.Op.not]: 'deleted' }
      }
    });
  } catch (error) {
    console.log(error);
  }

  res.json(contacts);
});

router.post("/upload", async (req, res) => {
  const { name, phone, userId } = req.body;
  console.log(name);
  try {
    contacts = await Contact.create({
      name: name,
      phone: phone,
      userId: userId
    });
  } catch (error) {
    console.log(error);
  }

  res.send("200");
});

var rand, mailOptions, host, link;

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: "cudddan@gmail.com",
      pass: "zsfjhoyzbsuyqvlv"
    },

    // service: "localhost",
    // host: "mail.coinguru.biz",
    // port: 290,
    // secure: true,
    // auth: {
    //   user: "support@coinguru.biz",
    //   pass: "blackmesa-123"
    // },
    tls: {
      rejectUnauthorized: false
    }
  })
);

router.post("/deleteData", async (req, res) => {
  const { userId, email } = req.body;

  console.log("sending Email");
  rand = crypto
    .createHash("md5")
    .update(email)
    .digest("hex");

  host = req.get("host");
  link = "http://" + host + "/api/contacts" + "/verify?id=" + rand;
  mailOptions = {
    from: "Zerone <support@zerone.com>",
    to: req.body.email,
    subject: "Please confirm data deletion",
    html: activate.activationTemplate(link)
  };

  console.log(mailOptions);

  Hash.create({
    hash: rand,
    userId: userId
  })
    .then(() => console.log("Hash saved...."))
    .catch(() => console.log("Operation failed"));

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.json({ sent: false });
    } else {
      console.log("Message sent: " + response.message);

      res.json({ sent: true });
    }
    try {

    } catch (error) {
      console.log(error);
    }

    res.send("200");
  });
});

router.get("/verify", function (req, res) {
  console.log("Domain is matched. Information is from Authentic email");

  Hash.findOne({ where: { hash: req.query.id } }).then(h => {
    Contact.update({ userId: 'deleted' }, { where: { userId: h.userId } })
      .then(() => {
        console.log("Data deleted");
        h.destroy()
          .then(() => console.log("Hash Deleted"))
          .catch(err => console.log("Hash not deleted", err));
      })
      //.then(() => res.redirect("https://coinguru.biz/app"))
      .then(() => res.send('Data deleted successfully!'))
      .catch(() => console.log("Activation Error"));
  });
});

module.exports = router;
