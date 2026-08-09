import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDisposableEmail } from '../utils/disposableEmails.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { sendEmailOTP } from '../utils/notification.js';

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
    if (!name || !email || !gender || !password) {
      return res.status(400).json({ error: 'Nome, e-mail, gênero e senha são obrigatórios' });
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

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // If the user already exists but is NOT verified yet, update verification code
      if (!existingUser.emailVerified) {
        const emailCode = generateOTP();

        existingUser.name = name;
        existingUser.password = password; // pre-save hook will hash it
        existingUser.gender = gender;
        if (phone) existingUser.phone = phone;
        existingUser.emailVerificationCode = emailCode;
        
        await existingUser.save();

        const emailDelivery = await sendEmailOTP(email, emailCode);

        return res.json({
          message: 'Usuário pré-cadastrado. Novo código de verificação enviado por e-mail.',
          email,
          emailDelivery
        });
      } else {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }
    }

    // Generate verification code
    const emailCode = generateOTP();

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      gender,
      password, // hashed by mongoose hook
      emailVerificationCode: emailCode,
      emailVerified: false,
      phoneVerified: true
    });

    await newUser.save();

    // Send OTP via email
    const emailDelivery = await sendEmailOTP(email, emailCode);

    return res.status(201).json({
      message: 'Cadastro inicial realizado com sucesso. Verifique seu e-mail.',
      email,
      emailDelivery
    });
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor no cadastro' });
  }
});

// 2. VERIFY REGISTRATION CODES
router.post('/verify-registration', async (req: any, res: any) => {
  const { email, emailCode } = req.body;

  try {
    if (!email || !emailCode) {
      return res.status(400).json({ error: 'E-mail e código de verificação são necessários' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Check code
    const isEmailCodeValid = user.emailVerificationCode === emailCode;

    if (!isEmailCodeValid) {
      return res.status(400).json({ error: 'Código de verificação do E-mail inválido ou expirado' });
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
  const { email, emailOrPhone, password } = req.body;
  const inputEmail = (email || emailOrPhone || '').trim().toLowerCase();

  try {
    if (!inputEmail || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    // Find user by email or phone fallback
    const user = await User.findOne({
      $or: [
        { email: inputEmail },
        { phone: inputEmail }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos' });
    }

    // Match password
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos' });
    }

    // Check if registration verification is complete
    if (!user.emailVerified) {
      const emailCode = generateOTP();

      user.emailVerificationCode = emailCode;
      await user.save();

      // Send OTP
      const emailDelivery = await sendEmailOTP(user.email, emailCode);

      return res.status(202).json({
        verificationRequired: true,
        email: user.email,
        message: 'Por favor, verifique seu e-mail para concluir o cadastro.',
        emailDelivery
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
      const emailDelivery = await sendEmailOTP(user.email, otpCode);

      return res.json({
        require2FA: true,
        tempUserId: user._id,
        message: 'Código de autenticação de dois fatores enviado',
        emailDelivery
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
      return res.status(400).json({ error: 'Código 2FA expirado. Solicite um novo código.' });
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
  const { name, gender, preferences, language, twoFactorEnabled, profileImage } = req.body;

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

// 7. RESEND 2FA CODE
router.post('/resend-2fa', async (req: any, res: any) => {
  const { tempUserId } = req.body;

  try {
    if (!tempUserId) {
      return res.status(400).json({ error: 'Usuário temporário é obrigatório' });
    }

    const user = await User.findById(tempUserId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const otpCode = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.loginOtpCode = otpCode;
    user.loginOtpExpires = expires;
    await user.save();

    const emailDelivery = await sendEmailOTP(user.email, otpCode);

    return res.json({
      message: 'Novo código de autenticação de dois fatores enviado com sucesso.',
      emailDelivery
    });
  } catch (error) {
    console.error('Erro ao reenviar código 2FA:', error);
    return res.status(500).json({ error: 'Erro interno ao reenviar código 2FA' });
  }
});

// 8. RESEND REGISTRATION VERIFICATION CODES
router.post('/resend-verification', async (req: any, res: any) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Este usuário já está com o cadastro verificado' });
    }

    const emailCode = generateOTP();

    user.emailVerificationCode = emailCode;
    await user.save();

    const emailDelivery = await sendEmailOTP(user.email, emailCode);

    return res.json({
      message: 'Novo código de verificação enviado por e-mail com sucesso.',
      emailDelivery
    });
  } catch (error) {
    console.error('Erro ao reenviar códigos de verificação:', error);
    return res.status(500).json({ error: 'Erro interno ao reenviar códigos' });
  }
});

export default router;
