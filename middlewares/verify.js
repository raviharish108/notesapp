import  jwt  from "jsonwebtoken";
export const verify=async(req,res,next)=>{
const token=req.header("authorization")
if(!token){
    return res.status(400).json({msg:"invalid authendication"})
}
jwt.verify(token,process.env.usertoken_secret,(err,user)=>{
    if(err){
        return res.status(400).json({msg:"authorization not valid."})
    }
    // console.log(user);
    req.user=user;
    next();
})
}