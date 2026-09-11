const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('researchpilot_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Health Check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Auth
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('researchpilot_token', data.token);
      }
      return data;
    } catch (err: any) {
      console.warn('API login notice:', err?.message);
      return null;
    }
  }

  async register(name: string, email: string, password: string, role: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed');
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('researchpilot_token', data.token);
      }
      return data;
    } catch (err: any) {
      console.warn('API register notice:', err?.message);
      return null;
    }
  }

  async googleAuth(googleData: { email: string; name: string; googleId?: string; role?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      });
      if (!res.ok) throw new Error('Google auth failed');
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('researchpilot_token', data.token);
      }
      return data;
    } catch (err: any) {
      console.warn('Google auth notice:', err?.message);
      return null;
    }
  }

  async completeProfile(role: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Profile completion failed');
      return await res.json();
    } catch (err: any) {
      console.warn('Complete profile error:', err?.message);
      return null;
    }
  }

  async getMe() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: this.getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // Workspaces
  async getWorkspaces() {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch workspaces');
      const data = await res.json();
      return data.workspaces;
    } catch (err) {
      return null;
    }
  }

  async createWorkspace(workspaceData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(workspaceData)
      });
      if (!res.ok) throw new Error('Failed to create workspace');
      const data = await res.json();
      return data.workspace;
    } catch (err) {
      return null;
    }
  }

  // Documents Upload & Text Extraction
  async uploadDocument(name: string, content?: string, fileSize?: string, workspaceId?: string, fileType?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name, content, fileSize, workspaceId, fileType })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload document');
      }
      const data = await res.json();
      return data.document;
    } catch (err: any) {
      console.warn('API upload error:', err);
      throw err;
    }
  }

  async createTextDocument(title: string, content: string, workspaceId?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/text`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ title, content, workspaceId })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create text research document');
      }
      const data = await res.json();
      return data.document;
    } catch (err: any) {
      console.warn('API create text document error:', err);
      throw err;
    }
  }

  async updateTextDocument(id: string, title: string, content: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update text research document');
      }
      const data = await res.json();
      return data.document;
    } catch (err: any) {
      console.warn('API update text document error:', err);
      throw err;
    }
  }

  async getDocuments(workspaceId?: string) {
    try {
      const url = workspaceId ? `${API_BASE_URL}/documents?workspaceId=${workspaceId}` : `${API_BASE_URL}/documents`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      return data.documents;
    } catch {
      return null;
    }
  }

  // Papers Search, Management & Comparison
  async searchPapers(query: string, options?: { page?: number; limit?: number; yearFrom?: number; yearTo?: number; sort?: string }) {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.yearFrom) params.append('yearFrom', options.yearFrom.toString());
      if (options?.yearTo) params.append('yearTo', options.yearTo.toString());
      if (options?.sort) params.append('sort', options.sort);

      const res = await fetch(`${API_BASE_URL}/papers/search?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error('Paper search failed');
      return await res.json();
    } catch (err) {
      console.warn('Paper search error:', err);
      return null;
    }
  }

  async addPaperToWorkspace(paper: any, workspaceId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/papers/add-to-workspace`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ ...paper, workspaceId })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add paper to workspace');
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Add paper error:', err?.message);
      return null;
    }
  }

  async getPapers(workspaceId?: string) {
    try {
      const url = workspaceId ? `${API_BASE_URL}/papers?workspaceId=${workspaceId}` : `${API_BASE_URL}/papers`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch papers');
      const data = await res.json();
      return data.papers;
    } catch {
      return null;
    }
  }

  async analyzePaper(paperId: string, title?: string, abstract?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/papers/${paperId}/analyze`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ title, abstract })
      });
      if (!res.ok) throw new Error('Failed to analyze paper');
      const data = await res.json();
      return data.analysis;
    } catch {
      return null;
    }
  }

  async comparePapers(workspaceId: string, paperIds: string[], researchQuestion?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/papers/compare`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ workspaceId, paperIds, researchQuestion })
      });
      if (!res.ok) throw new Error('Failed to compare papers');
      return await res.json();
    } catch (err) {
      console.warn('Paper comparison failed:', err);
      return null;
    }
  }

  async getComparisons(workspaceId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/papers/comparisons?workspaceId=${workspaceId}`, {
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch comparisons');
      const data = await res.json();
      return data.comparisons;
    } catch {
      return null;
    }
  }

  // Gaps
  async getGaps(workspaceId?: string) {
    try {
      const url = workspaceId ? `${API_BASE_URL}/gaps?workspaceId=${workspaceId}` : `${API_BASE_URL}/gaps`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch gaps');
      const data = await res.json();
      return data.gaps;
    } catch {
      return null;
    }
  }

  // Directions
  async getDirections(workspaceId?: string) {
    try {
      const url = workspaceId ? `${API_BASE_URL}/directions?workspaceId=${workspaceId}` : `${API_BASE_URL}/directions`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch directions');
      const data = await res.json();
      return data.directions;
    } catch {
      return null;
    }
  }

  // Reports
  async getLatestReport(workspaceId?: string, documentId?: string) {
    try {
      let url = `${API_BASE_URL}/reports/latest`;
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      if (documentId) params.append('documentId', documentId);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch latest report');
      const data = await res.json();
      return data.report;
    } catch {
      return null;
    }
  }

  // Agent Pipeline (Supports combined documentIds + paperIds)
  async runAgentPipeline(
    workspaceId: string,
    documentId?: string,
    question?: string,
    options?: { documentIds?: string[]; paperIds?: string[] }
  ) {
    try {
      const res = await fetch(`${API_BASE_URL}/agents/run`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          workspaceId,
          documentId,
          documentIds: options?.documentIds,
          paperIds: options?.paperIds,
          researchQuestion: question
        })
      });
      if (!res.ok) throw new Error('Failed to run agent pipeline');
      return await res.json();
    } catch (err) {
      console.warn('Backend pipeline trigger failed or offline:', err);
      return null;
    }
  }
}

export const apiService = new ApiService();
