export interface AcademicPaperResult {
  id: string;
  externalId: string;
  source: string;
  title: string;
  authors: string[];
  publicationYear: number;
  venue: string;
  journalOrConf: string;
  abstract: string;
  citations: number;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  concepts: string[];
  tags: string[];
}

export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
  yearFrom?: number;
  yearTo?: number;
  sort?: 'relevance' | 'citations' | 'publication_date';
}

export interface AcademicSearchProvider {
  searchPapers(options: SearchOptions): Promise<{ papers: AcademicPaperResult[]; total: number }>;
}

export class OpenAlexProvider implements AcademicSearchProvider {
  private baseUrl = 'https://api.openalex.org/works';

  // Helper to convert OpenAlex inverted index abstract into string
  private reconstructAbstract(invertedIndex?: Record<string, number[]>): string {
    if (!invertedIndex) return 'No abstract available in public record.';
    
    const wordPositions: { word: string; pos: number }[] = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        wordPositions.push({ word, pos });
      }
    }
    
    wordPositions.sort((a, b) => a.pos - b.pos);
    return wordPositions.map(w => w.word).join(' ');
  }

  async searchPapers(options: SearchOptions): Promise<{ papers: AcademicPaperResult[]; total: number }> {
    try {
      const { query, page = 1, limit = 10, yearFrom, yearTo, sort = 'relevance' } = options;
      
      const params = new URLSearchParams();
      params.append('search', query);
      params.append('page', page.toString());
      params.append('per_page', Math.min(limit, 25).toString());
      
      let filterString = '';
      if (yearFrom && yearTo) {
        filterString = `publication_year:${yearFrom}-${yearTo}`;
      } else if (yearFrom) {
        filterString = `publication_year:>${yearFrom - 1}`;
      } else if (yearTo) {
        filterString = `publication_year:<${yearTo + 1}`;
      }
      
      if (filterString) {
        params.append('filter', filterString);
      }

      if (sort === 'citations') {
        params.append('sort', 'cited_by_count:desc');
      } else if (sort === 'publication_date') {
        params.append('sort', 'publication_date:desc');
      }

      const res = await fetch(`${this.baseUrl}?${params.toString()}`, {
        headers: {
          'User-Agent': 'ResearchPilot/2.0 (mailto:researchpilot@example.com)'
        }
      });

      if (!res.ok) {
        throw new Error(`OpenAlex API responded with status ${res.status}`);
      }

      const data: any = await res.json();
      const metaTotal = data.meta?.count || 0;
      const results = data.results || [];

      const papers: AcademicPaperResult[] = results.map((work: any) => {
        const authors = (work.authorships || [])
          .map((a: any) => a.author?.display_name)
          .filter(Boolean);
        
        const venue = work.primary_location?.source?.display_name || 
                      work.host_venue?.display_name || 
                      'Academic Literature';
                      
        const concepts = (work.concepts || [])
          .slice(0, 5)
          .map((c: any) => c.display_name);

        const abstract = this.reconstructAbstract(work.abstract_inverted_index);
        const pdfUrl = work.open_access?.is_oa ? work.primary_location?.pdf_url || undefined : undefined;

        return {
          id: work.id || `openalex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          externalId: work.id,
          source: 'OpenAlex',
          title: work.title || 'Untitled Academic Paper',
          authors: authors.length > 0 ? authors : ['Unknown Researchers'],
          publicationYear: work.publication_year || new Date().getFullYear(),
          venue,
          journalOrConf: venue,
          abstract: abstract.substring(0, 800),
          citations: work.cited_by_count || 0,
          doi: work.doi ? work.doi.replace('https://doi.org/', '') : undefined,
          url: work.doi || work.landing_page_url || (work.id ? `https://openalex.org/${work.id}` : undefined),
          pdfUrl,
          concepts,
          tags: concepts
        };
      });

      return { papers, total: metaTotal };
    } catch (err: any) {
      console.warn('OpenAlex Search Error:', err?.message);
      return { papers: [], total: 0 };
    }
  }
}

class AcademicSearchService {
  private provider: AcademicSearchProvider;

  constructor(provider?: AcademicSearchProvider) {
    this.provider = provider || new OpenAlexProvider();
  }

  async searchPapers(options: SearchOptions) {
    return this.provider.searchPapers(options);
  }
}

export const academicSearchService = new AcademicSearchService();
