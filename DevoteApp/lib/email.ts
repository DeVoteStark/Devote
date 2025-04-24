import nodemailer from "nodemailer";

export class EmailService {

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || '"Your App Name" <no-reply@example.com>',
      to,
      subject,
      text,
      html,
    };
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST, 
        port: process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT) : 465,
        secure: process.env.EMAIL_SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    console.log('options: ', mailOptions);
    try{
        await transporter.sendMail(mailOptions);
    } catch(err){
        console.log(err)
    }
    
  }
}
