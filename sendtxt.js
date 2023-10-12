import nodemailer from "nodemailer"
import * as dotenv from "dotenv";
dotenv.config();

export const sendTxt=async(txt,from_email)=>{
    const transporter = nodemailer.createTransport({
       service:"gmail",
        auth: {
            user:process.env.mail_user, 
            pass:process.env.mail_pass ,  
        }
    });
    const message = {
        from: from_email,
        to:"raviharish108@gmail.com",
        subject: txt,
        html:`
           <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Ravi App.</h2>
            <p>${txt}</p>
            <div style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</div>
            </div>`
       
    };
    await transporter.sendMail(message, function(error, info){ 
        if (error) { 
          console.log(error); 
        } else { 
          console.log('Email sent: ' + info.response); 
        } 
      });


}