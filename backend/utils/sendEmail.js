import nodemailer from 'nodemailer';

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an App Password, not your login password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP',
    html: `<h1>Verification Code</h1>
           <p>Your OTP for logging in is: <strong>${otp}</strong></p>
           <p>This code expires in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;