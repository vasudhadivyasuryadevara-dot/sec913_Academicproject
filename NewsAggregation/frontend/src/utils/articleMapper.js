const fallbackImages = {
  Technology: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=700&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&h=700&fit=crop',
  Business: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop',
  Health: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=700&fit=crop',
  Politics: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=700&fit=crop',
  Science: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=700&fit=crop',
  default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=700&fit=crop',
};

const formatDate = (createdAt) => {
  if (!createdAt) return 'Just now';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const toNewsCardArticle = (article) => {
  const category = article.category || 'Breaking';
  return {
    id: article.id,
    title: article.title || 'Untitled Article',
    description: article.summary || article.content || 'Read the latest update from NewsSphere AI.',
    image: article.imageUrl || fallbackImages[category] || fallbackImages.default,
    sourceLogo: `https://via.placeholder.com/40/00d4ff/ffffff?text=${category.slice(0, 2).toUpperCase()}`,
    source: article.author || 'NewsSphere AI',
    date: formatDate(article.createdAt),
    readTime: `${Math.max(3, Math.ceil((article.content || article.summary || '').split(/\s+/).filter(Boolean).length / 180))} min read`,
    category,
    credibility: 94,
    sentiment: article.trending ? 'Positive' : 'Neutral',
    score: article.featured ? 98 : 92,
    breaking: Boolean(article.breaking),
    trending: Boolean(article.trending),
    featured: Boolean(article.featured),
    raw: article,
  };
};

export const mergeArticles = (apiArticles, fallbackArticles) => {
  const mapped = apiArticles.map(toNewsCardArticle);
  const existingIds = new Set(mapped.map((article) => String(article.id)));
  return [
    ...mapped,
    ...fallbackArticles.filter((article) => !existingIds.has(String(article.id))),
  ];
};
