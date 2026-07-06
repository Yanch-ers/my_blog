import { useState, useCallback } from 'react';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  date: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索文章标题或摘要..."
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 pl-10 text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent)]"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
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
      </div>

      {loading && (
        <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">搜索中...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">没有找到相关文章</p>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {results.map((result) => (
            <a
              key={result.id}
              href={`/posts/${result.id}`}
              className="block rounded-lg border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-sm"
            >
              <h3 className="font-bold text-[var(--color-text)]">{result.title}</h3>
              {result.summary && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {result.summary}
                </p>
              )}
              <time className="mt-2 block text-xs text-[var(--color-text-muted)]">{result.date}</time>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
