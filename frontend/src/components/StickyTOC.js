import React, { useEffect, useState, useRef } from 'react';
import { List, X } from 'lucide-react';

/*
  StickyTOC
  ---------
  Floating table of contents for long-form articles.

  - Renders a compact "Contents" pill at the bottom-right of the viewport
    (right-3, bottom-4 on mobile; right-6, bottom-6 on desktop).
  - Opens a card with jump-links.
  - ScrollSpy highlights the section currently in view.
  - Progress bar under the header shows total scroll depth through the article.
  - Auto-closes after a link is clicked.
  - Only renders once the user has scrolled past the hero (~500px) so it never
    obscures the opening headline.

  Usage:
    <StickyTOC items={[{ id: "what-standard", label: "What OSHA says" }, ...]} />
*/

const StickyTOC = ({ items = [] }) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef(null);

  // ── Show/hide + progress + scrollspy ────────────────────────────────
  useEffect(() => {
    if (!items.length) return;

    const onScroll = () => {
      // Show the pill after ~500px of scroll (past the hero)
      const scrollY = window.scrollY;
      setVisible(scrollY > 500);

      // Overall page scroll progress
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(100, (scrollY / docH) * 100) : 0);

      // ScrollSpy — pick the section whose top is closest to the top of the viewport
      let currentId = null;
      let closestDelta = Infinity;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Prefer sections whose top has already passed the 120px offset
        if (rect.top - 120 <= 0 && Math.abs(rect.top - 120) < closestDelta) {
          closestDelta = Math.abs(rect.top - 120);
          currentId = item.id;
        }
      }
      // Fallback: first item if nothing has passed the offset yet
      if (!currentId && scrollY > 200) currentId = items[0]?.id;
      setActiveId(currentId);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  // ── Close on outside click ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // ── Close on ESC ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleJump = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setOpen(false);
  };

  if (!items.length) return null;
  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-40 right-3 bottom-4 md:right-6 md:bottom-6"
      data-testid="sticky-toc"
    >
      {/* Panel */}
      {open && (
        <div
          className="mb-3 w-[280px] md:w-[320px] bg-white border border-[#2A52A0]/20 rounded-lg shadow-lg overflow-hidden"
          style={{ boxShadow: '0 10px 40px -10px rgba(16, 42, 67, 0.25)' }}
          data-testid="sticky-toc-panel"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#102A43] text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-[#C9A84C] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Contents</p>
              <p className="text-xs text-white/60 mt-0.5">{Math.round(progress)}% through</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close contents menu"
              data-testid="sticky-toc-close"
            >
              <X size={16} />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-0.5 bg-[#2A52A0]/10">
            <div className="h-full bg-[#C9A84C] transition-all" style={{ width: `${progress}%` }} />
          </div>
          {/* Items */}
          <nav className="max-h-[60vh] overflow-y-auto py-2">
            <ul>
              {items.map((item) => {
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={handleJump(item.id)}
                      className={`block px-4 py-2 text-sm leading-snug transition-colors border-l-2 ${active ? 'text-[#1F3F80] font-semibold border-[#C9A84C] bg-[#F9F8F6]' : 'text-[#1C2B2B]/70 hover:text-[#1F3F80] hover:bg-[#F9F8F6] border-transparent'}`}
                      data-testid={`sticky-toc-item-${item.id}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-4 py-2.5 rounded-full shadow-lg transition-colors text-sm"
        style={{ boxShadow: '0 8px 30px -8px rgba(16, 42, 67, 0.45)' }}
        aria-expanded={open}
        aria-label={open ? 'Close table of contents' : 'Open table of contents'}
        data-testid="sticky-toc-trigger"
      >
        <List size={16} />
        <span>Contents</span>
        <span className="text-[10px] text-[#C9A84C] font-bold tabular-nums" data-testid="sticky-toc-progress">
          {Math.round(progress)}%
        </span>
      </button>
    </div>
  );
};

export default StickyTOC;
