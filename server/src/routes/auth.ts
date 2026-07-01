import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDisposableEmail } from '../utils/disposableEmails.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { sendEmailOTP, sendSMSOTP } from '../utils/notification.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_manifesto_token_key_123!';

// Helper to generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. REGISTER
router.post('/register', async (req: any, res: any) => {
  const { name, email, phone, gender, password } = req.body;

  try {
    if (!name || !email || !phone || !gender || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validation: Disposable Email
    if (isDisposableEmail(email)) {
      return res.status(400).json({ 
        error: 'E-mails temporários não são permitidos para cadastro. Use um e-mail permanente.' 
      });
    }

    // Format check for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido' });
    }

    // Format check for phone (DDD + 8 or 9 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({ error: 'Número de telefone inválido. Deve incluir DDD.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { phone }] 
    });

    if (existingUser) {
      // If the user already exists but is NOT verified yet, we can update their verification codes
      // and allow them to request new verification codes.
      if (!existingUser.emailVerified || !existingUser.phoneVerified) {
        const emailCode = generateOTP();
        const phoneCode = generateOTP();

        existingUser.name = name;
        existingUser.password = password; // pre-save hook will hash it
        existingUser.gender = gender;
        existingUser.emailVerificationCode = emailCode;
        existingUser.phoneVerificationCode = phoneCode;
        
        await existingUser.save();

        // Send OTPs via configured production channels (or falls back to simulator logs)
        await sendEmailOTP(email, emailCode);
        await sendSMSOTP(phone, phoneCode);

        return res.json({
          message: 'Usuário pré-cadastrado. Novos códigos de verificação foram enviados.',
          email,
          emailCode, // returned for dev ease
          phoneCode, // returned for dev ease
        });
      } else {
        return res.status(400).json({ error: 'E-mail ou Telefone já cadastrado' });
      }
    }

    // Generate verification codes
    const emailCode = generateOTP();
    const phoneCode = generateOTP();

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      password, // hashed by mongoose hook
      emailVerificationCode: emailCode,
      phoneVerificationCode: phoneCode,
      emailVerified: false,
      phoneVerified: false
    });

    await newUser.save();

    // Send OTPs via configured production channels (or falls back to simulator logs)
    await sendEmailOTP(email, emailCode);
    await sendSMSOTP(phone, phoneCode);

    return res.status(201).json({
      message: 'Cadastro inicial realizado com sucesso. Códigos de verificação enviados.',
      email,
      emailCode, // returned for dev ease
      phoneCode, // returned for dev ease
    });
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor no cadastro' });
  }
});

// 2. VERIFY REGISTRATION CODES
router.post('/verify-registration', async (req: any, res: any) => {
  const { email, emailCode, phoneCode } = req.body;

  try {
    if (!email || !emailCode || !phoneCode) {
      return res.status(400).json({ error: 'E-mail e ambos os códigos são necessários' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Check codes
    const isEmailCodeValid = user.emailVerificationCode === emailCode;
    const isPhoneCodeValid = user.phoneVerificationCode === phoneCode;

    if (!isEmailCodeValid || !isPhoneCodeValid) {
      let errors = [];
      if (!isEmailCodeValid) errors.push('Código do E-mail inválido');
      if (!isPhoneCodeValid) errors.push('Código do Telefone inválido');
      return res.status(400).json({ error: errors.join(' e ') });
    }

    // Verify user
    user.emailVerified = true;
    user.phoneVerified = true;
    user.emailVerificationCode = null;
    user.phoneVerificationCode = null;
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json({
      message: 'Cadastro verificado com sucesso!',
      token,
      user: userObj
    });
  } catch (error) {
    console.error('Erro na verificação de cadastro:', error);
    return res.status(500).json({ error: 'Erro interno na verificação de cadastro' });
  }
});

// 3. LOGIN
router.post('/login', async (req: any, res: any) => {
  const { emailOrPhone, password } = req.body;

  try {
    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'E-mail/Telefone e senha são obrigatórios' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'E-mail/Telefone ou senha incorretos' });
    }

    // Match password
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'E-mail/Telefone ou senha incorretos' });
    }

    // Check if registration verification is complete
    if (!user.emailVerified || !user.phoneVerified) {
      // Re-send verification codes if they were never verified
      const emailCode = generateOTP();
      const phoneCode = generateOTP();

      user.emailVerificationCode = emailCode;
      user.phoneVerificationCode = phoneCode;
      await user.save();

      // Send OTPs
      await sendEmailOTP(user.email, emailCode);
      await sendSMSOTP(user.phone, phoneCode);

      return res.status(202).json({
        verificationRequired: true,
        email: user.email,
        emailCode,
        phoneCode,
        message: 'Por favor, verifique seu e-mail e telefone para concluir o cadastro.'
      });
    }

    // Check if 2FA (Two Factor Auth) is enabled
    if (user.twoFactorEnabled) {
      const otpCode = generateOTP();
      const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      user.loginOtpCode = otpCode;
      user.loginOtpExpires = expires;
      await user.save();

      // Send 2FA code via email
      await sendEmailOTP(user.email, otpCode);

      return res.json({
        require2FA: true,
        tempUserId: user._id,
        otpCode, // returned for dev ease
        message: 'Código de autenticação de dois fatores enviado'
      });
    }

    // Direct Login (No 2FA)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json({
      token,
      user: userObj
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no login' });
  }
});

// 4. VERIFY 2FA CODE
router.post('/verify-2fa', async (req: any, res: any) => {
  const { tempUserId, code } = req.body;

  try {
    if (!tempUserId || !code) {
      return res.status(400).json({ error: 'Usuário temporário e código são obrigatórios' });
    }

    const user = await User.findById(tempUserId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!user.loginOtpCode || user.loginOtpCode !== code) {
      return res.status(400).json({ error: 'Código 2FA incorreto' });
    }

    if (user.loginOtpExpires && new Date() > user.loginOtpExpires) {
      return res.status(400).json({ error: 'Código 2FA expirado. Tente logar novamente.' });
    }

    // Code verified, clear it
    user.loginOtpCode = null;
    user.loginOtpExpires = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json({
      token,
      user: userObj
    });
  } catch (error) {
    console.error('Erro na verificação de 2FA:', error);
    return res.status(500).json({ error: 'Erro interno na verificação de 2FA' });
  }
});

// 5. GET CURRENT USER DETAILS
router.get('/me', authMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar perfil' });
  }
});

// 6. UPDATE PROFILE DETAILS
router.put('/update', authMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { name, gender, preferences, language, twoFactorEnabled, isPremium, profileImage } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;
    if (preferences !== undefined) user.preferences = preferences;
    if (language !== undefined) user.language = language;
    if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;
    if (isPremium !== undefined) user.isPremium = isPremium;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json({
      message: 'Perfil atualizado com sucesso!',
      user: userObj
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar perfil' });
  }
});

export default router;
