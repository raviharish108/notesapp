import notes from "../models/notes.js";

export const create_note=async(req,res)=>{
    try{
        const {title,content,date}=req.body;
        const note={
                  "title":title,
                  "content":content,
                  "date":date,
                  "owner_id":req.user.id,
                "owner_name":req.user.name,
            }
         const new_note=await new notes(note);
         await new_note.save();
         return res.json({msg:"successfully created new note"}) 
        }catch(err){
        return res.status(500).json({msg:err.message})
       }
       }
       export const getnotes=async(req,res)=>{
        try{
           const mynotes=await notes.find({owner_id:req.user.id});
           res.json(mynotes);
        }catch(err){
            res.status(500).json({msg:err.message})
        }
       }
       
       export const getonenote=async(req,res)=>{
        const{id}=req.params;
        const note=await notes.findOne({_id:id});
        if(!note){
            return res.status(400).json({msg:"note not found!"})
        }
        const owner=await notes.findOne({owner_id:req.user.id});
       
        if(owner.owner_id===note.owner_id){
            return res.status(200).json(note)
        }else{
            return res.status(400).json({msg:"you can access your note only!!"});
        } 
       }

       export const updatenote=async(req,res)=>{
        try{
            const{id}=req.params;
            const note=await notes.findOne({_id:id})
            if(!note){
                return res.status(500).json({msg:"note not found!"})
            }
            const owner=await notes.findOne({owner_id:req.user.id});
            if(owner.owner_id===note.owner_id){
                 await notes.findByIdAndUpdate({_id:id},{$set: req.body},{new:true});
            }else{
                return res.status(500).json({msg:"you can edit your note only"})
            }
            return res.status(200).json({msg:"successfully updated"})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
       }
       export const deletenote=async(req,res)=>{
        try{
            const{id}=req.params;
            const note=await notes.findOne({_id:id})
            if(!note){
                return res.status(500).json({msg:"note not found!"})
            }
            const owner=await notes.findOne({owner_id:req.user.id});
            if(owner.owner_id===note.owner_id){
                await notes.findByIdAndDelete(req.params.id);
           }else{
               return res.status(500).json({msg:"you can delete your note only"})
           }
             return res.status(200).json({msg:"successfully deleted!!"});
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
       
       }


