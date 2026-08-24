import { Router, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { News } from '../models/News.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';
import { parseNewsDate } from '../utils/dateParser.js';

const router = Router();
const LIST_PROJECTION = 'title summary category image readTime date publishedAt createdAt';

function parseLimit(value: unknown, fallback = 20, maximum = 50) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), maximum) : fallback;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function encodeCursor(item: any) {
  const date = new Date(item.publishedAt || item.createdAt).toISOString();
  return Buffer.from(`${date}|${item._id.toString()}`).toString('base64url');
}

function decodeCursor(value: unknown) {
  if (!value) return null;
  try {
    const [dateValue, idValue] = Buffer.from(String(value), 'base64url').toString().split('|');
    const publishedAt = new Date(dateValue);
    if (Number.isNaN(publishedAt.getTime()) || !Types.ObjectId.isValid(idValue)) return null;
    return { publishedAt, id: new Types.ObjectId(idValue) };
  } catch {
    return null;
  }
}

router.get('/', async (req: any, res: any) => {
  try {
    const limit = parseLimit(req.query.limit);
    const filter: FilterQuery<any> = {};
    const categories = String(req.query.categories || req.query.category || '')
      .split(',').map(category => category.trim()).filter(Boolean);
    const search = String(req.query.q || '').trim();
    const cursor = decodeCursor(req.query.cursor);

    if (categories.length === 1) filter.category = categories[0];
    if (categories.length > 1) filter.category = { $in: categories };
    if (req.query.cursor && !cursor) return res.status(400).json({ error: 'Cursor de paginação inválido' });
    if (cursor) {
      filter.$or = [
        { publishedAt: { $lt: cursor.publishedAt } },
        { publishedAt: cursor.publishedAt, _id: { $lt: cursor.id } },
      ];
    }

    const findNews = (queryFilter: FilterQuery<any>) => News.find(queryFilter)
      .select(LIST_PROJECTION)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    let matchedBy: 'title' | 'summary' | null = null;
    let results;
    if (search) {
      const expression = new RegExp(escapeRegExp(search), 'i');
      results = await findNews({ ...filter, title: expression });
      matchedBy = 'title';

      if (results.length === 0) {
        results = await findNews({ ...filter, summary: expression });
        matchedBy = 'summary';
      }
    } else {
      results = await findNews(filter);
    }
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return res.json({
      items,
      pageInfo: {
        hasMore,
        nextCursor: hasMore && items.length ? encodeCursor(items[items.length - 1]) : null,
      },
      search: search ? { query: search, matchedBy } : null,
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar notícias' });
  }
});

router.get('/:id/related', async (req: any, res: any) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID de notícia inválido' });
    const article = await News.findById(req.params.id).select('category').lean();
    if (!article) return res.status(404).json({ error: 'Notícia não encontrada' });
    const items = await News.find({ _id: { $ne: article._id }, category: article.category })
      .select(LIST_PROJECTION)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(parseLimit(req.query.limit, 3, 6))
      .lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json({ items });
  } catch (error) {
    console.error('Erro ao buscar notícias relacionadas:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar notícias relacionadas' });
  }
});

router.get('/:id', async (req: any, res: any) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID de notícia inválido' });
    const newsItem = await News.findById(req.params.id).lean();
    if (!newsItem) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(newsItem);
  } catch (error) {
    console.error('Erro ao buscar notícia individual:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar notícia' });
  }
});

router.post('/', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { title, summary, content, category, image, readTime, date } = req.body;
  try {
    if (!title || !summary || !category || !date) {
      return res.status(400).json({ error: 'Título, resumo, categoria e data são obrigatórios.' });
    }
    const timestamp = parseNewsDate(date);
    if (!timestamp) return res.status(400).json({ error: 'Data de publicação inválida.' });
    const newsItem = await News.create({
      title, summary, content: content || '', category, image: image || '',
      readTime: readTime || '5 min', date, publishedAt: new Date(timestamp),
    });
    return res.status(201).json(newsItem);
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao criar notícia' });
  }
});

router.put('/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { title, summary, content, category, image, readTime, date } = req.body;
  try {
    if (!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID de notícia inválido' });
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries({ title, summary, content, category, image, readTime, date })) {
      if (value !== undefined) updates[key] = value;
    }
    if (date !== undefined) {
      const timestamp = parseNewsDate(date);
      if (!timestamp) return res.status(400).json({ error: 'Data de publicação inválida.' });
      updates.publishedAt = new Date(timestamp);
    }
    const newsItem = await News.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    if (!newsItem) return res.status(404).json({ error: 'Notícia não encontrada' });
    return res.json(newsItem);
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar notícia' });
  }
});

router.delete('/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID de notícia inválido' });
    const newsItem = await News.findByIdAndDelete(req.params.id).select('_id').lean();
    if (!newsItem) return res.status(404).json({ error: 'Notícia não encontrada' });
    return res.json({ message: 'Notícia excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir notícia:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir notícia' });
  }
});

export default router;
