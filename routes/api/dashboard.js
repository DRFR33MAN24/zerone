const express = require("express");
const router = express.Router();

const Stat = require("../../models/Stat");

router.post("/", async (req, res) => {
  console.log("Admin");
  let stats;
  try {
    stats = await Stat.findAll({
      raw: true,
      nest: true
    });
  } catch (error) {
    console.log(error);
  }

  res.json(stats);
});

router.post("/updateStats", async (req, res) => {
  const { stats } = req.body
  console.log('updateStats', stats);
  try {
    await Stat.update(stats, { where: { id: 1 } })
  } catch (error) {
    console.log(error);
  }

  res.send("200");
});



module.exports = router;
