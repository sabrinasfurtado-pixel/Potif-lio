import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import {
  requireAuth,
  AuthenticatedRequest,
  comparePassword,
  hashPassword,
  generateToken,
  checkLoginRateLimit,
  recordLoginAttempt
} from '../auth.js';

export const adminRouter = Router();

// Configure persistent image upload storage
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Utilize JPG, PNG, WebP ou SVG.'));
    }
  }
});

// ----------------------------------------------------
// Public Admin Route: Login
// ----------------------------------------------------
adminRouter.post('/login', (req, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { allowed, waitSeconds } = checkLoginRateLimit(ip);

  if (!allowed) {
    res.status(429).json({
      error: `Muitas tentativas incorretas. Acesso temporariamente bloqueado por segurança. Tente novamente em ${Math.ceil((waitSeconds || 60) / 60)} minutos.`
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    return;
  }

  const admin = db.prepare('SELECT * FROM administrators WHERE email = ?').get(email.trim().toLowerCase()) as {
    id: number;
    email: string;
    password_hash: string;
    name: string;
  } | undefined;

  if (!admin || !comparePassword(password, admin.password_hash)) {
    recordLoginAttempt(ip, false);
    res.status(401).json({ error: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    return;
  }

  recordLoginAttempt(ip, true);

  const token = generateToken({
    id: admin.id,
    email: admin.email,
    name: admin.name
  });

  res.json({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name
    }
  });
});

// ALL SUBSEQUENT ROUTES REQUIRE ADMIN AUTHENTICATION
adminRouter.use(requireAuth);

// ----------------------------------------------------
// Auth Check / Me
// ----------------------------------------------------
adminRouter.get('/me', (req: AuthenticatedRequest, res: Response) => {
  res.json({ admin: req.admin });
});

// Change Password
adminRouter.post('/change-password', (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'A nova senha deve ter no mínimo 8 caracteres.' });
    return;
  }

  const admin = db.prepare('SELECT * FROM administrators WHERE id = ?').get(req.admin!.id) as {
    password_hash: string;
  };

  if (!comparePassword(currentPassword, admin.password_hash)) {
    res.status(400).json({ error: 'Senha atual incorreta.' });
    return;
  }

  const newHash = hashPassword(newPassword);
  db.prepare('UPDATE administrators SET password_hash = ?, updated_at = datetime("now") WHERE id = ?').run(
    newHash,
    req.admin!.id
  );

  res.json({ success: true, message: 'Senha atualizada com sucesso.' });
});

// ----------------------------------------------------
// Dashboard Stats
// ----------------------------------------------------
adminRouter.get('/stats', (_req: AuthenticatedRequest, res: Response) => {
  const totalProjects = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  const publishedProjects = (db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'published'").get() as { count: number }).count;
  const draftProjects = (db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'draft'").get() as { count: number }).count;
  const totalSkills = (db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number }).count;
  const totalExperiences = (db.prepare('SELECT COUNT(*) as count FROM experiences').get() as { count: number }).count;
  const unreadMessages = (db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get() as { count: number }).count;

  res.json({
    totalProjects,
    publishedProjects,
    draftProjects,
    totalSkills,
    totalExperiences,
    unreadMessages
  });
});

// ----------------------------------------------------
// Profile Settings
// ----------------------------------------------------
adminRouter.get('/profile', (_req: AuthenticatedRequest, res: Response) => {
  const profile = db.prepare('SELECT * FROM portfolio_profile WHERE id = 1').get();
  res.json({ profile });
});

adminRouter.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  const {
    full_name,
    professional_title,
    hero_intro,
    about_markdown,
    avatar_url,
    email,
    linkedin_url,
    github_url,
    location,
    footer_text
  } = req.body;

  if (!full_name || !professional_title || !hero_intro) {
    res.status(400).json({ error: 'Nome, título profissional e texto de apresentação são obrigatórios.' });
    return;
  }

  db.prepare(`
    UPDATE portfolio_profile
    SET full_name = ?,
        professional_title = ?,
        hero_intro = ?,
        about_markdown = ?,
        avatar_url = ?,
        email = ?,
        linkedin_url = ?,
        github_url = ?,
        location = ?,
        footer_text = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `).run(
    full_name,
    professional_title,
    hero_intro,
    about_markdown || '',
    avatar_url || '',
    email || '',
    linkedin_url || '',
    github_url || '',
    location || '',
    footer_text || ''
  );

  const updated = db.prepare('SELECT * FROM portfolio_profile WHERE id = 1').get();
  res.json({ success: true, profile: updated });
});

