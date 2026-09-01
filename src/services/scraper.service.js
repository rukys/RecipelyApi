import * as cheerio from 'cheerio';
import { config } from '../config/index.js';
import {
  AppError,
  NotFoundError,
  UpstreamError,
  TimeoutError
} from '../utils/error.util.js';
import {
  createRecipeKey,
  parseRecipeKey,
  formatDuration,
  formatServings,
  cleanText
} from '../utils/slug.util.js';
import { cacheService } from './cache.service.js';

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, application/xhtml+xml, */*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Referer': 'https://www.masakapahariini.com/',
  'Origin': 'https://www.masakapahariini.com',
  'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin'
};

async function fetchUpstream(path, options = {}) {
  const url = path.startsWith('http') ? path : `${config.baseUrl}${path}`;
  const timeoutMs = options.timeout || config.upstreamTimeoutMs;

  const reqHeaders = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {})
  };

  // Specific referer based on path
  if (url.includes('recipeListing.json') || url.includes('/recipes')) {
    reqHeaders['Referer'] = 'https://www.masakapahariini.com/recipes.html';
  } else if (url.includes('/artikel')) {
    reqHeaders['Referer'] = 'https://www.masakapahariini.com/artikel.html';
  }

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: reqHeaders,
      body: options.body,
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new NotFoundError(`Halaman upstream tidak ditemukan (404)`, 'UPSTREAM_NOT_FOUND');
      }
      throw new UpstreamError(
        `MasakApaHariIni upstream error: ${res.status} ${res.statusText}`,
        'UPSTREAM_HTTP_ERROR',
        `Failed to fetch ${url} (status: ${res.status})`
      );
    }

    return res;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new TimeoutError('Request to MasakApaHariIni timed out', 'UPSTREAM_TIMEOUT', err.message);
    }
    throw new UpstreamError('Gagal terhubung ke MasakApaHariIni', 'UPSTREAM_NETWORK_ERROR', err.message);
  }
}

// Map of categories and their respective group filters
const RECIPE_CATEGORY_FILTERS = {
  'sarapan': {
    name: 'Resep Sarapan',
    path: '/recipes/sarapan.html',
    filter: {
      'group-countries': 'id',
      'group-timesOfDay': 'sarapan',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'makan-siang': {
    name: 'Menu Makan Siang',
    path: '/recipes/makan-siang.html',
    filter: {
      'group-countries': 'id',
      'group-timesOfDay': 'makan siang',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'makan-malam': {
    name: 'Menu Makan Malam',
    path: '/recipes/makan-malam.html',
    filter: {
      'group-countries': 'id',
      'group-timesOfDay': 'makan malam',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'resep-dessert': {
    name: 'Dessert',
    path: '/recipes/resep-dessert.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'dessert',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'dessert': {
    name: 'Dessert',
    path: '/recipes/resep-dessert.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'dessert',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'resep-ayam': {
    name: 'Resep Ayam',
    path: '/recipes/resep-ayam.html',
    filter: {
      'group-countries': 'id',
      'group-mainIngredient': 'ayam',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'ayam': {
    name: 'Resep Ayam',
    path: '/recipes/resep-ayam.html',
    filter: {
      'group-countries': 'id',
      'group-mainIngredient': 'ayam',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'resep-daging': {
    name: 'Resep Daging',
    path: '/recipes/resep-daging.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'daging',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'daging': {
    name: 'Resep Daging',
    path: '/recipes/resep-daging.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'daging',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'resep-sayuran': {
    name: 'Resep Sayuran',
    path: '/recipes/resep-sayuran.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'sayuran',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'sayuran': {
    name: 'Resep Sayuran',
    path: '/recipes/resep-sayuran.html',
    filter: {
      'group-countries': 'id',
      'group-dishes': 'sayuran',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'resep-seafood': {
    name: 'Resep Seafood',
    path: '/recipes/resep-seafood.html',
    filter: {
      'group-countries': 'id',
      'group-freeFormTags': 'seafood',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'seafood': {
    name: 'Resep Seafood',
    path: '/recipes/resep-seafood.html',
    filter: {
      'group-countries': 'id',
      'group-freeFormTags': 'seafood',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'masakan-tradisional': {
    name: 'Masakan Tradisional',
    path: '/recipes/masakan-tradisional.html',
    filter: {
      'group-countries': 'id',
      'group-recipeCuisine': 'asia',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  },
  'masakan-hari-raya': {
    name: 'Masakan Hari Raya',
    path: '/recipes/masakan-hari-raya.html',
    filter: {
      'group-countries': 'id',
      'group-freeFormTags': 'masakan hari raya',
      'group-brands': "royco,bango,buavita,sariwangi,wall's"
    }
  }
};

const ARTICLE_CATEGORIES = [
  {
    category: 'Inspirasi Dapur',
    url: `${config.baseUrl}/artikel/inspirasi-dapur.html`,
    key: 'inspirasi-dapur'
  },
  {
    category: 'Makanan & Gaya Hidup',
    url: `${config.baseUrl}/artikel/makanan-gaya-hidup.html`,
    key: 'makanan-gaya-hidup'
  },
  {
    category: 'Tips Masak',
    url: `${config.baseUrl}/artikel/tips-masak.html`,
    key: 'tips-masak'
  }
];

export class ScraperService {
  /**
   * Get recipe categories list
   */
  static getRecipeCategories() {
    const list = [
      { category: 'Sarapan', url: `${config.baseUrl}/recipes/sarapan.html`, key: 'sarapan' },
      { category: 'Menu Makan Siang', url: `${config.baseUrl}/recipes/makan-siang.html`, key: 'makan-siang' },
      { category: 'Menu Makan Malam', url: `${config.baseUrl}/recipes/makan-malam.html`, key: 'makan-malam' },
      { category: 'Dessert', url: `${config.baseUrl}/recipes/resep-dessert.html`, key: 'resep-dessert' },
      { category: 'Resep Ayam', url: `${config.baseUrl}/recipes/resep-ayam.html`, key: 'resep-ayam' },
      { category: 'Resep Daging', url: `${config.baseUrl}/recipes/resep-daging.html`, key: 'resep-daging' },
      { category: 'Resep Sayuran', url: `${config.baseUrl}/recipes/resep-sayuran.html`, key: 'resep-sayuran' },
      { category: 'Resep Seafood', url: `${config.baseUrl}/recipes/resep-seafood.html`, key: 'resep-seafood' },
      { category: 'Masakan Tradisional', url: `${config.baseUrl}/recipes/masakan-tradisional.html`, key: 'masakan-tradisional' },
      { category: 'Masakan Hari Raya', url: `${config.baseUrl}/recipes/masakan-hari-raya.html`, key: 'masakan-hari-raya' }
    ];
    return list;
  }

  /**
   * Get recipes with pagination, category filter, and keyword search
   */
  static async getRecipes({ page = 1, limit = 10, category = null, search = null }) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const from = (p - 1) * l;

    const cacheKey = `recipes:cat=${category}:search=${search}:from=${from}:size=${l}`;

    return cacheService.remember(cacheKey, async () => {
      let filterObj = {
        'group-countries': 'id',
        'group-brands': "royco,bango,buavita,sariwangi,wall's"
      };

      let endpointPath = '/recipes.recipeListing.json';

      if (category) {
        const catKey = category.toLowerCase().trim();
        const catConfig = RECIPE_CATEGORY_FILTERS[catKey];
        if (catConfig) {
          filterObj = { ...catConfig.filter };
          endpointPath = `${catConfig.path.split('.html')[0]}.recipeListing.json`;
        }
      }

      if (search) {
        filterObj['group-search'] = search.trim();
      }

      const params = new URLSearchParams(filterObj);
      params.append('query', 'bygroup');
      params.append('from', String(from));
      params.append('size', String(l));

      const targetUrl = `${endpointPath}?${params.toString()}`;
      const res = await fetchUpstream(targetUrl);
      const json = await res.json();

      let rawList = [];
      if (json && json.recipeByGroups) {
        try {
          rawList = JSON.parse(json.recipeByGroups);
        } catch (e) {
          rawList = [];
        }
      }

      const results = rawList.map((item) => {
        const data = item.recipeData || item;
        const name = data.name || data.recipeName || '';
        const id = data.recipeID || data.id || '';
        const key = createRecipeKey(name, id);
        
        let thumb = '';
        if (data.newImage && data.newImage[0]?.default?.url) {
          thumb = data.newImage[0].default.url;
        } else if (data.image && data.image[0]?.default) {
          thumb = data.image[0].default;
        } else if (id) {
          thumb = `https://assets.unileversolutions.com/recipes-v2/${id}.jpg`;
        }

        const times = data.totalTime ? `${data.totalTime} mnt` : (data.cookTime ? `${data.cookTime} mnt` : '-');
        const portion = formatServings(data.recipeYield || data.validServingSizes);
        const difficulty = (Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty) || 'Mudah';

        return {
          title: cleanText(name),
          thumb,
          key,
          times,
          portion,
          dificulty: difficulty,
          difficulty: difficulty
        };
      });

      return results;
    });
  }

  /**
   * Get detailed recipe data by key or ID
   */
  static async getRecipeDetail(key) {
    if (!key) {
      throw new NotFoundError('Parameter recipe key wajib diisi', 'RECIPE_KEY_REQUIRED');
    }

    const cacheKey = `recipe:detail:${key}`;

    return cacheService.remember(cacheKey, async () => {
      const { slug, id } = parseRecipeKey(key);

      let targetUrl = '';
      if (id && slug) {
        targetUrl = `/r/${slug}.html/${id}`;
      } else if (id) {
        targetUrl = `/r/resep.html/${id}`;
      } else if (slug) {
        const searchResults = await this.getRecipes({ search: slug.replace(/-/g, ' '), limit: 5 });
        const match = searchResults.find(r => r.key.includes(slug)) || searchResults[0];
        if (match) {
          const parsed = parseRecipeKey(match.key);
          if (parsed.id) {
            targetUrl = `/r/${parsed.slug || slug}.html/${parsed.id}`;
          }
        }
        if (!targetUrl) {
          targetUrl = `/r/${slug}.html/1`;
        }
      }

      let html = '';
      try {
        const res = await fetchUpstream(targetUrl);
        html = await res.text();
      } catch (err) {
        if (id) {
          try {
            const fallbackRes = await fetchUpstream(`/r/resep/${id}`);
            html = await fallbackRes.text();
          } catch (e) {
            throw new NotFoundError(`Resep '${key}' tidak ditemukan di server MasakApaHariIni`, 'RECIPE_NOT_FOUND', err.message);
          }
        } else {
          throw new NotFoundError(`Resep '${key}' tidak ditemukan`, 'RECIPE_NOT_FOUND', err.message);
        }
      }

      const $ = cheerio.load(html);

      // Extract JSON-LD Recipe Schema
      let recipeSchema = null;
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Recipe' || json['@type']?.includes?.('Recipe')) {
            recipeSchema = json;
          }
        } catch (e) {}
      });

      if (!recipeSchema) {
        const title = $('title').text().replace(/\|.*$/, '').trim() || $('h1').first().text().trim();
        if (!title || title.includes('404')) {
          throw new NotFoundError(`Resep '${key}' tidak ditemukan`, 'RECIPE_NOT_FOUND');
        }

        const ingredients = [];
        $('.cmp-recipe-ingredients-item, .ingredient, [class*="ingredient"]').each((_, el) => {
          const t = cleanText($(el).text());
          if (t && !ingredients.includes(t)) ingredients.push(t);
        });

        const steps = [];
        $('.cmp-recipe-instructions-item, .instruction, [class*="step"]').each((_, el) => {
          const t = cleanText($(el).text());
          if (t && !steps.includes(t)) steps.push(t);
        });

        return {
          title: cleanText(title),
          thumb: $('meta[property="og:image"]').attr('content') || '',
          servings: '4 porsi',
          times: '30 mnt',
          difficulty: 'Mudah',
          author: {
            user: 'Masak Apa Hari Ini',
            datePublished: new Date().toISOString()
          },
          desc: cleanText($('meta[name="description"]').attr('content') || ''),
          needItem: [],
          ingredient: ingredients,
          step: steps
        };
      }

      // Build structured ingredients list
      const ingredients = Array.isArray(recipeSchema.recipeIngredient)
        ? recipeSchema.recipeIngredient.map(cleanText).filter(Boolean)
        : [];

      // Build structured steps list
      const steps = [];
      if (Array.isArray(recipeSchema.recipeInstructions)) {
        recipeSchema.recipeInstructions.forEach((item, idx) => {
          if (item['@type'] === 'HowToSection' && Array.isArray(item.itemListElement)) {
            item.itemListElement.forEach(sub => {
              const text = sub.text || sub.name || '';
              if (text) steps.push(cleanText(text));
            });
          } else if (item.text || item.name) {
            steps.push(cleanText(item.text || item.name));
          } else if (typeof item === 'string') {
            steps.push(cleanText(item));
          }
        });
      }

      const formattedSteps = steps.map((s, idx) => {
        if (/^\d+[\.\)]/.test(s)) return s;
        return `${idx + 1}. ${s}`;
      });

      let thumb = '';
      if (Array.isArray(recipeSchema.image) && recipeSchema.image.length > 0) {
        thumb = recipeSchema.image[0];
      } else if (typeof recipeSchema.image === 'string') {
        thumb = recipeSchema.image;
      }

      const servings = formatServings(recipeSchema.recipeYield);
      const times = formatDuration(recipeSchema.totalTime || recipeSchema.cookTime || recipeSchema.prepTime, '30');

      let calories = null;
      if (recipeSchema.nutrition?.calories && recipeSchema.nutrition.calories !== '0kcal') {
        calories = recipeSchema.nutrition.calories;
      }

      const author = {
        user: recipeSchema.author?.name || 'Masak Apa Hari Ini',
        datePublished: recipeSchema.datePublished || recipeSchema.dateCreated || ''
      };

      let video = null;
      if (Array.isArray(recipeSchema.video) && recipeSchema.video.length > 0) {
        const v = recipeSchema.video[0];
        video = {
          title: v.name || '',
          url: v.contentUrl || '',
          uploadDate: v.uploadDate || ''
        };
      }

      return {
        title: cleanText(recipeSchema.name),
        thumb,
        servings,
        times,
        difficulty: 'Mudah',
        calories,
        author,
        desc: cleanText(recipeSchema.description),
        needItem: [],
        ingredient: ingredients,
        step: formattedSteps,
        video
      };
    });
  }

  /**
   * Get article categories list
   */
  static getArticleCategories() {
    return ARTICLE_CATEGORIES;
  }

  /**
   * Get articles list from main article page or specific category
   */
  static async getArticles({ category = null, page = 1, limit = 10 }) {
    const cacheKey = `articles:cat=${category}:page=${page}:limit=${limit}`;

    return cacheService.remember(cacheKey, async () => {
      let targetUrl = '/artikel.html';
      if (category) {
        const catKey = category.toLowerCase().trim();
        targetUrl = `/artikel/${catKey}.html`;
      }

      const res = await fetchUpstream(targetUrl);
      const html = await res.text();
      const $ = cheerio.load(html);

      const articles = [];
      const seen = new Set();

      $('a[href*="/artikel/"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (!href.endsWith('.html') || href === '/artikel.html' || href.match(/\/artikel\/[^\/]+\.html$/)) {
          if (!href.match(/\/artikel\/[^\/]+\/[^\/]+\.html/)) return;
        }

        const cleanHref = href.replace(/^\/artikel\//, '').replace(/\.html$/, '');
        if (seen.has(cleanHref)) return;
        seen.add(cleanHref);

        let title = cleanText($(el).text() || $(el).attr('title') || '');
        let thumb = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || $(el).find('img').attr('data-cmp-src') || '';
        
        const card = $(el).closest('.cmp-pagelistv2__item, .card, [class*="article"], .pagelist');
        if (!title && card.length) {
          title = cleanText(card.find('h2, h3, h4, .title').first().text());
        }
        if (!thumb && card.length) {
          thumb = card.find('img').attr('src') || card.find('img').attr('data-src') || card.find('img').attr('data-cmp-src') || '';
        }

        if (cleanHref && cleanHref.includes('/')) {
          articles.push({
            title: title || cleanHref.split('/').pop().replace(/-/g, ' '),
            thumb: thumb || 'https://assets.unileversolutions.com/v1/122371005.png',
            key: cleanHref,
            url: `${config.baseUrl}/artikel/${cleanHref}.html`
          });
        }
      });

      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.max(1, parseInt(limit, 10) || 10);
      const startIndex = (p - 1) * l;
      return articles.slice(startIndex, startIndex + l);
    });
  }

  /**
   * Get detailed article content by key
   */
  static async getArticleDetail(key) {
    if (!key) {
      throw new NotFoundError('Parameter article key wajib diisi', 'ARTICLE_KEY_REQUIRED');
    }

    const cacheKey = `article:detail:${key}`;

    return cacheService.remember(cacheKey, async () => {
      let cleanKey = decodeURIComponent(key).trim().replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
      if (!cleanKey.startsWith('artikel/')) {
        cleanKey = `artikel/${cleanKey}`;
      }

      const targetUrl = `/${cleanKey}.html`;
      const res = await fetchUpstream(targetUrl);
      const html = await res.text();
      const $ = cheerio.load(html);

      // Extract JSON-LD Article schema
      let articleSchema = null;
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Article' || json['@type'] === 'NewsArticle') {
            articleSchema = json;
          }
        } catch (e) {}
      });

      const title = articleSchema?.headline || $('title').text().replace(/\|.*$/, '').trim();
      const thumb = articleSchema?.image?.url || $('meta[property="og:image"]').attr('content') || '';
      const author = articleSchema?.author?.name || 'Masakapahariini ID Editorial Team';
      const datePublished = articleSchema?.datePublished || articleSchema?.dateCreated || '';
      const description = articleSchema?.description || $('meta[name="description"]').attr('content') || '';
      const body = articleSchema?.articleBody || $('.cmp-text, .article-body, article').text().trim();

      if (!title || title.includes('404')) {
        throw new NotFoundError(`Artikel '${key}' tidak ditemukan`, 'ARTICLE_NOT_FOUND');
      }

      return {
        title: cleanText(title),
        thumb,
        author: {
          user: author,
          datePublished
        },
        description: cleanText(description),
        body: cleanText(body),
        url: `${config.baseUrl}/${cleanKey}.html`
      };
    });
  }
}
