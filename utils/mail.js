const nodemailer = require('nodemailer');

const sendEmail = options => {
    //Create Transporter
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASSWORD
        }
    })

    //Define Email options
    const mailOptions = {
        from : 'ashiagarwal551@gmail.com',
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    transporter.sendMail(mailOptions);
}

module.exports = sendEmail;