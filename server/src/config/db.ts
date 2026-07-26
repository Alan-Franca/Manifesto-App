import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { News } from '../models/News.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jornal_manifesto';

const defaultNews = [
  {
    title: 'Inteligência Artificial no Cotidiano: O impacto dos agentes autônomos',
    summary: 'Como a nova geração de assistentes de IA está saindo das tarefas simples de digitação para tomar decisões autônomas no nosso dia a dia, redefinindo nossa privacidade e relação com a internet.',
    category: '🧠 TECNOLOGIA',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
    readTime: '5 min',
    date: '29 Jun 2026'
  },
  {
    title: 'burnout digital e produtividade: a carreira da Geração Z',
    summary: 'A busca por produtividade constante nas redes está gerando um esgotamento precoce nos jovens profissionais. Analisamos se a faculdade tradicional ainda faz sentido no mercado atual.',
    category: '💼 TRABALHO E FUTURO',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    readTime: '6 min',
    date: '29 Jun 2026'
  },
  {
    title: 'O Retorno dos Vinis e a Busca pela Música Física na Era do Streaming',
    summary: 'Por que a Geração Z está adotando mídias analógicas e criando novos rituais de consumo cultural em oposição ao consumo efêmero dos algoritmos de recomendação.',
    category: '🎭 CULTURA',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7a4c3?w=800',
    readTime: '4 min',
    date: '28 Jun 2026'
  },
  {
    title: 'O que é Quiet Quitting? Entenda o movimento que desafia o mercado',
    summary: 'Muito além de "fazer o mínimo", o quiet quitting é um manifesto silencioso que estabelece limites saudáveis contra a cultura do burnout digital e da exploração.',
    category: '💡 EXPLICAÇÕES',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800',
    readTime: '5 min',
    date: '28 Jun 2026'
  },
  {
    title: 'Ansiedade Digital: Como os feeds infinitos alteram o comportamento humano',
    summary: 'Um estudo aprofundado sobre o impacto da rolagem infinita no cérebro, a dopamina rápida e como a nossa saúde mental está sendo moldada pelas redes sociais.',
    category: '🌍 SOCIEDADE',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800',
    readTime: '7 min',
    date: '27 Jun 2026'
  },
  {
    title: 'O que você perdeu nesta segunda: As principais notícias do mundo explicadas',
    summary: 'Um resumo leve e simplificado sobre as decisões de economia global, a política internacional e os fatos mais relevantes que impactam a sua semana.',
    category: '📰 NOTÍCIAS',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a6565d?w=800',
    readTime: '3 min',
    date: '29 Jun 2026'
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

    // 2. Seed default news (clean old categories news first)
    const oldCategories = ['Esportes', 'Ciência', 'Moda', 'Economia', 'Política', 'Educação', 'Tecnologia', 'Cultura', 'Entretenimento', 'Saúde'];
    const hasOldCategories = await News.findOne({ category: { $in: oldCategories } });
    if (hasOldCategories) {
      console.log('=== Removendo notícias antigas para atualização de editorias ===');
      await News.deleteMany({ category: { $in: oldCategories } });
    }

    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany(defaultNews);
      console.log('=== Notícias padrão importadas com sucesso ===');
    }
  } catch (error) {
    console.error('Erro ao semear o banco de dados:', error);
  }
}

let isConnected = false;

export async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('=== MongoDB conectado com sucesso ===');
    await News.syncIndexes();
    await seedDatabase();
  } catch (error) {
    console.error('Erro de conexão com o MongoDB:', error);
    throw error;
  }
}
