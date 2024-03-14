import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import user from '../models/user.js';
import authenticate from '../middleware/authenticate.js';
import blog from '../models/blog.js';
import mongoose from 'mongoose';
import User from '../models/user.js';

const PORT = 5000;

router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/login',(req,res)=>{
  res.render('login')
});
router.post('/login', (req,res )=>{
  res.redirect('/dashboard');
})



// function insertdata(){
//   User.insertMany([
//     {
//       username: 'admin',
//       password: 'admin',    },
//     {
//       username:'shadow',
//       password:'shadow',
//     }
//   ])

// }
// insertdata();
router.post('/register', async (req,res)=>{
  const {username,password} = req.body;
  try{
    const newuser = await User.create({username,password});
    res.status(201).json({message:"user created successfully"  });
  }
  catch(error){
    res.status(400).json({message:'error.message'});
  }
})


export default router;


