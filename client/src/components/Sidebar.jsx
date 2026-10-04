import React from 'react';
import {
  Box,
  Typography,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  GraduationCap,
  Award,
  Layers,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
} from 'lucide-react';

const GRADES = [
  { id: '7th', name: 'پایه هفتم', isAvailable: true, description: 'دوره اول متوسطه' },
  { id: '8th', name: 'پایه هشتم', isAvailable: false, description: 'دوره اول متوسطه' },
  { id: '9th', name: 'پایه نهم', isAvailable: false, description: 'دوره اول متوسطه' },
  { id: '10th', name: 'پایه دهم', isAvailable: false, description: 'دوره دوم متوسطه' },
];

export default function Sidebar({
  selectedGrade = '7th',
  onSelectGrade,
  studentCount = 0,
}) {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 270 },
        flexShrink: 0,
        bgcolor: '#FFFFFF',
        borderLeft: { xs: 'none', md: '1px solid #E2E8F0' },
        borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
        minHeight: { md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2.5,
        boxSizing: 'border-box',
      }}
    >
      <Box>
        {/* School / System Branding */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3, pt: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: '#FFFFFF',
              border: '1.5px solid #E0E7FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(67, 56, 202, 0.12)',
              p: 0.6,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="لوگوی دبیرستان رشد"
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E1B4B', lineHeight: 1.2 }}>
              دبیرستان رشد
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.75rem' }}>
              سامانه هوشمند کارنامه افقی
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2.5 }} />

        {/* Grade Selection Section */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: '#94A3B8',
            letterSpacing: '0.5px',
            display: 'block',
            mb: 1.5,
            px: 1,
          }}
        >
          انتخاب پایه تحصیلی
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {GRADES.map((grade) => {
            const isSelected = selectedGrade === grade.id;

            return (
              <ListItemButton
                key={grade.id}
                disabled={!grade.isAvailable}
                onClick={() => grade.isAvailable && onSelectGrade && onSelectGrade(grade.id)}
                sx={{
                  borderRadius: 2.5,
                  p: 1.4,
                  bgcolor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  border: isSelected ? '1.5px solid #6366F1' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: grade.isAvailable
                      ? isSelected
                        ? 'rgba(79, 70, 229, 0.12)'
                        : '#F8FAFC'
                      : 'transparent',
                  },
                  opacity: grade.isAvailable ? 1 : 0.6,
                  cursor: grade.isAvailable ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#4F46E5' : '#64748B' }}>
                  <GraduationCap size={20} />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isSelected ? 800 : 600,
                          color: isSelected ? '#4338CA' : '#1E293B',
                        }}
                      >
                        {grade.name}
                      </Typography>
                      {grade.isAvailable ? (
                        <Chip
                          label={`${studentCount} دانش‌آموز`}
                          size="small"
                          color="primary"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: '#EEF2FF',
                            color: '#4338CA',
                          }}
                        />
                      ) : (
                        <Chip
                          label="به‌زودی"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            bgcolor: '#F1F5F9',
                            color: '#94A3B8',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                      {grade.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Info Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          mt: 3,
        }}
      >
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Calendar size={15} color="#4F46E5" />
            <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700 }}>
              سال تحصیلی ۱۴۰۵-۱۴۰۴
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Layers size={15} color="#059669" />
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              نوبت دوم • قالب افقی A4
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircle2 size={15} color="#10B981" />
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
              موتور PDF فعال و آماده چاپ
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
