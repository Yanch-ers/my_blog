import { useState, useEffect, useMemo, useRef } from 'react';

interface SearchIndexEntry {
  title: string;
  summary: string;
  tags: string[];
  date: string;
  timestamp: number;
  url: string;
  body: string;
}

function scoreEntry(entry: SearchIndexEntry, terms: string[]): number {
  let score = 0;
  const titleLower = entry.title.toLowerCase();
  const summaryLower = entry.summary.toLowerCase();
  const bodyLower = entry.body.toLowerCase();
  const tagsLower = entry.tags.map((t) => t.toLowerCase());

  for (const term of terms) {
    if (titleLower.includes(term)) {
      score += titleLower === term ? 100 : 50;
    }
    if (tagsLower.some((t) => t.includes(term))) {
      score += 30;
    }
    if (summaryLower.includes(term)) {
      score += 20;
    }
    if (bodyLower.includes(term)) {
      score += 5;
    }
  }

  score += Math.min(entry.timestamp / 1e12, 1);

  return score;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndexEntry[]>([]);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/search.json')
      .then((res) => res.json())
      .then((data) => {
        setIndex(data);
        setIndexLoaded(true);
      })
      .catch(() => {
        setIndexLoaded(true);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];

    const terms = trimmed
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (terms.length === 0) return [];

    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(({ entry }) => entry);
  }, [query, index]);

  const searched = query.trim().length >= 1;

  const highlight = (text: string, terms: string[]) => {
    if (terms.length === 0 || !text) return text;
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-emerald-100 text-[var(--color-text)] rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  return (
    <div className="w-full">
      {/* Large search bar */}
      <div className="relative mb-6">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜 / 文章 / 标签 / 作者"
          className="w-full rounded-full border border-[var(--color-border)] bg-white/80 backdrop-blur-sm px-6 py-3.5 pl-12 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-all focus:border-[var(--color-accent)] focus:shadow-lg focus:shadow-emerald-500/10"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label="清除搜索"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      {!indexLoaded && (
        <p className="text-center text-sm text-[var(--color-text-muted)]">加载搜索索引...</p>
      )}

      {indexLoaded && searched && results.length === 0 && (
        <div className="flex flex-col items-center py-12">
          <svg className="mb-3 text-[var(--color-text-muted)] opacity-40" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <p className="text-sm text-[var(--color-text-muted)]">没有找到相关文章</p>
        </div>
      )}

      {indexLoaded && results.length > 0 && (
        <>
          <p className="mb-4 text-xs text-[var(--color-text-muted)]">
            找到 {results.length} 篇相关文章
          </p>
          <div className="flex flex-col gap-3">
            {results.map((result) => (
              <a
                key={result.url}
                href={result.url}
                className="block rounded-2xl glass-card p-4 transition-all hover:shadow-lg group"
              >
                <h3 className="font-serif font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {highlight(result.title, terms)}
                </h3>
                {result.summary && (
                  <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {highlight(result.summary, terms)}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-3">
                  <time className="text-[10px] text-[var(--color-text-muted)]">{result.date}</time>
                  {result.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
