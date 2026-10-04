import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { toPersianDigits } from '../utils/excelService';

/**
 * Hybrid Bar + Trend Line (Combo Chart)
 * Renders dual comparative bars (Previous vs Current) with an overlaid
 * monotone connecting trend line and circular node markers.
 */
export default function ComboBarLineChart({
  currScore = 0,
  prevScore = 0,
  trend = {},
  barColor = '#4F46E5',
  barGradient = ['#4338CA', '#4F46E5'],
  height = 135,
}) {
  const safeCurr = Math.min(100, Math.max(0, Number(currScore) || 0));
  const safePrev = Math.min(100, Math.max(0, Number(prevScore) || 0));
  const diff = safeCurr - safePrev;

  // Trend line stroke color
  const trendLineColor =
    diff > 2 ? '#10B981' : diff < -2 ? '#F43F5E' : '#64748B';

  // SVG Coordinate mapping (ViewBox: 0 0 320 135)
  // Baseline at y = 104, Top max (100%) at y = 22 => Chart height = 82px
  const baselineY = 104;
  const maxBarH = 78;

  const prevBarH = (safePrev / 100) * maxBarH;
  const prevY = baselineY - prevBarH;

  const currBarH = (safeCurr / 100) * maxBarH;
  const currY = baselineY - currBarH;

  // Bar centers (RTL layout: Previous on right, Current on left)
  const prevX = 215;
  const currX = 95;
  const barWidth = 44;

  // Monotone bezier curve control points
  const midX = (prevX + currX) / 2;
  const pathD = `M ${prevX} ${prevY} C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;

  const gradId = `comboGrad_${barColor.replace('#', '')}`;

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
          <linearGradient id="prevGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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
                x2="275"
                y2={yPos}
                stroke={level === 0 ? '#CBD5E1' : '#E2E8F0'}
                strokeWidth={level === 0 ? '1.5' : '1'}
                strokeDasharray={level === 0 ? 'none' : '3 3'}
              />
              <text
                x="35"
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

        {/* Bar 1: Previous Exam (آزمون قبلی) */}
        <rect
          x={prevX - barWidth / 2}
          y={prevY}
          width={barWidth}
          height={prevBarH}
          rx={5}
          fill="url(#prevGrad)"
          opacity={0.88}
        />

        {/* Bar 2: Current Exam (آزمون فعلی) */}
        <rect
          x={currX - barWidth / 2}
          y={currY}
          width={barWidth}
          height={currBarH}
          rx={5}
          fill={`url(#${gradId})`}
        />

        {/* Overlaid Monotone Connecting Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke={trendLineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="none"
        />

        {/* Node Circle 1 (Previous Score) */}
        <circle
          cx={prevX}
          cy={prevY}
          r="5"
          fill="#FFFFFF"
          stroke="#64748B"
          strokeWidth="2.5"
          filter="url(#nodeShadow)"
        />

        {/* Node Circle 2 (Current Score) */}
        <circle
          cx={currX}
          cy={currY}
          r="5.5"
          fill="#FFFFFF"
          stroke={trendLineColor}
          strokeWidth="3"
          filter="url(#nodeShadow)"
        />

        {/* Score Value Labels on Top of Bars */}
        <text
          x={prevX}
          y={Math.max(14, prevY - 7)}
          textAnchor="middle"
          fill="#475569"
          fontSize="11.5"
          fontWeight="800"
          fontFamily="Vazirmatn, sans-serif"
        >
          ٪{toPersianDigits(safePrev)}
        </text>

        <text
          x={currX}
          y={Math.max(14, currY - 7)}
          textAnchor="middle"
          fill={barColor}
          fontSize="12.5"
          fontWeight="900"
          fontFamily="Vazirmatn, sans-serif"
        >
          ٪{toPersianDigits(safeCurr)}
        </text>

        {/* X-Axis Category Labels */}
        <text
          x={prevX}
          y={122}
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontWeight="700"
          fontFamily="Vazirmatn, sans-serif"
        >
          آزمون قبلی
        </text>

        <text
          x={currX}
          y={122}
          textAnchor="middle"
          fill="#1E293B"
          fontSize="10.5"
          fontWeight="800"
          fontFamily="Vazirmatn, sans-serif"
        >
          آزمون فعلی
        </text>
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
            <Typography variant="caption" sx={{ color: '#1E293B', fontSize: '0.72rem', fontWeight: 700 }}>
              فعلی
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: '#94A3B8', borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600 }}>
              قبلی
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
            خط سیر رشد
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
