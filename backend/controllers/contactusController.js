const Contactus = require("../models/contactusModel");

exports.getContactusResponses = async (req, res) => {
  try {
    const contactusRespones = await Contactus.find();
    res.json(contactusRespones);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.sendContactusRequest = async(req,res)=>{
    
}