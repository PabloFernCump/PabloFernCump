import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función genérica para enviar correos
export const sendReservationEmail = async (
  userEmail: string, 
  reservation: any, 
  type: 'PENDING' | 'CONFIRMED',
  paymentUrl?: string // <--- NUEVO: Añadimos este parámetro para recibir la URL de Stripe
) => {
  
  const isConfirmed = type === 'CONFIRMED';
  
  const mailOptions = {
    from: `"Club Deportivo 🎾" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: isConfirmed ? '✅ ¡Reserva Confirmada y Pagada!' : '⏳ Reserva Recibida - Pendiente de Pago',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center; background-color: ${isConfirmed ? '#27ae60' : '#f39c12'}; color: white; padding: 10px; border-radius: 8px;">
          <h2 style="margin: 0;">${isConfirmed ? '¡Todo listo!' : 'Reserva Pendiente'}</h2>
        </div>
        
        <p style="margin-top: 20px;">Hola,</p>
        <p>${isConfirmed 
          ? 'Hemos recibido tu pago correctamente. ¡Te esperamos en la pista!' 
          : 'Tu reserva ha sido registrada, pero aún <strong>no está confirmada</strong>. Para asegurar tu pista, por favor completa el pago.'}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p><strong>Deporte:</strong> ${reservation.sport}</p>
          <p><strong>Día:</strong> ${reservation.date}</p>
          <p><strong>Pista:</strong> ${reservation.courtName}</p>
          <p><strong>Hora:</strong> ${reservation.hour}:00h</p>
        </div>

        ${(!isConfirmed && paymentUrl) ? `
          <div style="text-align: center; margin-top: 25px;">
            <a href="${paymentUrl}" style="background-color: #3498db; color: white; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              💳 PAGAR AHORA
            </a>
            <p style="font-size: 11px; color: #999; margin-top: 10px;">
              Si el botón no funciona, copia este enlace en tu navegador:<br>
              ${paymentUrl}
            </p>
          </div>
        ` : ''}

        <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
          Club Deportivo - Gestión de Reservas
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};