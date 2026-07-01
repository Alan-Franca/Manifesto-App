import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { News } from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jornal_manifesto';

const defaultNews = [
  {
    title: 'Nova tecnologia promete revolucionar a indústria automotiva',
    summary: 'Pesquisadores desenvolvem bateria que pode durar até 1000km com uma única carga, marcando um avanço significativo para veículos elétricos.',
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    readTime: '5 min',
    date: '08 Jun 2026',
    isPremium: false
  },
  {
    title: 'Mercado financeiro registra alta histórica',
    summary: 'Bolsa de valores atinge novo recorde impulsionada por resultados positivos do setor tecnológico e previsões otimistas para o próximo trimestre.',
    category: 'Economia',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    readTime: '4 min',
    date: '08 Jun 2026',
    isPremium: false
  },
  {
    title: 'Campeonato nacional: clássico decide líder',
    summary: 'Grande final acontece neste domingo e promete emocionar torcedores de todo o país. Expectativa de público recorde nos estádios.',
    category: 'Esportes',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    readTime: '3 min',
    date: '08 Jun 2026',
    isPremium: false
  },
  {
    title: 'Semana de moda: tendências para o próximo ano',
    summary: 'Designers apresentam coleções que misturam sustentabilidade com estilo, definindo as principais tendências da próxima estação.',
    category: 'Moda',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f7de6?w=800',
    readTime: '6 min',
    date: '07 Jun 2026',
    isPremium: true
  },
  {
    title: 'Descoberta científica pode mudar medicina',
    summary: 'Novo tratamento experimental mostra resultados promissores em testes clínicos, abrindo caminho para novas terapias.',
    category: 'Ciência',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    readTime: '7 min',
    date: '07 Jun 2026',
    isPremium: false
  },
  {
    title: 'Educação digital: o futuro do aprendizado',
    summary: 'Plataformas de ensino online ganham espaço e transformam a forma como estudantes e professores interagem no ambiente educacional.',
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    readTime: '5 min',
    date: '07 Jun 2026',
    isPremium: false
  }
];

async function seedDatabase() {
  try {
    // 1. Seed default admin user
    const adminEmail = 'admin@manifesto.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin Manifesto',
        email: adminEmail,
        phone: '11999999999',
        gender: 'Outro',
        password: 'Manifesto@Admin#2026!',
        role: 'admin',
        isPremium: true,
        emailVerified: true,
        phoneVerified: true
      });
      await adminUser.save();
      console.log('=== Admin padrão criado com sucesso ===');
      console.log('E-mail: admin@manifesto.com');
      console.log('Senha: Manifesto@Admin#2026!');
    } else {
      // Garantir que a role é admin caso já exista
      if ((existingAdmin as any).role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('=== Usuário admin atualizado para role admin ===');
      }
    }

    // 2. Seed default news
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany(defaultNews);
      console.log('=== Notícias padrão importadas com sucesso ===');
    }
  } catch (error) {
    console.error('Erro ao semear o banco de dados:', error);
  }
}

export async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('=== MongoDB conectado com sucesso ===');
    await seedDatabase();
  } catch (error) {
    console.error('Erro de conexão com o MongoDB:', error);
    process.exit(1);
  }
}
