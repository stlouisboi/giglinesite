import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SITE_SEARCH_INDEX } from '../data/siteSearchIndex';

const RECENT_KEY = 'gl_search_recent';
const RECENT_LIMIT = 5;

const loadRecent = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, RECENT_LIMIT) : [];
  } catch { return []; }
};
const saveRecent = (q) => {
  if (!q || !q.trim()) return;
  try {
    const trimmed = q.trim();
    const prev = loadRecent().filter(x => x.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...prev].slice(0, RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* ignore quota / disabled storage */ }
};
const clearRecent = () => { try { localStorage.removeItem(RECENT_KEY); } catch { /* */ } };

/** Bold the first case-insensitive match of `query` inside `text`. */
const Highlight = ({ text, query }) => {
  if (!text) return null;
  const q = (query || '').trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-[#C9A84C]/30 text-[#1C2B2B] rounded-sm px-0.5 -mx-0.5 font-semibold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
};

/**
 * Sitewide search modal. Triggered by the search icon in the Navbar.
 * - Press '/' or Cmd/Ctrl+K to open
 * - Press Esc to close
 * - Arrow keys to navigate results
 * - Enter to navigate to selected result
 */
const TYPE_TONE = {
  Page: 'bg-gray-100 text-gray-700',
  Service: 'bg-[#2A52A0]/10 text-[#2A52A0]',
  'Field Note': 'bg-[#C9A84C]/15 text-[#7a5d0a]',
  FAQ: 'bg-gray-100 text-gray-700',
  Resource: 'bg-emerald-50 text-emerald-700',
  'Lead Magnet': 'bg-emerald-50 text-emerald-700',
  'Case Study': 'bg-purple-50 text-purple-700',
  Blog: 'bg-blue-50 text-blue-700',
};

const scoreEntry = (entry, query) => {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const title = (entry.title || '').toLowerCase();
  const kw = (entry.keywords || '').toLowerCase();
  const type = (entry.type || '').toLowerCase();
  // Title-start match = highest score
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 70;
  if (kw.includes(q)) return 40;
  if (type.includes(q)) return 20;
  return 0;
};

export const SiteSearch = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recents, setRecents] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return SITE_SEARCH_INDEX
      .map(e => ({ entry: e, score: scoreEntry(e, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(r => r.entry);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setRecents(loadRecent());
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  const commitNavigation = useCallback((path, q) => {
    saveRecent(q || query);
    navigate(path);
    onClose();
  }, [query, navigate, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[selectedIdx]) {
        e.preventDefault();
        commitNavigation(results[selectedIdx].path);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, results, selectedIdx, commitNavigation]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-28 px-4" onClick={onClose} data-testid="site-search-modal">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search the site"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Field Notes, services, pages..."
            className="flex-1 bg-transparent border-0 outline-none text-base text-[#1C2B2B] placeholder-gray-400"
            data-testid="site-search-input"
            aria-label="Search query"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border border-gray-200"
            aria-label="Close search"
            data-testid="site-search-close"
          >
            <X size={12} /> Esc
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            recents.length > 0 ? (
              <div data-testid="site-search-recents">
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent searches</p>
                  <button
                    onClick={() => { clearRecent(); setRecents([]); }}
                    className="text-[10px] text-gray-400 hover:text-gray-700"
                    data-testid="site-search-clear-recents"
                  >
                    Clear
                  </button>
                </div>
                <ul role="listbox">
                  {recents.map((r, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => { setQuery(r); inputRef.current?.focus(); }}
                        className="w-full text-left flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50"
                        data-testid={`site-search-recent-${i}`}
                      >
                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-[#1C2B2B]">{r}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="px-5 pb-5 pt-1 text-[11px] text-gray-400">Tip: press <kbd className="px-1 py-0.5 bg-gray-100 rounded font-mono text-[10px]">/</kbd> from anywhere to jump back here.</p>
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-gray-400" data-testid="site-search-empty">
                <p className="mb-2">Search across the entire site</p>
                <p className="text-xs">25 Field Notes · all services · resources · case study · FAQ</p>
              </div>
            )
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400" data-testid="site-search-noresults">
              No results for &ldquo;<span className="text-[#1C2B2B] font-medium">{query}</span>&rdquo;.
            </div>
          ) : (
            <ul role="listbox" data-testid="site-search-results">
              {results.map((r, i) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    onClick={() => commitNavigation(r.path)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`flex items-center justify-between gap-3 px-5 py-3 transition-colors border-l-4 ${i === selectedIdx ? 'bg-[#F4F6FB] border-l-[#2A52A0]' : 'border-l-transparent hover:bg-gray-50'}`}
                    data-testid={`site-search-result-${i}`}
                    role="option"
                    aria-selected={i === selectedIdx}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#1C2B2B] truncate"><Highlight text={r.title} query={query} /></p>
                      <p className="text-[11px] text-gray-400 truncate"><Highlight text={r.path} query={query} /></p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${TYPE_TONE[r.type] || 'bg-gray-100 text-gray-700'} flex-shrink-0`}>
                      {r.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hints */}
        <div className="px-5 py-2.5 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-600 bg-gray-50">
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">↵</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default SiteSearch;
