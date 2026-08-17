import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      default: '',
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      required: false,
      default: 'prefiro-nao-dizer',
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    preferences: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: 'pt-BR',
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Controle de verificação de cadastro
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: null,
    },
    phoneVerificationCode: {
      type: String,
      default: null,
    },
    // Controle de login (2FA)
    loginOtpCode: {
      type: String,
      default: null,
    },
    loginOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (this: any, next: any) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

export const User = model('User', UserSchema);
