import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html) => {
  try {
    // Create reusable transporter object using the default SMTP transport

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST, // Ejemplo: smtp.gmail.com
      port: process.env.EMAIL_SMTP_PORT
        ? parseInt(process.env.EMAIL_SMTP_PORT, 10)
        : 587,
      secure: process.env.EMAIL_SMTP_SECURE === "true", // true para puerto 465, false para otros
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || '"My App" <no-reply@example.com>',
      to,
      subject,
      text,
      html,
    };

    // Send email

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar email:", error);
      } else {
        console.log("Email enviado exitosamente:", info.response);
      }
    });
    return info;
  } catch (error) {
    console.error("Error al conectar con el correo electrónico:", error);
    throw error;
  }
};

export default sendEmail;
