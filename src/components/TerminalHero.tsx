import { useState, useEffect } from 'react';

interface TerminalHeroProps {
  techCount: number;
  essaysCount: number;
}

const commands = [
  { cmd: 'kubectl get pods -n production', output: 'All systems running ✓' },
  { cmd: 'systemctl status docker', output: 'Active since boot ✓' },
  { cmd: 'SELECT * FROM nodes', output: 'Database connected ✓' },
  { cmd: 'docker compose up -d', output: 'Services started...' },
  { cmd: 'redis-cli ping', output: 'PONG' },
  { cmd: 'kafka-topics --list', output: 'Topics loaded ✓' },
];

const categories = [
  { name: 'Kubernetes', icon: '☸️' },
  { name: 'Linux', icon: '🐧' },
  { name: 'Database', icon: '💾' },
  { name: 'Docker', icon: '🐳' },
  { name: 'AI', icon: '🤖' },
  { name: 'Network', icon: '🌐' },
];

export default function TerminalHero({ techCount, essaysCount }: TerminalHeroProps) {
  const [currentCmdIndex, setCurrentCmdIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);

  useEffect(() => {
    const current = commands[currentCmdIndex];
    let charIndex = 0;
    setTypedText('');
    setShowOutput(false);

    const typeInterval = setInterval(() => {
      if (charIndex < current.cmd.length) {
        setTypedText(current.cmd.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowOutput(true);
          setHistory((prev) => [...prev.slice(-2), { cmd: current.cmd, output: current.output }]);
          setTimeout(() => {
            setCurrentCmdIndex((prev) => (prev + 1) % commands.length);
          }, 2000);
        }, 500);
      }
    }, 40 + Math.random() * 25);

    return () => clearInterval(typeInterval);
  }, [currentCmdIndex]);

  return (
    <section className="relative mb-12 overflow-hidden rounded-2xl glass-panel">
      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-medium text-[var(--color-text-muted)]">~/YancheBlog</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            {techCount} Tech
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            {essaysCount} Essays
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Title area */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3 tracking-tight">
            云原生运维的技术笔记
          </h1>
          <p className="text-base md:text-lg text-[var(--color-text-secondary)]">
            Linux / Kubernetes / 数据库 / AI 自动化
          </p>
        </div>

        {/* Terminal display */}
        <div className="rounded-xl bg-[var(--color-code-bg)] border border-[var(--color-border)] p-5 font-mono text-sm leading-relaxed max-w-2xl mx-auto">
          {history.map((h, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center gap-2">
                <span className="text-teal-500 font-semibold">$</span>
                <span className="text-[var(--color-text-secondary)]">{h.cmd}</span>
              </div>
              <div className="mt-0.5 text-emerald-600/70 dark:text-emerald-400/70 text-xs">{h.output}</div>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="text-teal-500 font-semibold">$</span>
            <span className="text-[var(--color-text)]">{typedText}</span>
            <span className="inline-block h-4 w-2 bg-teal-500 animate-pulse" style={{ animationDuration: '0.8s' }} />
          </div>

          {showOutput && (
            <div className="mt-1 text-emerald-600/70 dark:text-emerald-400/70 text-xs">
              {commands[currentCmdIndex].output}
            </div>
          )}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {categories.map((cat) => (
            <span
              key={cat.name}
              className="inline-flex items-center gap-1.5 rounded-lg glass-button px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="#posts"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5"
          >
            开始阅读
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
          <a
            href="/rss"
            className="inline-flex items-center gap-2 rounded-xl glass-button px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12a8 8 0 0 1 8-8 8.5 8.5 0 0 1 7.5 4.75 8 8 0 0 1-4.5 11.25" />
              <path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            RSS
          </a>
        </div>
      </div>
    </section>
  );
}
