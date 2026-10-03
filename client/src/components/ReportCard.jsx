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
} from 'lucide-react';
import { getDisciplineStyle } from '../utils/excelService';

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
}) {
  if (!student) return null;

  const disciplineStyle = getDisciplineStyle(student.discipline);

  // Helper to render trend badge
  const renderTrendBadge = (trend) => {
    let Icon = Minus;
    if (trend.status === 'improvement') Icon = TrendingUp;
    if (trend.status === 'decline') Icon = TrendingDown;

    const diffSign = trend.diff > 0 ? `+${trend.diff}%` : `${trend.diff}%`;

    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          px: 1.2,
          py: 0.4,
          borderRadius: 1.5,
          bgcolor: trend.bgColor,
          color: trend.color,
          border: `1px solid ${trend.color}33`,
          fontWeight: 700,
          fontSize: '0.8rem',
        }}
      >
        <Icon size={14} />
        <span>{trend.label}</span>
        <span style={{ direction: 'ltr', fontSize: '0.75rem', opacity: 0.9 }}>
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
        maxWidth: 1080,
        margin: '0 auto',
        aspectRatio: isPdf ? 'unset' : '1.414 / 1', // A4 Landscape ratio
        bgcolor: '#FFFFFF',
        borderRadius: isPdf ? 0 : 3.5,
        border: isPdf ? 'none' : '1px solid #CBD5E1',
        boxShadow: isPdf ? 'none' : '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
        p: { xs: 2.5, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: 'always',
        breakAfter: 'page',
      }}
    >
      {/* Decorative top border strip */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #4F46E5 0%, #0EA5E9 50%, #10B981 100%)',
        }}
      />

      {/* ================= HEADER SECTION ================= */}
      <Box
        sx={{
          borderBottom: '2px solid #E2E8F0',
          pb: 2,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Right side: School Crest & School Name */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #C7D2FE',
              }}
            >
              <Award size={28} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1B4B', fontSize: '1.15rem' }}>
                مجتمع آموزشی و دبیرستان نمونه رشد
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.82rem' }}>
                کارنامه عملکرد تحصیلی، انضباطی و تحلیل رشد مستمر
              </Typography>
            </Box>
          </Stack>

          {/* Student Profile Overview */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'left', pl: 1 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.72rem' }}>
                سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                  {student.name}
                </Typography>
                <Chip
                  label={student.className}
                  size="small"
                  sx={{
                    bgcolor: '#EEF2FF',
                    color: '#4338CA',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    height: 24,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* ================= 3-COLUMN CONTENT BODY ================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1.1fr' },
          gap: 2.2,
          flex: 1,
        }}
      >
        {/* ================= RIGHT COLUMN: ACADEMIC PERFORMANCE ================= */}
        {visibility.academic && (
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              borderRadius: 3,
              p: 2,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <BookOpen size={18} color="#4F46E5" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>
                تحلیل وضعیت آموزشی و روند نمرات
              </Typography>
            </Stack>

            {/* Total Score Comparison */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.8,
                border: '1px solid #E2E8F0',
                mb: 1.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>
                  میانگین درصد کل دروس
                </Typography>
                {renderTrendBadge(student.overallTrend)}
              </Stack>

              {/* Comparative Visual Bars */}
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    دوره فعلی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#4F46E5' }}>
                    %{student.currTotal}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.currTotal))}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0E7FF',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #6366F1, #4F46E5)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    دوره قبلی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                    %{student.prevTotal}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.prevTotal))}
                  sx={{
                    height: 6,
                    borderRadius: 4,
                    bgcolor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#94A3B8',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Math Score Comparison */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.8,
                border: '1px solid #E2E8F0',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>
                  عملکرد تخصصی درس ریاضی
                </Typography>
                {renderTrendBadge(student.mathTrend)}
              </Stack>

              {/* Comparative Visual Bars */}
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    درصد فعلی ریاضی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0EA5E9' }}>
                    %{student.currMath}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.currMath))}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0F2FE',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    درصد قبلی ریاضی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                    %{student.prevMath}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.prevMath))}
                  sx={{
                    height: 6,
                    borderRadius: 4,
                    bgcolor: '#F1F5F9',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#94A3B8',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* ================= CENTER COLUMN: BEHAVIORAL & ATTENDANCE ================= */}
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            borderRadius: 3,
            p: 2,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <ShieldCheck size={18} color="#059669" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>
              انضباط، تکالیف و حضور و غیاب
            </Typography>
          </Stack>

          {/* Attendance Cards */}
          {visibility.attendance && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2, mb: 1.5 }}>
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 2.5,
                  p: 1.4,
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.6} sx={{ mb: 0.5 }}>
                  <CalendarX2 size={16} color="#DC2626" />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    غیبت‌ها
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '1.25rem' }}>
                  {student.absences}
                  <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.5 }}>
                    روز
                  </Typography>
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 2.5,
                  p: 1.4,
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.6} sx={{ mb: 0.5 }}>
                  <Clock size={16} color="#D97706" />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    تاخیرها
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '1.25rem' }}>
                  {student.tardies}
                  <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.5 }}>
                    مورد
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )}

          {/* Discipline Status */}
          {visibility.discipline && (
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.5,
                border: '1px solid #E2E8F0',
                mb: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.8, fontWeight: 600 }}>
                ارزیابی انضباط و رفتار کلاسی
              </Typography>
              <Box
                sx={{
                  bgcolor: disciplineStyle.bg,
                  color: disciplineStyle.color,
                  border: `1px solid ${disciplineStyle.border}`,
                  py: 0.8,
                  px: 1.5,
                  borderRadius: 2,
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                }}
              >
                وضعیت: {disciplineStyle.label}
              </Box>
            </Box>
          )}

          {/* Homework Delivery Rate */}
          {visibility.homework && (
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.5,
                border: '1px solid #E2E8F0',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  <CheckSquare size={15} color="#4F46E5" />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                    نرخ تحویل تکالیف
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#4F46E5' }}>
                  {student.homeworkSubmitted} از {student.homeworkTotal} (%{student.homeworkRate})
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={student.homeworkRate}
                sx={{
                  height: 9,
                  borderRadius: 4.5,
                  bgcolor: '#EEF2FF',
                  '& .MuiLinearProgress-bar': {
                    background:
                      student.homeworkRate >= 80
                        ? 'linear-gradient(90deg, #10B981, #059669)'
                        : student.homeworkRate >= 60
                        ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                        : 'linear-gradient(90deg, #F43F5E, #E11D48)',
                    borderRadius: 4.5,
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* ================= LEFT COLUMN: ADVISOR & SIGNATURE ================= */}
        {visibility.advisor && (
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              borderRadius: 3,
              p: 2,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
              <Quote size={18} color="#D97706" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>
                نظر و راهکار مشاوره تحصیلی
              </Typography>
            </Stack>

            {/* Advisor Note Quote Card */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.8,
                border: '1px solid #E2E8F0',
                borderRight: '4px solid #F59E0B',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#334155',
                  lineHeight: 1.7,
                  fontSize: '0.82rem',
                  fontStyle: 'italic',
                }}
              >
                «{student.advisorNote || 'ارزیابی مستمر دانش‌آموز نشان‌دهنده نیاز به تمرکز بیشتر بر تعهد به برنامه‌ریزی هفتگی و تقویت دروس تخصصی است.'}»
              </Typography>
            </Box>

            {/* Counselor Signature & Stamp Area */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                p: 1.5,
                border: '1px dashed #CBD5E1',
                textAlign: 'center',
              }}
            >
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                    مهر و امضای مشاور
                  </Typography>
                  <Box
                    sx={{
                      width: 60,
                      height: 32,
                      border: '1px dashed #E2E8F0',
                      borderRadius: 1.5,
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#CBD5E1',
                    }}
                  >
                    <Stamp size={18} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                    امضای معاونت آموزشی
                  </Typography>
                  <Box
                    sx={{
                      width: 60,
                      height: 32,
                      border: '1px dashed #E2E8F0',
                      borderRadius: 1.5,
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#CBD5E1',
                    }}
                  >
                    <Award size={18} />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>

      {/* ================= FOOTER TIMESTAMP & VERIFICATION ================= */}
      <Box
        sx={{
          borderTop: '1px solid #F1F5F9',
          pt: 1.2,
          mt: 1.5,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
            کد یکتای پرونده: ELMI-{student.id?.toUpperCase() || 'STD01'} • ثبت شده در سامانه یکپارچه رشد
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
            تاریخ صدور: مهرماه ۱۴۰۵ • صفحه ۱ از ۱
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
