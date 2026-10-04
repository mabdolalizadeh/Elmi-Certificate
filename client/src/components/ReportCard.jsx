import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarX2,
  Clock,
  ShieldCheck,
  CheckSquare,
  Award,
  BookOpen,
  Quote,
  Stamp,
  Sparkles,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { getDisciplineStyle, toPersianDigits } from '../utils/excelService';
import {
  DEFAULT_GRADE_CONFIG,
  detectGradeFromClassName,
} from '../utils/gradeConfigService';
import ComboBarLineChart from './ComboBarLineChart';

export default function ReportCard({
  student,
  visibility = {
    academic: true,
    attendance: true,
    discipline: true,
    homework: true,
    advisor: true,
  },
  isPdf = false,
  config = DEFAULT_GRADE_CONFIG,
}) {
  if (!student) return null;

  const disciplineStyle = getDisciplineStyle(student.discipline);

  // Dynamic academic period from Excel month & year or grade config
  const displayPeriod = (student.year && student.month)
    ? `گزارش عملکرد: ${student.month}‌ماه ${toPersianDigits(student.year)}`
    : (student.year || student.month || config.examPeriod || 'گزارش عملکرد: آبان‌ماه ۱۴۰۳');

  // Helper to render trend badge with Persian numbers
  const renderTrendBadge = (trend) => {
    let Icon = Minus;
    if (trend.status === 'improvement') Icon = TrendingUp;
    if (trend.status === 'decline') Icon = TrendingDown;

    const diffAbs = Math.abs(trend.diff);
    const diffSign = trend.diff > 0 ? `+${toPersianDigits(diffAbs)}٪` : trend.diff < 0 ? `-${toPersianDigits(diffAbs)}٪` : `${toPersianDigits(0)}٪`;

    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          px: 1.2,
          py: 0.4,
          borderRadius: 2,
          bgcolor: trend.bgColor,
          color: trend.color,
          border: `1px solid ${trend.color}40`,
          fontWeight: 800,
          fontSize: '0.8rem',
        }}
      >
        <Icon size={14} />
        <span>{trend.label}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>
          ({diffSign})
        </span>
      </Box>
    );
  };

  return (
    <Box
      className="report-card-container"
      sx={{
        width: '100%',
        margin: 0,
        bgcolor: '#FFFFFF',
        borderRadius: isPdf ? 0 : 4,
        border: isPdf ? 'none' : '1.5px solid #CBD5E1',
        boxShadow: isPdf ? 'none' : '0 12px 36px -4px rgba(15, 23, 42, 0.08)',
        p: { xs: 2.5, md: 3.5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: 'always',
        breakAfter: 'page',
        fontFeatureSettings: '"ss01" 1',
      }}
    >
      {/* Decorative Ornate Golden-Indigo Top Border */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          background: 'linear-gradient(90deg, #312E81 0%, #4F46E5 25%, #F59E0B 50%, #10B981 75%, #059669 100%)',
        }}
      />

      {/* Decorative Background Watermark */}
      {config.watermark?.enabled ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${config.watermark.rotation ?? -25}deg)`,
            opacity: config.watermark.opacity ?? 0.08,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {config.watermark.type === 'logo' && (config.watermark.logoUrl || config.logoUrl) ? (
            <Box
              component="img"
              src={config.watermark.logoUrl || config.logoUrl}
              alt="Watermark Logo"
              sx={{
                maxWidth: '52%',
                maxHeight: '52%',
                objectFit: 'contain',
                filter: 'grayscale(100%)',
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: { xs: '3rem', md: '5.2rem' },
                fontWeight: 900,
                color: '#1E1B4B',
                whiteSpace: 'nowrap',
                letterSpacing: '8px',
                textAlign: 'center',
              }}
            >
              {config.watermark.text || 'کارنامه رسمی و محرمانه'}
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.025,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          <Award size={480} color="#000000" />
        </Box>
      )}

      {/* ================= REDESIGNED HEADER ================= */}
      <Box
        sx={{
          borderBottom: '2px solid #E2E8F0',
          pb: 2.2,
          mb: 2.5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Right side: School Crest/Logo & School Name */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              flexDirection: config.logoAlignment === 'left' ? 'row-reverse' : 'row',
            }}
          >
            {/* Custom or Default Logo */}
            {config.logoUrl ? (
              <Box
                component="img"
                src={config.logoUrl}
                alt="School Logo"
                sx={{
                  height: config.logoSize || 54,
                  maxWidth: (config.logoSize || 54) * 1.6,
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: config.logoSize || 54,
                  height: config.logoSize || 54,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
                  color: '#FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(49, 46, 129, 0.25)',
                  border: '2px solid #E0E7FF',
                  flexShrink: 0,
                }}
              >
                <Award size={Math.round((config.logoSize || 54) * 0.6)} />
              </Box>
            )}

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E1B4B', fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
                  {config.title || 'مجتمع آموزشی و دبیرستان نمونه رشد'}
                </Typography>
                <Chip
                  label={detectGradeFromClassName(student.className) || 'پایه هفتم'}
                  size="small"
                  sx={{
                    bgcolor: '#EEF2FF',
                    color: '#4338CA',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    height: 22,
                    border: '1px solid #C7D2FE',
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.84rem', mt: 0.3 }}>
                {config.subtitle || 'کارنامه رسمی عملکرد تحصیلی، رفتار کلاسی و تحلیل رشد مستمر دانش‌آموز'}
              </Typography>
            </Box>
          </Stack>

          {/* Left side: Student Name & Academic Metadata */}
          <Box
            sx={{
              textAlign: 'left',
              bgcolor: '#F8FAFC',
              px: 2.5,
              py: 1.2,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
            }}
          >
            <Typography variant="caption" sx={{ color: '#4F46E5', display: 'block', fontSize: '0.8rem', fontWeight: 800 }}>
              {displayPeriod}
            </Typography>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mt: 0.4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.15rem' }}>
                {student.name}
              </Typography>
              <Chip
                label={`کلاس ${student.className}`}
                size="small"
                sx={{
                  bgcolor: '#4F46E5',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  height: 24,
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* ================= 3-COLUMN CONTENT BODY ================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr 1.05fr' },
          gap: 2.2,
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ================= RIGHT COLUMN: ACADEMIC PERFORMANCE (BULLET TARGET CHARTS) ================= */}
        {visibility.academic && (
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              borderRadius: 3.5,
              p: 2.4,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Column Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Box
                  sx={{
                    p: 0.9,
                    borderRadius: 2.2,
                    bgcolor: '#EEF2FF',
                    color: '#4F46E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '0.98rem' }}>
                    تحلیل مقایسه‌ای نمرات و آزمون‌ها
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.74rem' }}>
                    نمودار ترکیبی میله‌ای و خط سیر رشد مقایسه‌ای
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Total Exam Score - Combo Bar + Line Card */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 2,
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header & Badges */}
              <Box sx={{ mb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>
                    درصد آزمون جامع (میانگین کل)
                  </Typography>
                  {renderTrendBadge(student.overallTrend)}
                </Stack>

                <Stack direction="row" alignItems="baseline" spacing={1.5}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#4F46E5', fontSize: '1.75rem', lineHeight: 1 }}>
                    ٪{toPersianDigits(student.currTotal)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.8rem' }}>
                    دوره قبلی: ٪{toPersianDigits(student.prevTotal)}
                  </Typography>
                </Stack>
              </Box>

              {/* Combo Bar + Line Chart */}
              <ComboBarLineChart
                currScore={student.currTotal}
                prevScore={student.prevTotal}
                history={student.history}
                metricType="total"
                trend={student.overallTrend}
                barColor="#4F46E5"
                barGradient={['#3730A3', '#4F46E5']}
                currentMonth={student.month}
                currentYear={student.year}
                height={125}
              />
            </Box>

            {/* Math Score - Combo Bar + Line Card */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 2,
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header & Badges */}
              <Box sx={{ mb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>
                    درصد درس ریاضی (تخصصی)
                  </Typography>
                  {renderTrendBadge(student.mathTrend)}
                </Stack>

                <Stack direction="row" alignItems="baseline" spacing={1.5}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0284C7', fontSize: '1.75rem', lineHeight: 1 }}>
                    ٪{toPersianDigits(student.currMath)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.8rem' }}>
                    دوره قبلی: ٪{toPersianDigits(student.prevMath)}
                  </Typography>
                </Stack>
              </Box>

              {/* Combo Bar + Line Chart */}
              <ComboBarLineChart
                currScore={student.currMath}
                prevScore={student.prevMath}
                history={student.history}
                metricType="math"
                trend={student.mathTrend}
                barColor="#0284C7"
                barGradient={['#0369A1', '#0EA5E9']}
                currentMonth={student.month}
                currentYear={student.year}
                height={125}
              />
            </Box>
          </Box>
        )}

        {/* ================= CENTER COLUMN: BEHAVIORAL, ATTENDANCE & RADIAL HOMEWORK GAUGE ================= */}
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            borderRadius: 3.5,
            p: 2.4,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                p: 0.9,
                borderRadius: 2.2,
                bgcolor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '0.98rem' }}>
                انضباط، تکالیف و شاخص‌های حضور
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.74rem' }}>
                سنجش رفتاری و پیگیری هفتگی دانش‌آموز
              </Typography>
            </Box>
          </Stack>

          {/* Attendance Metrics */}
          {visibility.attendance && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Absences Card */}
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 1.8,
                  border: '1.5px solid #FEE2E2',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    bgcolor: '#FEF2F2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #FECACA',
                  }}
                >
                  <CalendarX2 size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block' }}>
                    میزان غیبت‌ها
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '1.35rem', lineHeight: 1.1 }}>
                    {toPersianDigits(student.absences)}
                    <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.6, fontSize: '0.78rem', fontWeight: 600 }}>
                      روز
                    </Typography>
                  </Typography>
                </Box>
              </Box>

              {/* Tardies Card */}
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 1.8,
                  border: '1.5px solid #FEF3C7',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    bgcolor: '#FFFBEB',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #FDE68A',
                  }}
                >
                  <Clock size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block' }}>
                    تعداد تاخیرها
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '1.35rem', lineHeight: 1.1 }}>
                    {toPersianDigits(student.tardies)}
                    <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.6, fontSize: '0.78rem', fontWeight: 600 }}>
                      مورد
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* 4-Segment Qualitative Discipline Meter */}
          {visibility.discipline && (() => {
            const levels = [
              { key: 'ضعیف', label: 'ضعیف', lvl: 1, activeColor: '#EF4444', activeBg: '#FEE2E2', activeBorder: '#FCA5A5' },
              { key: 'نیاز به توجه', label: 'نیاز به توجه', lvl: 2, activeColor: '#F59E0B', activeBg: '#FEF3C7', activeBorder: '#FCD34D' },
              { key: 'خوب', label: 'خوب', lvl: 3, activeColor: '#3B82F6', activeBg: '#DBEAFE', activeBorder: '#93C5FD' },
              { key: 'عالی', label: 'عالی', lvl: 4, activeColor: '#10B981', activeBg: '#D1FAE5', activeBorder: '#6EE7B7' },
            ];

            const currentLevelMap = {
              'ضعیف': 1,
              'نیاز به توجه': 2,
              'خوب': 3,
              'عالی': 4,
            };
            const studentLvl = currentLevelMap[student.discipline] || 3;

            return (
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 2,
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.86rem' }}>
                    درجه‌بندی انضباط کلاسی
                  </Typography>
                  <Chip
                    label={`رتبه فعلی: ${student.discipline}`}
                    size="small"
                    sx={{
                      bgcolor: disciplineStyle.bg,
                      color: disciplineStyle.color,
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      border: `1px solid ${disciplineStyle.border}`,
                    }}
                  />
                </Stack>

                {/* 4 Qualitative Segmented Pills */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.8 }}>
                  {levels.map((seg) => {
                    const isLit = seg.lvl <= studentLvl;
                    const isCurrent = seg.lvl === studentLvl;

                    return (
                      <Box
                        key={seg.key}
                        sx={{
                          py: 1,
                          px: 0.5,
                          borderRadius: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          bgcolor: isCurrent ? seg.activeColor : isLit ? seg.activeBg : '#F1F5F9',
                          color: isCurrent ? '#FFFFFF' : isLit ? seg.activeColor : '#94A3B8',
                          border: isCurrent
                            ? `1.5px solid ${seg.activeColor}`
                            : isLit
                            ? `1.5px solid ${seg.activeBorder}`
                            : '1.5px solid #E2E8F0',
                          boxShadow: isCurrent ? `0 4px 12px ${seg.activeColor}40` : 'none',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontWeight: isCurrent ? 900 : 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {seg.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })()}

          {/* Semi-Donut / Radial Speedometer Homework Gauge */}
          {visibility.homework && (() => {
            const rate = student.homeworkRate;
            const gaugeColor = rate >= 80 ? '#10B981' : rate >= 60 ? '#F59E0B' : '#F43F5E';
            const gaugeColorEnd = rate >= 80 ? '#059669' : rate >= 60 ? '#D97706' : '#DC2626';

            // Arch circumference for R=54 is ~169.65
            const archLength = 169.65;
            const strokeOffset = archLength - (archLength * Math.min(100, Math.max(0, rate))) / 100;

            return (
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 2,
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.86rem' }}>
                    شاخص تحویل تکالیف آموزشی
                  </Typography>
                  <Typography variant="caption" sx={{ color: gaugeColor, fontWeight: 800, fontSize: '0.8rem' }}>
                    {rate >= 80 ? 'بسیار مطلوب' : rate >= 60 ? 'متوسط' : 'نیاز به پیگیری'}
                  </Typography>
                </Stack>

                {/* 180-Degree Semi-Donut SVG Gauge */}
                <Box sx={{ width: '100%', maxWidth: 220, position: 'relative', my: 0.5 }}>
                  <svg viewBox="0 0 140 85" style={{ width: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="hwSemiGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gaugeColor} />
                        <stop offset="100%" stopColor={gaugeColorEnd} />
                      </linearGradient>
                    </defs>

                    {/* Background Arch */}
                    <path
                      d="M 16 72 A 54 54 0 0 1 124 72"
                      fill="none"
                      stroke="#F1F5F9"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />

                    {/* Active Foreground Arch */}
                    <path
                      d="M 16 72 A 54 54 0 0 1 124 72"
                      fill="none"
                      stroke="url(#hwSemiGaugeGrad)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray={archLength}
                      strokeDashoffset={strokeOffset}
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />

                    {/* Center Percentage Display */}
                    <text
                      x="70"
                      y="64"
                      textAnchor="middle"
                      fill="#1E1B4B"
                      fontSize="24"
                      fontWeight="900"
                      fontFamily="Vazirmatn, sans-serif"
                    >
                      ٪{toPersianDigits(rate)}
                    </text>
                  </svg>

                  {/* Subtitle count below gauge */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#64748B',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      mt: -0.5,
                    }}
                  >
                    {toPersianDigits(student.homeworkSubmitted)} از {toPersianDigits(student.homeworkTotal)} تکلیف تحویل شده
                  </Typography>
                </Box>
              </Box>
            );
          })()}
        </Box>

        {/* ================= LEFT COLUMN: COMPACT ADVISOR NOTE & EXPANDED SIGNATURE ================= */}
        {visibility.advisor && (
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              borderRadius: 3.5,
              p: 2.4,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  p: 0.9,
                  borderRadius: 2.2,
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Quote size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '0.98rem' }}>
                  توصیه مشاور و تایید نهایی
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.74rem' }}>
                  بازخورد کیفی و امضای مسئولین آموزشی
                </Typography>
              </Box>
            </Stack>

            {/* Compact Advisor Note (Top Section) */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 1.8,
                border: '1.5px solid #FDE68A',
                borderRight: '5px solid #F59E0B',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.8,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#B45309', fontSize: '0.76rem' }}>
                  نظر کارشناسی مشاور تحصیلی:
                </Typography>
                <Chip
                  label="راهبرد دوره بعدی"
                  size="small"
                  sx={{
                    bgcolor: '#FEF3C7',
                    color: '#92400E',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    height: 20,
                  }}
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: '#334155',
                  lineHeight: 1.65,
                  fontSize: '0.82rem',
                  fontStyle: 'italic',
                }}
              >
                «{student.advisorNote || 'ارزیابی مستمر دانش‌آموز نشان‌دهنده نیاز به تمرکز بیشتر بر تعهد به برنامه‌ریزی هفتگی و تقویت دروس تخصصی است.'}»
              </Typography>
            </Box>

            {/* Expanded Official Signature Area (Bottom Section - No Stamp, Generous Signing Space) */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 2.2,
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Status & Verification Top Info */}
              <Stack direction="row" alignItems="center">
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <FileCheck size={16} color="#4F46E5" />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.8rem' }}>
                    تاییدیه رسمی شورای آموزشی مدرسه
                  </Typography>
                </Stack>
              </Stack>

              {/* Dual Designated Signature Zones - Two Squares Side-by-Side */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, my: 1, flex: 1 }}>
                {/* Counselor Signature Square Box */}
                <Box
                  sx={{
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    p: 1.5,
                    border: '1.5px dashed #CBD5E1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 105,
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B', display: 'block', fontSize: '0.78rem' }}>
                      محل امضای مشاور
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', display: 'block', mt: 0.2 }}>
                      {config.title || 'مشاور تحصیلی پایه'}
                    </Typography>
                  </Box>

                  {/* Clean Designated Signing Space */}
                  <Box
                    sx={{
                      width: '85%',
                      borderBottom: '1.5px dashed #94A3B8',
                      mb: 1,
                    }}
                  />
                </Box>

                {/* Principal Signature Square Box */}
                <Box
                  sx={{
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    p: 1.5,
                    border: '1.5px dashed #CBD5E1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 105,
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B', display: 'block', fontSize: '0.78rem' }}>
                      محل امضای مدیریت
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', display: 'block', mt: 0.2 }}>
                      تایید نهایی و صدور کارنامه
                    </Typography>
                  </Box>

                  {/* Clean Designated Signing Space */}
                  <Box
                    sx={{
                      width: '85%',
                      borderBottom: '1.5px dashed #94A3B8',
                      mb: 1,
                    }}
                  />
                </Box>
              </Box>

         
            </Box>
          </Box>
        )}
      </Box>

      {/* ================= FOOTER TIMESTAMP & VERIFICATION ================= */}
      <Box
        sx={{
          borderTop: '1px solid #E2E8F0',
          pt: 1.5,
          mt: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
            تاریخ صدور: {displayPeriod} • صفحه ۱ از ۱
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
