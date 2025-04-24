// api/email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // Parsear el body de la solicitud
    const { to, subject, text, html } = await req.json();

    // Validar que se reciban los parámetros necesarios
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: "Se requieren 'to', 'subject' y 'text' o 'html'" },
        { status: 400 }
      );
    }

    // Configurar el transporter usando nodemailer y las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST, // Ejemplo: smtp.gmail.com
      port: process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT, 10) : 587,
      secure: process.env.EMAIL_SMTP_SECURE === "true", // true para puerto 465, false para otros
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configurar las opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER || '"My App" <no-reply@example.com>',
      to,
      subject,
      text,
      html,
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email enviado exitosamente", info },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al enviar email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
