import {
  PortfolioData,
  PortfolioProfile,
  Project,
  Skill,
  SkillCategory,
  Experience,
  ContactMessage,
  DashboardStats,
  AdminUser
} from '../types/index.ts';

const TOKEN_KEY = 'sabrina_portfolio_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erro ${response.status}: Operação falhou.`);
  }

  return data as T;
}

// ----------------------------------------------------
// Public API
// ----------------------------------------------------
export const publicApi = {
  getPortfolio: () => request<PortfolioData>('/api/public/portfolio'),
  sendContact: (body: { name: string; email: string; subject?: string; message: string; honeypot?: string }) =>
    request<{ success: boolean; message: string }>('/api/public/contact', {
      method: 'POST',
      body: JSON.stringify(body)
    })
};

// ----------------------------------------------------
// Admin API
// ----------------------------------------------------
export const adminApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await request<{ token: string; admin: AdminUser }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setAuthToken(res.token);
    return res;
  },

  logout: () => {
    setAuthToken(null);
  },

  getMe: () => request<{ admin: AdminUser }>('/api/admin/me'),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  getStats: () => request<DashboardStats>('/api/admin/stats'),

  getProfile: () => request<{ profile: PortfolioProfile }>('/api/admin/profile'),

  updateProfile: (profile: Partial<PortfolioProfile>) =>
    request<{ success: boolean; profile: PortfolioProfile }>('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    }),

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ success: boolean; url: string; filename: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
  },

  getProjects: () => request<{ projects: Project[] }>('/api/admin/projects'),

  createProject: (project: Partial<Project>) =>
    request<{ success: boolean; project: Project }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    }),

  updateProject: (id: number, project: Partial<Project>) =>
    request<{ success: boolean; project: Project }>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    }),

  toggleProjectStatus: (id: number, status: 'published' | 'draft') =>
    request<{ success: boolean; status: string }>(`/api/admin/projects/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  deleteProject: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    }),

  getSkillsData: () => request<{ categories: SkillCategory[]; skills: Skill[] }>('/api/admin/skills-data'),

  createCategory: (name: string, sort_order?: number) =>
    request<{ success: boolean; category: SkillCategory }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name, sort_order })
    }),

  updateCategory: (id: number, name: string, sort_order?: number) =>
    request<{ success: boolean; category: SkillCategory }>(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, sort_order })
    }),

  deleteCategory: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    }),

  createSkill: (category_id: number, name: string, sort_order?: number) =>
    request<{ success: boolean; skill: Skill }>('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify({ category_id, name, sort_order })
    }),

  updateSkill: (id: number, category_id: number, name: string, sort_order?: number) =>
    request<{ success: boolean; skill: Skill }>(`/api/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category_id, name, sort_order })
    }),

  deleteSkill: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/admin/skills/${id}`, {
      method: 'DELETE'
    }),

  getExperiences: () => request<{ experiences: Experience[] }>('/api/admin/experiences'),

  createExperience: (exp: Partial<Experience>) =>
    request<{ success: boolean; experience: Experience }>('/api/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(exp)
    }),

  updateExperience: (id: number, exp: Partial<Experience>) =>
    request<{ success: boolean; experience: Experience }>(`/api/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exp)
    }),

  deleteExperience: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/admin/experiences/${id}`, {
      method: 'DELETE'
    }),

  getMessages: () => request<{ messages: ContactMessage[] }>('/api/admin/messages'),

  markMessageRead: (id: number, is_read: boolean) =>
    request<{ success: boolean }>(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read })
    }),

  deleteMessage: (id: number) =>
    request<{ success: boolean; message: string }>(`/api/admin/messages/${id}`, {
      method: 'DELETE'
    })
};
