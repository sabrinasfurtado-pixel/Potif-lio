import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const publicRouter = Router();

// Rate limiter for contact messages (IP-based, max 5 per hour)
const contactLimiter = new Map<string, { count: number; resetAt: number }>();

publicRouter.get('/portfolio', (_req: Request, res: Response) => {
  try {
    const profile = db.prepare('SELECT * FROM portfolio_profile WHERE id = 1').get();

    const categories = db.prepare('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC').all() as Array<{ id: number; name: string; sort_order: number }>;
    const allSkills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all() as Array<{ id: number; category_id: number; name: string; sort_order: number }>;

    const categorizedSkills = categories.map(cat => ({
      ...cat,
      skills: allSkills.filter(s => s.category_id === cat.id)
    }));

    const experiences = db.prepare('SELECT * FROM experiences ORDER BY is_current DESC, sort_order ASC, id ASC').all();

    // STRICT: Only published projects are returned on public routes
    const projects = db.prepare(`
      SELECT id, slug, title, summary, full_description, category, technologies,
             public_url, repo_url, image_url, image_alt, is_featured, sort_order, created_at
      FROM projects
      WHERE status = 'published'
      ORDER BY is_featured DESC, sort_order ASC, id ASC
    `).all();

    res.json({
      profile,
      skills: categorizedSkills,
      experiences,
      projects
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ error: 'Erro ao carregar dados do portfólio.' });
  }
});

publicRouter.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Bot honeypot detection
    if (honeypot) {
      res.status(200).json({ success: true, message: 'Mensagem recebida.' });
      return;
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Por favor, forneça um nome válido.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Por favor, forneça um endereço de e-mail válido.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      res.status(400).json({ error: 'A mensagem deve ter pelo menos 10 caracteres.' });
      return;
    }

    // Rate limiting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientLimit = contactLimiter.get(ip);

    if (clientLimit && clientLimit.resetAt > now) {
      if (clientLimit.count >= 5) {
        res.status(429).json({ error: 'Muitas mensagens enviadas recentemente. Por favor, aguarde antes de enviar novamente.' });
        return;
      }
      clientLimit.count += 1;
    } else {
      contactLimiter.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    }

    // Sanitize and save
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message, ip)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      name.trim().slice(0, 100),
      email.trim().slice(0, 150),
      (subject || 'Contato via Portfólio').trim().slice(0, 150),
      message.trim().slice(0, 2000),
      ip
    );

    res.status(201).json({
      success: true,
      message: 'Sua mensagem foi enviada com sucesso! Entrarei em contato em breve.'
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Não foi possível enviar sua mensagem no momento.' });
  }
});
