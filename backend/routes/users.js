const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/users',async(req,res)=>{
    const {firstName,lastName,displayName,email,role,password} = req.body

    const newUser = new User({
        firstName,
        lastName,
        displayName,
        email,
        role,
        password
    })

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(error){
        res.status(500).json({message:'Error handling user : ',error});
    }
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.findOne({email,password})
        if(user){
            res.status(200).json(user)
        }else{
            res.status(401).json({code:'Invalid-credentials',message:"Invalid email or password"})
        }
    }catch(e){
        res.status(500).json({code:'auth-error',message:"Error during authentication"})
    }
})

router.get('/users',async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(e){
        res.status(500).json({message:`Error fetching user from mongo : ${e}`})
    }
})

module.exports = router;