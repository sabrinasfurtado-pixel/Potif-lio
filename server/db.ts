import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'portfolio.db');
export const db = new Database(DB_PATH);

// Enable WAL mode for high performance and durability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Administrators
  db.exec(`
    CREATE TABLE IF NOT EXISTS administrators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 2. Portfolio Profile (Single row configuration)
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_name TEXT NOT NULL,
      professional_title TEXT NOT NULL,
      hero_intro TEXT NOT NULL,
      about_markdown TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      email TEXT NOT NULL,
      linkedin_url TEXT DEFAULT '',
      github_url TEXT DEFAULT '',
      location TEXT DEFAULT '',
      footer_text TEXT DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 3. Skill Categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS skill_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 4. Skills
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 5. Professional Experiences
  db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER NOT NULL DEFAULT 0,
      work_mode TEXT NOT NULL DEFAULT 'Híbrido',
      description TEXT NOT NULL,
      technologies TEXT NOT NULL DEFAULT '',
      highlights TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 6. Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      full_description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      technologies TEXT NOT NULL DEFAULT '',
      public_url TEXT DEFAULT '',
      repo_url TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      image_alt TEXT DEFAULT '',
      is_featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 7. Contact Messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT '',
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      ip TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if admin exists; if not, create initial admin
  const adminCount = (db.prepare('SELECT COUNT(*) as count FROM administrators').get() as { count: number }).count;
  if (adminCount === 0) {
    // Default admin for Sabrina Furtado
    // Password can be set via env var ADMIN_INITIAL_PASSWORD or defaults to SabrinaPortfolio2026!
    const adminEmail = process.env.ADMIN_EMAIL || 'sabrina.s.furtado@gmail.com';
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'Sabrina2026!';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(initialPass, salt);

    db.prepare(`
      INSERT INTO administrators (email, password_hash, name)
      VALUES (?, ?, ?)
    `).run(adminEmail, hash, 'Sabrina Furtado');
  }

  // Check if profile exists
  const profile = db.prepare('SELECT * FROM portfolio_profile WHERE id = 1').get();
  if (!profile) {
    const aboutText = `Sou profissional de tecnologia, com experiência em automação de processos e vivência em desenvolvimento de software. Ao longo da minha trajetória, tive contato com tecnologias como C#, Java e React, além de ferramentas de RPA.

Também utilizo ferramentas de inteligência artificial para apoiar o desenvolvimento de projetos, explorar soluções e facilitar a resolução de problemas. Gosto de aprender na prática, experimentar novas tecnologias e transformar ideias em projetos.

Estou em constante aprendizado, buscando ampliar meus conhecimentos, desenvolver minhas habilidades e construir minha trajetória na área de tecnologia.`;

    db.prepare(`
      INSERT INTO portfolio_profile (id, full_name, professional_title, hero_intro, about_markdown, avatar_url, email, linkedin_url, github_url, location, footer_text)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Sabrina Furtado',
      'Desenvolvedora de Soluções Tecnológicas',
      'Olá, eu sou a Sabrina! Atuo com tecnologia, desenvolvimento de software, automação de processos e melhoria contínua. Gosto de transformar problemas em soluções práticas, combinando pensamento analítico, desenvolvimento de sistemas e aprendizado constante.',
      aboutText,
      '',
      'sabrina.s.furtado@gmail.com',
      'https://www.linkedin.com/in/sabrina-dos-santos-furtado-67374a185/',
      'https://github.com/sabrinasfurtado-pixel',
      'São Paulo, SP - Brasil',
      'Projetado e desenvolvido com foco em desempenho, segurança e engenharia de software de ponta.'
    );
  } else {
    const aboutText = `Sou profissional de tecnologia, com experiência em automação de processos e vivência em desenvolvimento de software. Ao longo da minha trajetória, tive contato com tecnologias como C#, Java e React, além de ferramentas de RPA.

Também utilizo ferramentas de inteligência artificial para apoiar o desenvolvimento de projetos, explorar soluções e facilitar a resolução de problemas. Gosto de aprender na prática, experimentar novas tecnologias e transformar ideias em projetos.

Estou em constante aprendizado, buscando ampliar meus conhecimentos, desenvolver minhas habilidades e construir minha trajetória na área de tecnologia.`;

    // Ensure existing database record is updated with real URLs and about text
    db.prepare(`
      UPDATE portfolio_profile
      SET about_markdown = ?,
          linkedin_url = 'https://www.linkedin.com/in/sabrina-dos-santos-furtado-67374a185/',
          github_url = 'https://github.com/sabrinasfurtado-pixel'
      WHERE id = 1
    `).run(aboutText);
  }

  // Seed skill categories and skills if empty
  const catCount = (db.prepare('SELECT COUNT(*) as count FROM skill_categories').get() as { count: number }).count;
  if (catCount === 0) {
    const insertCat = db.prepare('INSERT INTO skill_categories (name, sort_order) VALUES (?, ?)');
    const insertSkill = db.prepare('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)');

    const dev = insertCat.run('DESENVOLVIMENTO', 1);
    const devId = dev.lastInsertRowid;
    const devSkills = ['C#', '.NET', 'APIs REST', 'Entity Framework', 'Bancos de dados', 'SQL'];
    devSkills.forEach((s, idx) => insertSkill.run(devId, s, idx + 1));

    const auto = insertCat.run('AUTOMAÇÃO', 2);
    const autoId = auto.lastInsertRowid;
    const autoSkills = ['RPA', 'Blue Prism', 'Power Automate'];
    autoSkills.forEach((s, idx) => insertSkill.run(autoId, s, idx + 1));

    const proc = insertCat.run('PROCESSOS E AGILIDADE', 3);
    const procId = proc.lastInsertRowid;
    const procSkills = ['Agilidade', 'Melhoria contínua', 'Resolução de problemas'];
    procSkills.forEach((s, idx) => insertSkill.run(procId, s, idx + 1));

    const ai = insertCat.run('INTELIGÊNCIA ARTIFICIAL', 4);
    const aiId = ai.lastInsertRowid;
    const initialAiSkills = [
      'Google Genkit',
      'Gemini 2.5 Flash',
      'Engenharia de prompts',
      'IA generativa',
      'Inteligência Artificial (IA)'
    ];
    initialAiSkills.forEach((s, idx) => insertSkill.run(aiId, s, idx + 1));
  } else {
    // Ensure INTELIGÊNCIA ARTIFICIAL category and specific skills exist in existing database
    let aiCat = db.prepare('SELECT id FROM skill_categories WHERE name = ?').get('INTELIGÊNCIA ARTIFICIAL') as { id: number } | undefined;
    if (!aiCat) {
      const res = db.prepare('INSERT INTO skill_categories (name, sort_order) VALUES (?, ?)').run('INTELIGÊNCIA ARTIFICIAL', 4);
      aiCat = { id: Number(res.lastInsertRowid) };
    }
    const syncAiSkills = [
      'Google Genkit',
      'Gemini 2.5 Flash',
      'Engenharia de prompts',
      'IA generativa',
      'Inteligência Artificial (IA)'
    ];
    // Clean up duplicate case-variant skills in AI category
    db.prepare("DELETE FROM skills WHERE category_id = ? AND name IN ('Engenharia de Prompt', 'IA Generativa Aplicada', 'Desenvolvimento Acelerado por IA')").run(aiCat.id);
    const skillStmt = db.prepare('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)');
    for (let i = 0; i < syncAiSkills.length; i++) {
      const existing = db.prepare('SELECT id FROM skills WHERE category_id = ? AND name = ?').get(aiCat.id, syncAiSkills[i]);
      if (!existing) {
        skillStmt.run(aiCat.id, syncAiSkills[i], i + 1);
      }
    }

    // Ensure DESENVOLVIMENTO has modern frontend skills
    const devCat = db.prepare('SELECT id FROM skill_categories WHERE name = ?').get('DESENVOLVIMENTO') as { id: number } | undefined;
    if (devCat) {
      const additionalDevSkills = ['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Java'];
      const devSkillStmt = db.prepare('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)');
      for (let i = 0; i < additionalDevSkills.length; i++) {
        const existing = db.prepare('SELECT id FROM skills WHERE category_id = ? AND name = ?').get(devCat.id, additionalDevSkills[i]);
        if (!existing) {
          devSkillStmt.run(devCat.id, additionalDevSkills[i], 10 + i);
        }
      }
    }
  }

  // Seed initial experiences if empty
  const expCount = (db.prepare('SELECT COUNT(*) as count FROM experiences').get() as { count: number }).count;
  if (expCount === 0) {
    const insertExp = db.prepare(`
      INSERT INTO experiences (company, role, start_date, end_date, is_current, work_mode, description, technologies, highlights, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertExp.run(
      'OPAH IT Consultoria (Banco Carrefour)',
      'Analista de Sistemas',
      'Atual',
      null,
      1,
      'Híbrido',
      'Atuação alocada no Banco Carrefour com foco em agilidade, sustentação e evolução de soluções tecnológicas. Participação ativa em cerimônias ágeis, mapeamento de melhorias de processos e iniciativas de aprendizado contínuo e desenvolvimento profissional.',
      'Agilidade, Gestão de Processos, C#, .NET, APIs, SQL',
      'Foco em agilidade e colaboração entre times multidisciplinares',
      1
    );

    insertExp.run(
      'Vivo (Telefônica Brasil)',
      'Estagiária em Operação e Sustentação RPA (Robotic Process Automation)',
      'Agosto de 2024',
      'Setembro de 2025',
      0,
      'Híbrido',
      'Atuação na operação e sustentação de automações robóticas de processos (RPA), utilizando Blue Prism, C#/.NET e Power Automate. Responsável pelo acompanhamento do funcionamento dos robôs, identificação de oportunidades de melhoria, análise e resolução de incidentes e apoio à manutenção da estabilidade e continuidade das automações.\n\n• Suporte à operação e sustentação de robôs de automação.\n• Identificação e implementação de melhorias nos processos automatizados.\n• Monitoramento da qualidade e do desempenho das automações.\n• Investigação e resolução de incidentes técnicos.\n• Colaboração com equipes de suporte N2/N3 na análise e solução de problemas.',
      'Blue Prism, C#/.NET, Power Automate, RPA',
      'Sustentação, operação contínua e resolução de incidentes em robôs de automação',
      2
    );
  } else {
    // Ensure Vivo experience has exact updated details in existing database
    db.prepare(`
      UPDATE experiences
      SET company = 'Vivo (Telefônica Brasil)',
          role = 'Estagiária em Operação e Sustentação RPA (Robotic Process Automation)',
          start_date = 'Agosto de 2024',
          end_date = 'Setembro de 2025',
          is_current = 0,
          work_mode = 'Híbrido',
          description = 'Atuação na operação e sustentação de automações robóticas de processos (RPA), utilizando Blue Prism, C#/.NET e Power Automate. Responsável pelo acompanhamento do funcionamento dos robôs, identificação de oportunidades de melhoria, análise e resolução de incidentes e apoio à manutenção da estabilidade e continuidade das automações.\n\n• Suporte à operação e sustentação de robôs de automação.\n• Identificação e implementação de melhorias nos processos automatizados.\n• Monitoramento da qualidade e do desempenho das automações.\n• Investigação e resolução de incidentes técnicos.\n• Colaboração com equipes de suporte N2/N3 na análise e solução de problemas.',
          technologies = 'Blue Prism, C#/.NET, Power Automate, RPA',
          highlights = 'Sustentação, operação contínua e resolução de incidentes em robôs de automação'
      WHERE company LIKE '%Vivo%'
    `).run();
  }

  // Seed Happy Finance project if empty
  const projCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projCount === 0) {
    db.prepare(`
      INSERT INTO projects (
        slug, title, summary, full_description, category, technologies,
        public_url, repo_url, image_url, image_alt, is_featured, status, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'happy-finance',
      'Happy Finance',
      'Plataforma de gestão financeira pessoal e empresarial (Happy Business). Desenvolvida com Next.js 15, Firebase, Google Genkit e Gemini 2.5 Flash.',
      'O Happy Finance é uma plataforma completa desenvolvida para proporcionar controle total sobre as finanças pessoais e empresariais.\n\n✨ Destaque: Módulo Happy Business (Pequenos Negócios e Empreendedores)\nProjetado para transformar a produção artesanal ou prestação de serviços em uma empresa de alta performance:\n\n• Precificação IA por Lote: informe os custos de insumos/receita e a IA calcula o custo unitário exato, margem de lucro real e o preço sugerido de venda com Gemini 2.5 Flash.\n• Vitrine Online Exclusiva: gere um link profissional com seus produtos para seus clientes realizarem pedidos diretamente via WhatsApp.\n• Agenda de Pedidos: gerencie encomendas futuras, status de produção e prazos de entrega com facilidade.\n• Gestão de Clientes e Estoque: cadastre seus melhores clientes e receba alertas quando seus insumos estiverem acabando.\n\n🛠️ Arquitetura & Stack Tecnológica:\n\n• Frontend:\n  - Next.js 15\n  - React\n  - TypeScript\n  - Tailwind CSS\n  - ShadCN UI\n  - Recharts\n\n• Backend & Infraestrutura:\n  - Firebase Authentication\n  - Cloud Firestore\n  - Firebase Hosting\n\n• Inteligência Artificial:\n  - Google Genkit\n  - Gemini 2.5 Flash\n  - Engenharia de prompts\n  - IA generativa',
      'Finanças & Negócios',
      'Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI, Recharts, Firebase Auth, Cloud Firestore, Google Genkit, Gemini 2.5 Flash, IA Generativa',
      'https://www.happyfinance.com.br/',
      '',
      '/assets/aistudio/image_c230d7b9.png',
      'Vantagens Happy Business - Módulo para pequenos negócios e empreendedores',
      1,
      'published',
      1
    );
  } else {
    // Ensure existing Happy Finance record has the real official URL, Happy Business features, and exact tech stack
    db.prepare(`
      UPDATE projects
      SET title = 'Happy Finance',
          summary = 'Plataforma de gestão financeira pessoal e empresarial (Happy Business). Desenvolvida com Next.js 15, Firebase, Google Genkit e Gemini 2.5 Flash.',
          full_description = 'O Happy Finance é uma plataforma completa desenvolvida para proporcionar controle total sobre as finanças pessoais e empresariais.\n\n✨ Destaque: Módulo Happy Business (Pequenos Negócios e Empreendedores)\nProjetado para transformar a produção artesanal ou prestação de serviços em uma empresa de alta performance:\n\n• Precificação IA por Lote: informe os custos de insumos/receita e a IA calcula o custo unitário exato, margem de lucro real e o preço sugerido de venda com Gemini 2.5 Flash.\n• Vitrine Online Exclusiva: gere um link profissional com seus produtos para seus clientes realizarem pedidos diretamente via WhatsApp.\n• Agenda de Pedidos: gerencie encomendas futuras, status de produção e prazos de entrega com facilidade.\n• Gestão de Clientes e Estoque: cadastre seus melhores clientes e receba alertas quando seus insumos estiverem acabando.\n\n🛠️ Arquitetura & Stack Tecnológica:\n\n• Frontend:\n  - Next.js 15\n  - React\n  - TypeScript\n  - Tailwind CSS\n  - ShadCN UI\n  - Recharts\n\n• Backend & Infraestrutura:\n  - Firebase Authentication\n  - Cloud Firestore\n  - Firebase Hosting\n\n• Inteligência Artificial:\n  - Google Genkit\n  - Gemini 2.5 Flash\n  - Engenharia de prompts\n  - IA generativa',
          category = 'Finanças & Negócios',
          technologies = 'Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI, Recharts, Firebase Auth, Cloud Firestore, Google Genkit, Gemini 2.5 Flash, IA Generativa',
          public_url = 'https://www.happyfinance.com.br/',
          image_url = '/assets/aistudio/image_c230d7b9.png',
          image_alt = 'Vantagens Happy Business - Módulo para pequenos negócios e empreendedores'
      WHERE slug = 'happy-finance'
    `).run();
  }
}
