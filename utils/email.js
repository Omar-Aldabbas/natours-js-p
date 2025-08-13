const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Omar@hello.io',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   // 3) Send the email

//   await transporter.sendMail(mailOptions);
// };

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Omar <omar@hello.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = sendEmail;
