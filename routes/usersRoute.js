const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', async (req, res) => {
    const newuser = new User({name:req.body.name,email:req.body.email,password:req.body.password});

    try {
        const user = await newuser.save(); // Corrected this line
        res.send("User  registered successfully");
    } catch (error) {
        return res.status(400).json({ message: "something went wrong" }); // Removed the extra semicolon
    }
});


router.post('/login', async (req, res) => {
   const {email,password }= req.body
try {
    const user= await User.findOne({email:email,password: password})
   if(user){
    const temp = {
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
      _id:user._id,
    }
    res.send(temp);
   }
   else{
    return res.status(400).json({ message: "Invalid Email or Password" }); 

   }
} catch (error) {
    return res.status(400).json({ message: "something went wrong" }); 
   
}
  
});


router.get('/getallusers', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports=router