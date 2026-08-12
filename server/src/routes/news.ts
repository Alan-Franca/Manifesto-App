import { Router, Response } from 'express';
import { News } from '../models/News.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';
import { parseNewsDate } from '../utils/dateParser.js';

const router = Router();

// 1. GET ALL NEWS
router.get('/', async (_req: any, res: any) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });

    // Sort by publication date (newest first), falling back to createdAt
    news.sort((a: any, b: any) => {
      const timeA = parseNewsDate(a.date);
      const timeB = parseNewsDate(b.date);
      if (timeB !== timeA) {
        return timeB - timeA; // Newest date first
      }
      const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return createdB - createdA;
    });

    return res.json(news);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar notícias' });
  }
});

// 2. GET SINGLE NEWS BY ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    return res.json(newsItem);
  } catch (error) {
    console.error('Erro ao buscar notícia individual:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar notícia' });
  }
});

// 3. CREATE NEWS (Admin only)
router.post('/', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { title, summary, content, category, image, readTime, date } = req.body;

  try {
    if (!title || !summary || !category || !date) {
      return res.status(400).json({ error: 'Título, resumo, categoria e data são obrigatórios.' });
    }

    const newsItem = new News({
      title,
      summary,
      content: content || '',
      category,
      image: image || '',
      readTime: readTime || '5 min',
      date,
    });

    await newsItem.save();
    return res.status(201).json(newsItem);
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao criar notícia' });
  }
});

// 4. UPDATE NEWS (Admin only)
router.put('/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { title, summary, content, category, image, readTime, date } = req.body;
  const { id } = req.params;

  try {
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    if (title !== undefined) newsItem.title = title;
    if (summary !== undefined) newsItem.summary = summary;
    if (content !== undefined) newsItem.content = content;
    if (category !== undefined) newsItem.category = category;
    if (image !== undefined) newsItem.image = image;
    if (readTime !== undefined) newsItem.readTime = readTime;
    if (date !== undefined) newsItem.date = date;

    await newsItem.save();
    return res.json(newsItem);
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar notícia' });
  }
});

// 4. DELETE NEWS (Admin only)
router.delete('/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const newsItem = await News.findByIdAndDelete(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    return res.json({ message: 'Notícia excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir notícia' });
  }
});

export default router;
