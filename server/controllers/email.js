const nodemailer = require('nodemailer')

const dispatch_email = (email,subject,body, otp)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: 'sonam.brillianceit@gmail.com',
          pass: 'vxerwpaiekxqrgvm'
        }
    });
    
     // send mail with defined transport object
    var mailOptions={
        to: email,
       subject:subject,
       html:body  // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if(error)throw error;
        return res.send({error:false, data: info, message: 'OK'});
        });
    }

    module.exports = {
        dispatch_email
    }