// ----------------------------------------------------
// Image Upload Endpoint
// ----------------------------------------------------
adminRouter.post('/upload', upload.single('image'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    return;
  }

  const relativeUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: relativeUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// ----------------------------------------------------
// Projects Management (CRUD)
// ----------------------------------------------------
adminRouter.get('/projects', (_req: AuthenticatedRequest, res: Response) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();
  res.json({ projects });
});

adminRouter.post('/projects', (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    slug,
    summary,
    full_description,
    category,
    technologies,
    public_url,
    repo_url,
    image_url,
    image_alt,
    is_featured,
    status,
    sort_order
  } = req.body;

  if (!title || !summary || !category) {
    res.status(400).json({ error: 'Título, resumo e categoria são obrigatórios.' });
    return;
  }

  // Generate or sanitize slug
  let generatedSlug = (slug || title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check unique slug
  const existing = db.prepare('SELECT id FROM projects WHERE slug = ?').get(generatedSlug);
  if (existing) {
    generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
  }

  const stmt = db.prepare(`
    INSERT INTO projects (
      slug, title, summary, full_description, category, technologies,
      public_url, repo_url, image_url, image_alt, is_featured, status, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    generatedSlug,
    title.trim(),
    summary.trim(),
    (full_description || '').trim(),
    category.trim(),
    (technologies || '').trim(),
    (public_url || '').trim(),
    (repo_url || '').trim(),
    (image_url || '').trim(),
    (image_alt || title).trim(),
    is_featured ? 1 : 0,
    status === 'draft' ? 'draft' : 'published',
    Number(sort_order) || 0
  );

  const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, project: created });
});

adminRouter.put('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const {
    title,
    slug,
    summary,
    full_description,
    category,
    technologies,
    public_url,
    repo_url,
    image_url,
    image_alt,
    is_featured,
    status,
    sort_order
  } = req.body;

  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Projeto não encontrado.' });
    return;
  }

  let finalSlug = slug ? slug.toLowerCase().trim() : (existing as { slug: string }).slug;
  const slugCheck = db.prepare('SELECT id FROM projects WHERE slug = ? AND id != ?').get(finalSlug, id);
  if (slugCheck) {
    finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
  }

  db.prepare(`
    UPDATE projects
    SET slug = ?,
        title = ?,
        summary = ?,
        full_description = ?,
        category = ?,
        technologies = ?,
        public_url = ?,
        repo_url = ?,
        image_url = ?,
        image_alt = ?,
        is_featured = ?,
        status = ?,
        sort_order = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(
    finalSlug,
    title,
    summary,
    full_description || '',
    category,
    technologies || '',
    public_url || '',
    repo_url || '',
    image_url || '',
    image_alt || '',
    is_featured ? 1 : 0,
    status === 'draft' ? 'draft' : 'published',
    Number(sort_order) || 0,
    id
  );

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  res.json({ success: true, project: updated });
});

adminRouter.patch('/projects/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (status !== 'published' && status !== 'draft') {
    res.status(400).json({ error: 'Status deve ser "published" ou "draft".' });
    return;
  }

  const result = db.prepare('UPDATE projects SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Projeto não encontrado.' });
    return;
  }

  res.json({ success: true, status });
});

adminRouter.delete('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Projeto não encontrado.' });
    return;
  }

  res.json({ success: true, message: 'Projeto excluído com sucesso.' });
});

// ----------------------------------------------------
// Skill Categories and Skills Management
// ----------------------------------------------------
adminRouter.get('/skills-data', (_req: AuthenticatedRequest, res: Response) => {
  const categories = db.prepare('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC').all();
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all();
  res.json({ categories, skills });
});

adminRouter.post('/categories', (req: AuthenticatedRequest, res: Response) => {
  const { name, sort_order } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    return;
  }

  try {
    const result = db.prepare('INSERT INTO skill_categories (name, sort_order) VALUES (?, ?)').run(
      name.trim(),
      Number(sort_order) || 0
    );
    const created = db.prepare('SELECT * FROM skill_categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, category: created });
  } catch {
    res.status(400).json({ error: 'Já existe uma categoria com este nome.' });
  }
});

