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

      {/* Decorative Watermark Emblem in Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.025,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <Award size={480} color="#000000" />
      </Box>

      {/* ================= REDESIGNED HEADER ================= */}
      <Box
        sx={{
          borderBottom: '2px solid #E2E8F0',
          pb: 2.2,
          mb: 2.5,
          position: 'relative',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Right side: School Crest & School Name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
                color: '#FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(49, 46, 129, 0.25)',
                border: '2px solid #E0E7FF',
              }}
            >
              <Award size={32} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E1B4B', fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
                  مجتمع آموزشی و دبیرستان نمونه رشد
                </Typography>
                <Chip
                  label="پایه هفتم"
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
                کارنامه رسمی عملکرد تحصیلی، رفتار کلاسی و تحلیل رشد مستمر دانش‌آموز
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
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
              سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم
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
        }}
      >
        {/* ================= RIGHT COLUMN: ACADEMIC PERFORMANCE ================= */}
        {visibility.academic && (
          <Box
            sx={{
              bgcolor: '#F8FAFC',
              borderRadius: 3.5,
              p: 2.2,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.8 }}>
              <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: '#EEF2FF', color: '#4F46E5' }}>
                <BookOpen size={18} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>
                تحلیل وضعیت آموزشی و روند نمرات
              </Typography>
            </Stack>

            {/* Total Score Comparison */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 2,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                mb: 1.8,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.86rem' }}>
                  میانگین درصد کل دروس
                </Typography>
                {renderTrendBadge(student.overallTrend)}
              </Stack>

              {/* Comparative Visual Bars */}
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    دوره فعلی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#4F46E5', fontSize: '0.9rem' }}>
                    ٪{toPersianDigits(student.currTotal)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.currTotal))}
                  sx={{
                    height: 9,
                    borderRadius: 4.5,
                    bgcolor: '#E0E7FF',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #6366F1, #4F46E5)',
                      borderRadius: 4.5,
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    دوره قبلی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.85rem' }}>
                    ٪{toPersianDigits(student.prevTotal)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.prevTotal))}
                  sx={{
                    height: 7,
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
                borderRadius: 3,
                p: 2,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.86rem' }}>
                  عملکرد تخصصی درس ریاضی
                </Typography>
                {renderTrendBadge(student.mathTrend)}
              </Stack>

              {/* Comparative Visual Bars */}
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    درصد فعلی ریاضی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#0284C7', fontSize: '0.9rem' }}>
                    ٪{toPersianDigits(student.currMath)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.currMath))}
                  sx={{
                    height: 9,
                    borderRadius: 4.5,
                    bgcolor: '#E0F2FE',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                      borderRadius: 4.5,
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    درصد قبلی ریاضی
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', fontSize: '0.85rem' }}>
                    ٪{toPersianDigits(student.prevMath)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, student.prevMath))}
                  sx={{
                    height: 7,
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
            borderRadius: 3.5,
            p: 2.2,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.8 }}>
            <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: '#ECFDF5', color: '#059669' }}>
              <ShieldCheck size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>
              انضباط، تکالیف و حضور و غیاب
            </Typography>
          </Stack>

          {/* Attendance Cards */}
          {visibility.attendance && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.8 }}>
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 1.6,
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                }}
              >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.6} sx={{ mb: 0.6 }}>
                  <CalendarX2 size={16} color="#DC2626" />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                    غیبت‌ها
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '1.4rem' }}>
                  {toPersianDigits(student.absences)}
                  <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.6, fontSize: '0.8rem' }}>
                    روز
                  </Typography>
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 1.6,
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                }}
              >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.6} sx={{ mb: 0.6 }}>
                  <Clock size={16} color="#D97706" />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                    تاخیرها
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', fontSize: '1.4rem' }}>
                  {toPersianDigits(student.tardies)}
                  <Typography component="span" variant="caption" sx={{ color: '#94A3B8', mr: 0.6, fontSize: '0.8rem' }}>
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
                borderRadius: 3,
                p: 1.8,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                mb: 1.8,
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.8, fontWeight: 700 }}>
                ارزیابی انضباط و رفتار کلاسی
              </Typography>
              <Box
                sx={{
                  bgcolor: disciplineStyle.bg,
                  color: disciplineStyle.color,
                  border: `1.5px solid ${disciplineStyle.border}`,
                  py: 1,
                  px: 1.5,
                  borderRadius: 2.5,
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '0.96rem',
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
                borderRadius: 3,
                p: 1.8,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <CheckSquare size={16} color="#4F46E5" />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155' }}>
                    نرخ تحویل تکالیف
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#4F46E5', fontSize: '0.88rem' }}>
                  {toPersianDigits(student.homeworkSubmitted)} از {toPersianDigits(student.homeworkTotal)} (٪{toPersianDigits(student.homeworkRate)})
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={student.homeworkRate}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: '#EEF2FF',
                  '& .MuiLinearProgress-bar': {
                    background:
                      student.homeworkRate >= 80
                        ? 'linear-gradient(90deg, #10B981, #059669)'
                        : student.homeworkRate >= 60
                        ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                        : 'linear-gradient(90deg, #F43F5E, #E11D48)',
                    borderRadius: 5,
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
              borderRadius: 3.5,
              p: 2.2,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.5 }}>
              <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: '#FEF3C7', color: '#D97706' }}>
                <Quote size={18} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>
                نظر و راهکار مشاوره تحصیلی
              </Typography>
            </Stack>

            {/* Advisor Note Quote Card */}
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                p: 2,
                border: '1px solid #E2E8F0',
                borderRight: '5px solid #F59E0B',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                mb: 1.8,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#334155',
                  lineHeight: 1.8,
                  fontSize: '0.84rem',
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
                borderRadius: 3,
                p: 1.6,
                border: '1.5px dashed #CBD5E1',
                textAlign: 'center',
              }}
            >
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.6, fontWeight: 700 }}>
                    مهر و امضای مشاور
                  </Typography>
                  <Box
                    sx={{
                      width: 74,
                      height: 38,
                      border: '1px dashed #C7D2FE',
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4F46E5',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    مهر رسمی
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.6, fontWeight: 700 }}>
                    امضای معاونت آموزشی
                  </Typography>
                  <Box
                    sx={{
                      width: 74,
                      height: 38,
                      border: '1px dashed #A7F3D0',
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    تایید نهایی
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
          borderTop: '1px solid #E2E8F0',
          pt: 1.5,
          mt: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
            کد یکتای پرونده: ELMI-{toPersianDigits(student.id?.replace('student-', ''))} • ثبت شده در سامانه یکپارچه رشد
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
            تاریخ صدور: مهرماه ۱۴۰۵ • صفحه ۱ از ۱
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
