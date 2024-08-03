const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users',async(req,res)=>{
    const {firstName,lastName,displayName,email,role} = req.body

    const newUser = new User({
        firstName,
        lastName,
        displayName,
        email,
        role
    })

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(error){
        res.status(500).json({message:'Error handling user : ',error});
    }
});

router.get('/users',async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(e){
        res.status(500).json({message:'Error fetching user from mongo : ',e})
    }
})

module.exports = router;