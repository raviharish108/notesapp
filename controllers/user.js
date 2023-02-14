import users from "../models/user.js"
import { sentEmail } from "../sendEmail.js";
import { successEmail } from "../successEmail.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { isValidObjectId } from "mongoose"
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


export const sign_up=async(req,res)=>{
  try{

  const{username,email,password}=req.body;
   if(!username || !email || !password){
           return res.status(400).json({msg: "Please fill in all fields."})
   }
  if(!validateEmail(email)){
    return res.status(400).json({msg:"invalid emails"})
  }
   
  const user = await users.findOne({email:email})
  if(user) return res.status(400).json({msg: "This email already exists."})

 if(password.length<6){
  return res.status(400).json({msg:"password must be atleast 6 to 8 characters"})
 }
  const password_hash=await bcrypt.hash(password,12);
 const payload = { "username":username,"email":email,"password":password_hash}
  const activation_token = jwt.sign(payload, process.env.activation_secret, {expiresIn: "5m"})
  const url=`http://localhost:3000/verify?token=${activation_token}`
  await sentEmail(email,url,"verify your email address")
  return res.status(500).json({msg:"Register Success! Please activate your email to start."})

}catch(err){
  return res.status(400).json({msg:err.message})
}
}

export const verify=async(req,res)=>{
  try{
    const{token}=req.query;
    if(!token){
      return res.status(400).json({msg:"token required"})
    }
    const user= jwt.verify(token,process.env.activation_secret);
    if(!user) return res.status(400).json({msg: "invalid token"})
    const{email}=user
    const check=await users.findOne({email:email})
    if(check){
     return res.status(400).json({msg:"please give some other email id"})
    }
    return  res.status(200).json({msg:"token has been verified"})
    }catch(err){
       res.json(400).json({msg:err.message})
    }
    }

export const activate_account=async(req,res)=>{
try{
 const{token}=req.query;
 const user= jwt.verify(token,process.env.activation_secret);
 if(!user) return res.status(400).json({msg: "This email does not exist."})
 const{username,email,password}=user
 const check=await users.findOne({email:email})
 if(check){
  return res.status(400).json({msg:"please give some other email id"})
 }
 const newUser=await new users({username,email,password})
await newUser.save();
return res.status(500).json({msg:"Account has been Activated!"})
}catch(err){
  res.json(400).json({msg:err.message})
}
}

export const login=async(req,res)=>{
  try{
const {email,password}=req.body;
const user=await users.findOne({email:email})
if(!user){
  return res.status(400).json({msg:"this email is not available"})
}
const ismatch=await bcrypt.compare(password,user.password)
if(!ismatch){
  return res.status(400).json({msg:"password is not correct"})
}
const payload = {id: user._id, name: user.username}
const token = jwt.sign(payload, process.env.usertoken_secret, {expiresIn: "1d"})
return res.json({token:token})
}catch(err){
  return res.status(500).json({msg:err.message})
}
}

export const forgotPassword= async (req, res) => {
  try {
      const {email} = req.body
      const user = await users.findOne({email:email})
      if(!user)
      {
        return res.status(400).json({msg: "This email does not exist."})
      }
      const payload = {id: user._id, email: user.email}
      const forgotpassword_token =await jwt.sign(payload,process.env.forgotPassword_secret , {expiresIn: "5m"})
      const url=`http://localhost:3000/token=${forgotpassword_token}&id=${user._id}`
      await sentEmail(email, url, "Reset your password")
       return res.json({msg: "Re-send the password, please check your email."})
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
}
export const changepassword=async(req,res)=>{
  try{
    const{token,id}=req.query;
    if(!token||!id){
      return res.status(400).json({msg:"invalid request"})
    }
    if(!isValidObjectId(id)){
      return res.status(400).json({msg:"invalid id"})
    }
    const user=await users.findById(id)
     if(!user){
         return res.status(400).json({msg:"user cannot found!"})
     }
   const ismatch= jwt.verify(token,process.env.forgotPassword_secret);
   if(!ismatch){
    return res.status(500).json({msg:"invalid token"})
   }
   const {password}=req.body;
   const issamepassword = await bcrypt.compare(password, user.password);
   if(issamepassword){
    return res.status(400).json({msg:"dont give same password"})
  }
  if(password.length<6){
    return res.status(400).json({msg:"password must be atleast 6 to 18 characters"})
  }
  const password_hash=await bcrypt.hash(password,12);
  await users.findOneAndUpdate({_id:id},{password:password_hash})
  await successEmail(user.email,"successfully changed password")
  return res.status(500).json({msg:"password successfully changed"})
  }catch(err){
    return res.status(500).json({msg:err.message})
  }
}