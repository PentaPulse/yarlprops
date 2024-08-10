const Contactus = require("../models/contactusModel");
//const transporter = require("../config/mailService")

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

exports.sendReply=async(req,res)=>{
  const { id, reply } = req.body;

  if (!id || !reply) {
    return res.status(400).json({
      code: 'user/reply-error',
      message: 'Missing required fields',
    });
  }

  try {
    // Find the contact request by ID
    const contactRequest = await Contactus.findById(id);

    if (!contactRequest) {
      return res.status(404).json({
        code: 'user/not-found',
        message: 'Contact request not found',
      });
    }

    // Save the reply to the database
    contactRequest.reply = reply;
    contactRequest.status='responded';
    contactRequest.replyDate = new Date(); // Set the date when the reply was sent
    await contactRequest.save();    
    /*
    const info = await transporter.sendMail({
      from: 'yarlprops@p5p.lk', // Sender address
      to:contactRequest.email,  // List of receivers
      subject:"Reply for request",  // Subject line
      text:reply,  // Plain text body
      // html: "<b>Hello world?</b>" // HTML body (optional)
    });
    */
    res.status(200).json({
      code: 'user/reply-ok',
      message: 'Reply sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 'user/reply-error',
      message: 'Failed to send reply',
      error: error.message,
    });
  }
}