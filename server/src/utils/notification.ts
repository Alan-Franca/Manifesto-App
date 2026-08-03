import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

export interface DeliveryResult {
  success: boolean;
  mode: 'production' | 'simulation';
  error?: string;
  details?: string;
}

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
    tls: {
      rejectUnauthorized: false
    }
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
 * Falls back to console log if SMTP credentials are missing or fail.
 * @param to Recipient email address
 * @param code OTP code
 */
export async function sendEmailOTP(to: string, code: string): Promise<DeliveryResult> {
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
      console.log(`[PRODUÇÃO - SMTP] E-mail enviado com sucesso para: ${to}`);
      return {
        success: true,
        mode: 'production',
        details: `E-mail enviado com sucesso via SMTP (${emailHost}) para ${to}`
      };
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.error(`[ERRO SMTP PRODUÇÃO] Falha ao enviar e-mail para ${to}:`, errorMsg);
      logFallbackEmail(to, code);
      return {
        success: false,
        mode: 'production',
        error: errorMsg,
        details: `Erro no servidor SMTP (${emailHost}): ${errorMsg}. Veja o código impresso no console do servidor.`
      };
    }
  } else {
    logFallbackEmail(to, code);
    return {
      success: true,
      mode: 'simulation',
      details: 'Modo de Simulação ativo (EMAIL_USER / EMAIL_PASS não configurados no servidor). Código impresso no console do backend.'
    };
  }
}

/**
 * Sends a verification code (OTP) via SMS.
 * Falls back to console log if Twilio credentials are missing or fail.
 * @param to Phone number with DDD (ex: +5511999999999)
 * @param code OTP code
 */
export async function sendSMSOTP(to: string, code: string): Promise<DeliveryResult> {
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
      console.log(`[PRODUÇÃO - TWILIO] SMS enviado com sucesso para: ${formattedTo}`);
      return {
        success: true,
        mode: 'production',
        details: `SMS enviado via Twilio para ${formattedTo}`
      };
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.error(`[ERRO TWILIO PRODUÇÃO] Falha ao enviar SMS para ${formattedTo}:`, errorMsg);
      logFallbackSMS(formattedTo, code);
      return {
        success: false,
        mode: 'production',
        error: errorMsg,
        details: `Erro no Twilio: ${errorMsg}. Veja o código impresso no console do servidor.`
      };
    }
  } else {
    logFallbackSMS(formattedTo, code);
    return {
      success: true,
      mode: 'simulation',
      details: 'Modo de Simulação ativo (Twilio não configurado). Código impresso no console do backend.'
    };
  }
}

function logFallbackEmail(to: string, code: string) {
  console.log(`\n========================================`);
  console.log(`[SIMULAÇÃO / FALLBACK] E-MAIL`);
  console.log(`Destinatário: ${to}`);
  console.log(`Código OTP E-mail: ${code}`);
  console.log(`Para enviar e-mails reais, certifique-se de que EMAIL_HOST, EMAIL_USER e EMAIL_PASS estejam corretos no .env`);
  console.log(`========================================\n`);
}

function logFallbackSMS(to: string, code: string) {
  console.log(`\n========================================`);
  console.log(`[SIMULAÇÃO / FALLBACK] SMS`);
  console.log(`Destinatário: ${to}`);
  console.log(`Código OTP SMS: ${code}`);
  console.log(`========================================\n`);
}
