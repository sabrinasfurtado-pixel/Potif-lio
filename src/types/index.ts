export interface PortfolioProfile {
  id: number;
  full_name: string;
  professional_title: string;
  hero_intro: string;
  about_markdown: string;
  avatar_url: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  location: string;
  footer_text: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  category_id: number;
  name: string;
  sort_order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  sort_order: number;
  skills?: Skill[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: number; // 1 or 0
  work_mode: string;
  description: string;
  technologies: string;
  highlights?: string;
  sort_order: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  full_description: string;
  category: string;
  technologies: string;
  public_url: string;
  repo_url: string;
  image_url: string;
  image_alt: string;
  is_featured: number; // 1 or 0
  status: 'published' | 'draft';
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  ip?: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalSkills: number;
  totalExperiences: number;
  unreadMessages: number;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  skills: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
}
