
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
// "Otp for registration is: ",
// "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
const dispatch_email = async (email,subject,text,data)=>{
    console.log(email, subject, text, data)
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: 'sonam.brillianceit@gmail.com',
          pass: 'vxerwpaiekxqrgvm'
        }
    });
    
     // send mail with defined transport object
    var mailOptions={
        from :'sonam.brillianceit@gmail.com',
        to: email,
       subject: subject,
       html:`${text} <br> "<h1 style='font-weight:bold;'>" + ${data} +"</h1>"`
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            res.send('otp')
        });
    }

    module.exports = {
       dispatch_email
    }

    