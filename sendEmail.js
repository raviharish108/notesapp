import nodemailer from "nodemailer"

export const sentEmail=async(email,url,txt)=>{
    const transporter = nodemailer.createTransport({
       service:"gmail",
        auth: {
            user:process.env.username, 
            pass:process.env.password,  
        }
    });
    const message = {
        from: "notesApp@gmail.com",
        to: email,
        subject: txt,
        html:`<html>

        <head>
        
        <title>Activate Account</title>
        
        </head>
        
        <body>
        
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Ravi App.</h2>
            <p>Congratulations! You're almost set to start using NOTES APP.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        
        <p>Sincerely,<br>
        notesApp@gmail.com</p>
        
        </body>
        
        </html>`
       
    };
    await transporter.sendMail(message, function(error, info){ 
        if (error) { 
          console.log(error); 
        } else { 
          console.log('Email sent: ' + info.response); 
        } 
      });


}