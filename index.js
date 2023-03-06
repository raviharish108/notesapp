import express from "express";
import { connect } from "./connect.js";
import * as dotenv from "dotenv";
import cors from "cors";
import userroutes from "./routes/user.js"
import notesroute from "./routes/notes.js"
import { sendTxt } from "./sendtxt.js";
dotenv.config();
const PORT= 5000;
const app=express();
app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/api/user",userroutes);
app.use("/api/notes",notesroute);
app.post("/api/send/txt",async(req,res)=>{
    try{
         const{txt,from_email}=req.body;
         await sendTxt(txt,from_email);
         return res.status(200).json({msg:"successfully message send"})
    }catch(err){
        return res.status(400).json({msg:err.message})
    }
})
app.listen(PORT, async() => {
    await connect();
    await console.log('Server is running on port', PORT)
})