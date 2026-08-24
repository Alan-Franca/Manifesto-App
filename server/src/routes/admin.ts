import { Router, Response } from 'express';
import { User } from '../models/User.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 1. GET ALL USERS (Admin only)
router.get('/users', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(String(req.query.limit || '25'), 10) || 25, 1), 100);
    const page = Math.max(Number.parseInt(String(req.query.page || '1'), 10) || 1, 1);
    const search = String(req.query.q || '').trim();
    const filter = search
      ? { $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ] }
      : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name email phone profileImage role emailVerified createdAt')
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);
    return res.json({ items: users, pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar usuários' });
  }
});

// 2. UPDATE USER DETAILS/ROLE (Admin only)
router.put('/users/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const { role, name, email, phone } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Do not allow the last admin to remove their own admin role or delete themselves
    if (user._id.toString() === req.userId && role === 'user') {
      return res.status(400).json({ error: 'Você não pode remover seu próprio privilégio de administrador' });
    }

    if (role !== undefined) user.role = role;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json(userObj);
  } catch (error) {
    console.error('Erro ao atualizar usuário pelo administrador:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
  }
});

// 3. DELETE USER (Admin only)
router.delete('/users/:id', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    if (id === req.userId) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta de administrador' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário pelo administrador:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir usuário' });
  }
});

export default router;
