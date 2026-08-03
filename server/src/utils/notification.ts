import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer Transport Config
const emailHost = process.env.EMAIL_HOST || 'smtp-mail.outlook.com';
const emailPort = parseInt(process.env.EMAIL_PORT || '587');
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFrom = process.env.EMAIL_FROM || emailUser || 'jornalmanifesto@outlook.com';

let emailTransporter: nodemailer.Transporter | null = null;

if (emailUser && emailPass) {
  const isMicrosoft = emailHost.includes('outlook') || emailHost.includes('office365') || emailHost.includes('live');

  emailTransporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465, // false for 587 (STARTTLS)
    requireTLS: isMicrosoft,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: isMicrosoft ? {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    } : undefined
  });
}

// Twilio Config
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;

if (twilioSid && twilioAuthToken) {
  twilioClient = twilio(twilioSid, twilioAuthToken);
}

/**
 * Sends a verification code (OTP) via Email.
 * Falls back to console log if SMTP credentials are missing.
 * @param to Recipient email address
 * @param code OTP code
 */
export async function sendEmailOTP(to: string, code: string): Promise<void> {
  const subject = 'Código de Verificação - Jornal Manifesto';
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #09456c; text-align: center;">Jornal Manifesto</h2>
      <p>Olá,</p>
      <p>Você solicitou um código de verificação para o seu acesso. Use o código abaixo para prosseguir:</p>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #09456c;">${code}</span>
      </div>
      <p style="font-size: 12px; color: #666;">Este código expira em 5 minutos. Se você não solicitou este código, por favor desconsidere este e-mail.</p>
    </div>
  `;

  if (emailTransporter) {
    try {
      await emailTransporter.sendMail({
        from: `Jornal Manifesto <${emailFrom}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`[PRODUÇÃO] E-mail enviado com sucesso para: ${to}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail de produção para ${to}:`, error);
      logFallbackEmail(to, code);
    }
  } else {
    logFallbackEmail(to, code);
  }
}

/**
 * Sends a verification code (OTP) via SMS.
 * Falls back to console log if Twilio credentials are missing.
 * @param to Phone number with DDD (ex: +5511999999999)
 * @param code OTP code
 */
export async function sendSMSOTP(to: string, code: string): Promise<void> {
  // Ensure the phone number starts with +55 for Brazil if not specified
  let formattedTo = to.replace(/\D/g, '');
  if (!to.startsWith('+')) {
    if (!formattedTo.startsWith('55')) {
      formattedTo = '+55' + formattedTo;
    } else {
      formattedTo = '+' + formattedTo;
    }
  } else {
    formattedTo = to;
  }

  const messageText = `Jornal Manifesto: Seu codigo de verificacao e ${code}. Nao o compartilhe com ninguem.`;

  if (twilioClient && twilioPhone) {
    try {
      await twilioClient.messages.create({
        body: messageText,
        from: twilioPhone,
        to: formattedTo,
      });
      console.log(`[PRODUÇÃO] SMS enviado com sucesso para: ${formattedTo}`);
    } catch (error) {
      console.error(`Erro ao enviar SMS de produção para ${formattedTo}:`, error);
      logFallbackSMS(formattedTo, code);
    }
  } else {
    logFallbackSMS(formattedTo, code);
  }
}

function logFallbackEmail(to: string, code: string) {
  console.log(`\n========================================`);
  console.log(`[SIMULAÇÃO] E-MAIL ENVIADO`);
  console.log(`Destinatário: ${to}`);
  console.log(`Código OTP: ${code}`);
  console.log(`Para enviar e-mails de produção reais, configure EMAIL_HOST, EMAIL_USER e EMAIL_PASS no .env`);
  console.log(`========================================\n`);
}

function logFallbackSMS(to: string, code: string) {
  console.log(`\n========================================`);
  console.log(`[SIMULAÇÃO] SMS ENVIADO`);
  console.log(`Destinatário: ${to}`);
  console.log(`Código OTP: ${code}`);
  console.log(`Para enviar SMS de produção reais, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE_NUMBER no .env`);
  console.log(`========================================\n`);
}
