const nodemailer = require("nodemailer")

function sendEmail( toEmail ,otp){


    const transport = nodemailer.createTransport({
        service :  "Gmail",
        host: "smtp.ethereal.email",
        port: 8000,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth : {
            user : process.env.USER_EMAIL,
            pass : process.env.USER_PASS,
        }
    })

    const mailOptions = {
        from : process.env.USER_EMAIL,
        to : toEmail,
        subject : "Confirm your email",
        html : `<html>
        <body>
         ${otp}
        </body>
       </html>`
    }

    transport.sendMail(mailOptions, function(error,success){

        if(error){
            console.log(error)

        } else {
            console.log(success.response)
        }

    })

}

module.exports = sendEmail;
