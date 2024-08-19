const Service = require("../models/serviceModel");

exports.getService = async (req, res) => {
  try {
    const service = await Service.find();
    res.json(service);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};