adminRouter.put('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const { name, sort_order } = req.body;

  db.prepare('UPDATE skill_categories SET name = ?, sort_order = ? WHERE id = ?').run(
    name.trim(),
    Number(sort_order) || 0,
    id
  );
  const updated = db.prepare('SELECT * FROM skill_categories WHERE id = ?').get(id);
  res.json({ success: true, category: updated });
});

adminRouter.delete('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM skill_categories WHERE id = ?').run(id);
  res.json({ success: true, message: 'Categoria excluída com sucesso.' });
});

adminRouter.post('/skills', (req: AuthenticatedRequest, res: Response) => {
  const { category_id, name, sort_order } = req.body;
  if (!category_id || !name) {
    res.status(400).json({ error: 'Categoria e nome da habilidade são obrigatórios.' });
    return;
  }

  const result = db.prepare('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)').run(
    Number(category_id),
    name.trim(),
    Number(sort_order) || 0
  );
  const created = db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, skill: created });
});

adminRouter.put('/skills/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const { category_id, name, sort_order } = req.body;

  db.prepare('UPDATE skills SET category_id = ?, name = ?, sort_order = ? WHERE id = ?').run(
    Number(category_id),
    name.trim(),
    Number(sort_order) || 0,
    id
  );
  const updated = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
  res.json({ success: true, skill: updated });
});

adminRouter.delete('/skills/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM skills WHERE id = ?').run(id);
  res.json({ success: true, message: 'Habilidade removida com sucesso.' });
});

// ----------------------------------------------------
// Experiences Management
// ----------------------------------------------------
adminRouter.get('/experiences', (_req: AuthenticatedRequest, res: Response) => {
  const experiences = db.prepare('SELECT * FROM experiences ORDER BY is_current DESC, sort_order ASC, id ASC').all();
  res.json({ experiences });
});

adminRouter.post('/experiences', (req: AuthenticatedRequest, res: Response) => {
  const {
    company,
    role,
    start_date,
    end_date,
    is_current,
    work_mode,
    description,
    technologies,
    highlights,
    sort_order
  } = req.body;

  if (!company || !role || !description) {
    res.status(400).json({ error: 'Empresa, cargo e descrição são obrigatórios.' });
    return;
  }

  const result = db.prepare(`
    INSERT INTO experiences (
      company, role, start_date, end_date, is_current, work_mode, description, technologies, highlights, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    company.trim(),
    role.trim(),
    (start_date || 'Atual').trim(),
    is_current ? null : (end_date || null),
    is_current ? 1 : 0,
    (work_mode || 'Híbrido').trim(),
    description.trim(),
    (technologies || '').trim(),
    (highlights || '').trim(),
    Number(sort_order) || 0
  );

  const created = db.prepare('SELECT * FROM experiences WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, experience: created });
});

adminRouter.put('/experiences/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const {
    company,
    role,
    start_date,
    end_date,
    is_current,
    work_mode,
    description,
    technologies,
    highlights,
    sort_order
  } = req.body;

  db.prepare(`
    UPDATE experiences
    SET company = ?,
        role = ?,
        start_date = ?,
        end_date = ?,
        is_current = ?,
        work_mode = ?,
        description = ?,
        technologies = ?,
        highlights = ?,
        sort_order = ?
    WHERE id = ?
  `).run(
    company.trim(),
    role.trim(),
    start_date,
    is_current ? null : end_date,
    is_current ? 1 : 0,
    work_mode,
    description.trim(),
    technologies || '',
    highlights || '',
    Number(sort_order) || 0,
    id
  );

  const updated = db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
  res.json({ success: true, experience: updated });
});

adminRouter.delete('/experiences/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
  res.json({ success: true, message: 'Experiência removida com sucesso.' });
});

// ----------------------------------------------------
// Contact Messages Management
// ----------------------------------------------------
adminRouter.get('/messages', (_req: AuthenticatedRequest, res: Response) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json({ messages });
});

adminRouter.patch('/messages/:id/read', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const { is_read } = req.body;
  db.prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?').run(is_read ? 1 : 0, id);
  res.json({ success: true });
});

adminRouter.delete('/messages/:id', (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  res.json({ success: true, message: 'Mensagem excluída com sucesso.' });
});
