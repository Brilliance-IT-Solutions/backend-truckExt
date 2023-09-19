
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')

async function dispatch_email(email,subject,text,data){
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        service:'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'sonam.brillianceit@gmail.com',
          pass: 'nlrwwcgodnfcxnss' //vxerwpaiekxqrgvm
        }
    });
    
     // send mail with defined transport object
    var mailOptions={
        from :'sonam.brillianceit@gmail.com',
        to: email,
       subject: subject,
       html:`${text}<br><h1 style='font-weight:bold;'>${data}</h1>`
     };
     
    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            res.send('otp')
        });
    }

    module.exports =  dispatch_email


    