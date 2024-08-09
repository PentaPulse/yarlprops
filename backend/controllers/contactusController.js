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
    const {firstName,lastName,email,message}=req.body;
    try{
      const newReq = new Contactus({
        firstName,
        lastName,
        email,
        message,
        status:"new"
      });
      const response = await newReq.save()
      res.status(200).json({code:"contactus/send-ok",message:"Message sent successfully",response})
    }catch(error){
      res.status(500).json({code:"contactus/send-error",message:"Message not sent",error})
    }
}