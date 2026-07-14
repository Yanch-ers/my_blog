import { useState, useMemo } from 'react';

interface ContributionGraphProps {
  dates: string[]; // ISO date strings of article publication dates
}

interface DayData {
  date: Date;
  dateStr: string;
  count: number;
}

const LEVEL_COLORS_LIGHT = [
  'rgba(229, 231, 235, 0.4)', // 0 - empty
  'rgba(16, 185, 129, 0.25)',  // 1
  'rgba(16, 185, 129, 0.45)',  // 2
  'rgba(16, 185, 129, 0.65)',  // 3
  'rgba(16, 185, 129, 0.85)',  // 4+
];

const LEVEL_COLORS_DARK = [
  'rgba(255, 255, 255, 0.06)', // 0 - empty
  'rgba(16, 185, 129, 0.3)',   // 1
  'rgba(16, 185, 129, 0.5)',   // 2
  'rgba(16, 185, 129, 0.7)',   // 3
  'rgba(16, 185, 129, 0.9)',   // 4+
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export default function ContributionGraph({ dates }: ContributionGraphProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Extract available years from dates
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    for (const d of dates) {
      const year = new Date(d).getFullYear();
      if (year >= 2020 && year <= currentYear) {
        years.add(year);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [dates]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0] ?? new Date().getFullYear());

  const { weeks, totalContributions, monthLabels, yearTotal } = useMemo(() => {
    // Count articles per day
    const countMap = new Map<string, number>();
    for (const d of dates) {
      const key = d.slice(0, 10); // YYYY-MM-DD
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
    }

    // Build grid for selected year (Jan 1 - Dec 31, aligned to Sunday start)
    const yearStart = new Date(selectedYear, 0, 1);
    // Align to previous Sunday
    yearStart.setDate(yearStart.getDate() - yearStart.getDay());

    const yearEnd = new Date(selectedYear, 11, 31);
    // Calculate number of weeks needed
    const totalDays = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const numWeeks = Math.ceil(totalDays / 7);

    const weeks: DayData[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let currentMonth = -1;
    let yearTotal = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let w = 0; w < numWeeks; w++) {
      const week: DayData[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(yearStart);
        date.setDate(yearStart.getDate() + w * 7 + d);

        // Skip future dates
        if (date > today) {
          week.push({ date, dateStr: '', count: 0 });
          continue;
        }

        // Only include dates within the selected year
        if (date.getFullYear() !== selectedYear) {
          week.push({ date, dateStr: '', count: 0 });
          continue;
        }

        const dateStr = date.toISOString().slice(0, 10);
        const count = countMap.get(dateStr) ?? 0;
        yearTotal += count;
        week.push({ date, dateStr, count });

        // Track month labels
        if (date.getMonth() !== currentMonth && d === 0) {
          currentMonth = date.getMonth();
          monthLabels.push({ label: MONTH_NAMES[currentMonth], col: w });
        }
      }
      weeks.push(week);
    }

    return { weeks, totalContributions: yearTotal, monthLabels, yearTotal };
  }, [dates, selectedYear]);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDark ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          写作日历
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            {selectedYear} 年共 <span className="font-semibold text-[var(--color-accent)]">{yearTotal}</span> 篇文章
          </span>
          {/* Year selector */}
          <div className="flex gap-1">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  year === selectedYear
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col">
          {/* Month labels row */}
          <div className="flex ml-8 mb-1">
            {weeks.map((_, w) => {
              const label = monthLabels.find((m) => m.col === w);
              return (
                <div key={w} className="w-[11px] mx-[1px] text-[9px] text-[var(--color-text-muted)]">
                  {label ? label.label : ''}
                </div>
              );
            })}
          </div>

          {/* Grid rows */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-1">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-[11px] my-[1px] flex items-center text-[9px] text-[var(--color-text-muted)] leading-none">
                  {label}
                </div>
              ))}
            </div>

            {/* Contribution cells */}
            <div className="flex">
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col mx-[1px]">
                  {week.map((day, d) => {
                    const level = getLevel(day.count);
                    const isFuture = !day.dateStr;
                    return (
                      <div
                        key={`${w}-${d}`}
                        className="w-[11px] h-[11px] my-[1px] rounded-[2px] transition-colors duration-150"
                        style={{
                          backgroundColor: isFuture ? 'transparent' : colors[level],
                          cursor: isFuture ? 'default' : 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          if (isFuture) return;
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          const text = day.count === 0
                            ? `No articles on ${formatDate(day.date)}`
                            : `${day.count} article${day.count > 1 ? 's' : ''} on ${formatDate(day.date)}`;
                          setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[9px] text-[var(--color-text-muted)]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-[11px] h-[11px] rounded-[2px]"
                style={{ backgroundColor: colors[level] }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[100] px-2.5 py-1.5 rounded-lg text-xs font-medium pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: 'translateX(-50%)',
            backgroundColor: isDark ? '#1a2e1a' : '#ffffff',
            color: isDark ? '#e2f0e2' : '#1a2e1a',
            border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
