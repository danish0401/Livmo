const nodemailer = require("nodemailer");

const sendEmail = async options => {
  const  transporter = nodemailer.createTransport({

    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});
const message = {
  from: `${process.env.SMTP_FROM_NAME}  <${process.env.USER}>`,
  to: options.email,
  subject: options.subject,
  text: options.message
}

 transporter.sendMail(message,(err)=>{
  if(err)
  {
    console.log("it has an error",err)
  }

  else{
    console.log("email has sent")

  }

})
}


module.exports = sendEmail;



