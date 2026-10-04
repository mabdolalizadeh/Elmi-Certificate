import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { toPersianDigits, getMonthOrderIndex } from '../utils/excelService';

/**
 * Hybrid Bar + Trend Line (Combo Chart) with Multi-Exam Chronological Timeline
 * 
 * Timeline layout constraint:
 * "The prev exams should be on lefter than new one. Last is the most right and first is the most left in chart."
 * 
 * - Checkpoint 0 (First / Oldest exam): Most Left (minX)
 * - Checkpoint N-1 (Last / Current exam): Most Right (maxX)
 * - Monotone line linking all points chronologically from left to right.
 */
export default function ComboBarLineChart({
  currScore = 0,
  prevScore = 0,
  history = [],
  metricType = 'total', // 'total' | 'math'
  trend = {},
  barColor = '#4F46E5',
  barGradient = ['#3730A3', '#4F46E5'],
  currentMonth = '',
  currentYear = '',
  height = 135,
}) {
  const safeCurr = Math.min(100, Math.max(0, Number(currScore) || 0));
  const safePrev = Math.min(100, Math.max(0, Number(prevScore) || 0));

  // Build clean chronological points list
  let points = [];

  if (Array.isArray(history) && history.length >= 2) {
    // Sort chronologically (earliest to latest)
    const sorted = [...history].sort((a, b) => {
      const yrA = String(a.year || '1405');
      const yrB = String(b.year || '1405');
      const yrComp = yrA.localeCompare(yrB);
      if (yrComp !== 0) return yrComp;
      return getMonthOrderIndex(a.month) - getMonthOrderIndex(b.month);
    });

    points = sorted.map((h, idx) => {
      const rawVal = metricType === 'math' ? h.math : h.total;
      const score = Math.min(100, Math.max(0, Number(rawVal) || 0));
      return {
        label: String(h.month || `آزمون ${toPersianDigits(idx + 1)}`).replace('ماه', ''),
        year: h.year,
        score,
        isLatest: idx === sorted.length - 1,
      };
    });
  } else {
    // 2-point fallback: Previous (left) -> Current (right)
    points = [
      {
        label: 'دوره قبل',
        score: safePrev,
        isLatest: false,
      },
      {
        label: currentMonth ? String(currentMonth).replace('ماه', '') : 'فعلی',
        score: safeCurr,
        isLatest: true,
      },
    ];
  }

  const N = points.length;
  const diff = safeCurr - safePrev;
  const trendLineColor =
    diff > 2 ? '#10B981' : diff < -2 ? '#F43F5E' : '#64748B';

  // SVG Coordinate mapping (ViewBox: 0 0 320 135)
  // Baseline at y = 102, Top max (100%) at y = 24 => Chart height = 78px
  const baselineY = 102;
  const maxBarH = 76;

  // Horizontal distribution:
  // First exam is at minX (Leftmost), Last exam is at maxX (Rightmost)
  const minX = N >= 4 ? 65 : N === 3 ? 75 : 95;
  const maxX = N >= 4 ? 275 : N === 3 ? 260 : 235;
  const barWidth = N >= 4 ? 28 : N === 3 ? 36 : 44;

  const renderedPoints = points.map((p, idx) => {
    const x = N === 1 ? (minX + maxX) / 2 : minX + (idx / (N - 1)) * (maxX - minX);
    const barH = (p.score / 100) * maxBarH;
    const y = baselineY - barH;
    return { ...p, x, y, barH };
  });

  // Build connecting curve path from Left (first) to Right (last)
  let pathD = '';
  if (renderedPoints.length >= 2) {
    pathD = `M ${renderedPoints[0].x} ${renderedPoints[0].y}`;
    for (let i = 0; i < renderedPoints.length - 1; i++) {
      const p0 = renderedPoints[i];
      const p1 = renderedPoints[i + 1];
      const midX = (p0.x + p1.x) / 2;
      pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const gradId = `comboGrad_${metricType}_${barColor.replace('#', '')}`;

  return (
    <Box sx={{ width: '100%', position: 'relative', my: 0.5 }}>
      <svg
        viewBox="0 0 320 135"
        style={{
          width: '100%',
          height: height,
          display: 'block',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barGradient[1]} />
            <stop offset="100%" stopColor={barGradient[0]} />
          </linearGradient>
          <linearGradient id="historyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
          </filter>
        </defs>

        {/* Subtle Horizontal Gridlines & Y-Axis Scale Markers */}
        {[0, 25, 50, 75, 100].map((level) => {
          const yPos = baselineY - (level / 100) * maxBarH;
          return (
            <g key={level}>
              <line
                x1="45"
                y1={yPos}
                x2="285"
                y2={yPos}
                stroke={level === 0 ? '#CBD5E1' : '#E2E8F0'}
                strokeWidth={level === 0 ? '1.5' : '1'}
                strokeDasharray={level === 0 ? 'none' : '3 3'}
              />
              <text
                x="36"
                y={yPos + 3.5}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="9"
                fontWeight="600"
                fontFamily="Vazirmatn, sans-serif"
              >
                {toPersianDigits(level)}
              </text>
            </g>
          );
        })}

        {/* Render Bars Chronologically: Left (Previous) to Right (Last) */}
        {renderedPoints.map((pt, idx) => {
          return (
            <rect
              key={`bar-${idx}`}
              x={pt.x - barWidth / 2}
              y={pt.y}
              width={barWidth}
              height={pt.barH}
              rx={5}
              fill={pt.isLatest ? `url(#${gradId})` : 'url(#historyGrad)'}
              opacity={pt.isLatest ? 1 : 0.82}
            />
          );
        })}

        {/* Overlaid Connecting Trend Line (Left -> Right) */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={trendLineColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Node Circles & Score Values */}
        {renderedPoints.map((pt, idx) => {
          return (
            <g key={`pt-${idx}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.isLatest ? 5.5 : 4.5}
                fill="#FFFFFF"
                stroke={pt.isLatest ? trendLineColor : '#64748B'}
                strokeWidth={pt.isLatest ? 3 : 2.5}
                filter="url(#nodeShadow)"
              />
              <text
                x={pt.x}
                y={Math.max(14, pt.y - 7)}
                textAnchor="middle"
                fill={pt.isLatest ? barColor : '#475569'}
                fontSize={pt.isLatest ? '12' : '10.5'}
                fontWeight={pt.isLatest ? '900' : '800'}
                fontFamily="Vazirmatn, sans-serif"
              >
                ٪{toPersianDigits(pt.score)}
              </text>
              {/* Timeline Tick Month Label on X-Axis */}
              <text
                x={pt.x}
                y={122}
                textAnchor="middle"
                fill={pt.isLatest ? '#1E293B' : '#64748B'}
                fontSize={pt.isLatest ? '10.5' : '9.5'}
                fontWeight={pt.isLatest ? '900' : '700'}
                fontFamily="Vazirmatn, sans-serif"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend & Trend Indicator Strip */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 1,
          pt: 0.5,
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: barColor, borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#1E293B', fontSize: '0.72rem', fontWeight: 800 }}>
              {currentMonth ? `آزمون ${currentMonth}` : 'فعلی (راست)'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: '#94A3B8', borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600 }}>
              سوابق قبلی (چپ)
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.6} alignItems="center">
          <Box
            sx={{
              width: 14,
              height: 3,
              bgcolor: trendLineColor,
              borderRadius: 1,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: trendLineColor,
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
          >
            سیر رشد ({diff > 0 ? `+${toPersianDigits(diff)}` : toPersianDigits(diff)}٪)
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
