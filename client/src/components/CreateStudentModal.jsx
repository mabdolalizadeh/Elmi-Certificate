import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Grid,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  UserPlus,
  X,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  BookOpen,
  CalendarX2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SCHOOL_PERSIAN_MONTHS, toPersianDigits } from '../utils/excelService';

const DISCIPLINE_OPTIONS = [
  { value: 'عالی', label: 'عالی', color: '#059669', bg: '#D1FAE5' },
  { value: 'خوب', label: 'خوب', color: '#2563EB', bg: '#DBEAFE' },
  { value: 'نیاز به توجه', label: 'نیاز به توجه', color: '#D97706', bg: '#FEF3C7' },
  { value: 'ضعیف', label: 'ضعیف', color: '#DC2626', bg: '#FEE2E2' },
];

const AVAILABLE_YEARS = ['1403', '1404', '1405'];

export default function CreateStudentModal({
  open,
  onClose,
  onSaveStudent,
  currentGradeName = 'پایه هفتم',
  availableClasses = [],
}) {
  const getDefaultClassName = () => {
    if (availableClasses && availableClasses.length > 0) return availableClasses[0];
    if (currentGradeName.includes('هفتم')) return 'هفتم ۱';
    if (currentGradeName.includes('هشتم')) return 'هشتم ۱';
    if (currentGradeName.includes('نهم')) return 'نهم ۱';
    if (currentGradeName.includes('دهم')) return 'دهم ۱';
    return `${currentGradeName} ۱`;
  };

  const [formData, setFormData] = useState({
    name: '',
    className: getDefaultClassName(),
    year: '1403',
    month: 'آبان',
    currTotal: '85',
    prevTotal: '80',
    currMath: '88',
    prevMath: '82',
    absences: '0',
    tardies: '0',
    discipline: 'عالی',
    homeworkSubmitted: '28',
    homeworkTotal: '30',
    advisorNote: 'تلاش و استمرار عالی در تحویل به موقع تکالیف و فعالیت مستمر در کلاس.',
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        className: getDefaultClassName(),
        year: '1403',
        month: 'آبان',
        currTotal: '85',
        prevTotal: '80',
        currMath: '88',
        prevMath: '82',
        absences: '0',
        tardies: '0',
        discipline: 'عالی',
        homeworkSubmitted: '28',
        homeworkTotal: '30',
        advisorNote: 'تلاش و استمرار عالی در تحویل به موقع تکالیف و فعالیت مستمر در کلاس.',
      });
      setErrorMsg('');
    }
  }, [open, currentGradeName]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (field === 'name' && val.trim()) {
      setErrorMsg('');
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setErrorMsg('لطفاً نام و نام خانوادگی دانش‌آموز را وارد فرمایید.');
      return;
    }

    const cTotal = Math.min(100, Math.max(0, Number(formData.currTotal) || 0));
    const pTotal = Math.min(100, Math.max(0, Number(formData.prevTotal) || 0));
    const cMath = Math.min(100, Math.max(0, Number(formData.currMath) || 0));
    const pMath = Math.min(100, Math.max(0, Number(formData.prevMath) || 0));

    const hwSub = Math.max(0, Number(formData.homeworkSubmitted) || 0);
    const hwTot = Math.max(1, Number(formData.homeworkTotal) || 30);

    const studentId = `std-${Date.now().toString().slice(-6)}`;

    // Build raw student record
    const newStudent = {
      id: studentId,
      name: formData.name.trim(),
      className: formData.className.trim() || getDefaultClassName(),
      year: formData.year.trim() || '1403',
      month: formData.month.trim() || 'آبان',
      currTotal: cTotal,
      prevTotal: pTotal,
      currMath: cMath,
      prevMath: pMath,
      absences: Math.max(0, Number(formData.absences) || 0),
      tardies: Math.max(0, Number(formData.tardies) || 0),
      discipline: formData.discipline || 'خوب',
      homeworkSubmitted: hwSub,
      homeworkTotal: hwTot,
      advisorNote: formData.advisorNote.trim(),
      history: [
        { month: 'مهر', year: formData.year, total: pTotal, math: pMath },
        { month: formData.month, year: formData.year, total: cTotal, math: cMath },
      ],
    };

    onSaveStudent(newStudent);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: 1,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2.2,
              bgcolor: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserPlus size={24} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.15rem' }}>
              افزودن دانش‌آموز جدید به {currentGradeName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
              ثبت مشخصات شناسنامه‌ای، عملکرد تحصیلی آزمون‌ها، انضباط و گزارش مشاور
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Section 1: Identity & Grade Info */}
          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.8 }}>
              <GraduationCap size={18} color="#4F46E5" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ۱. مشخصات هویتی و کلاس
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="نام و نام خانوادگی دانش‌آموز"
                  required
                  size="small"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="مثال: علیرضا حسینی"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="کلاس / عنوان شعبه"
                  size="small"
                  value={formData.className}
                  onChange={(e) => handleChange('className', e.target.value)}
                  placeholder="مثال: هفتم ۱"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="سال تحصیلی"
                  size="small"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={16} color="#64748B" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="ماه برگزاری آزمون"
                  size="small"
                  value={formData.month}
                  onChange={(e) => handleChange('month', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={16} color="#64748B" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {SCHOOL_PERSIAN_MONTHS.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: Academic Scores */}
          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.8 }}>
              <Award size={18} color="#059669" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ۲. نمرات و درصدهای تحصیلی
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="درصد آزمون جامع (فعلی)"
                  size="small"
                  value={formData.currTotal}
                  onChange={(e) => handleChange('currTotal', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">٪</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="درصد آزمون جامع (قبلی - جهت مقایسه)"
                  size="small"
                  value={formData.prevTotal}
                  onChange={(e) => handleChange('prevTotal', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">٪</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="درصد درس ریاضی (فعلی)"
                  size="small"
                  value={formData.currMath}
                  onChange={(e) => handleChange('currMath', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">٪</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="درصد درس ریاضی (قبلی - جهت مقایسه)"
                  size="small"
                  value={formData.prevMath}
                  onChange={(e) => handleChange('prevMath', e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">٪</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 3: Attendance & Discipline */}
          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.8 }}>
              <ShieldCheck size={18} color="#D97706" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ۳. شاخص‌های حضور، انضباط و تکالیف
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="تعداد غیبت"
                  size="small"
                  value={formData.absences}
                  onChange={(e) => handleChange('absences', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="تعداد تاخیر"
                  size="small"
                  value={formData.tardies}
                  onChange={(e) => handleChange('tardies', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="تکالیف تحویل شده"
                  size="small"
                  value={formData.homeworkSubmitted}
                  onChange={(e) => handleChange('homeworkSubmitted', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="کل تکالیف معین شده"
                  size="small"
                  value={formData.homeworkTotal}
                  onChange={(e) => handleChange('homeworkTotal', e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                  وضعیت انضباط و رفتار کلاسی:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {DISCIPLINE_OPTIONS.map((opt) => {
                    const isSelected = formData.discipline === opt.value;
                    return (
                      <Chip
                        key={opt.value}
                        label={opt.label}
                        clickable
                        onClick={() => handleChange('discipline', opt.value)}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 800,
                          borderRadius: 2,
                          px: 1.5,
                          py: 2,
                          bgcolor: isSelected ? opt.bg : 'transparent',
                          color: isSelected ? opt.color : '#64748B',
                          borderColor: isSelected ? opt.color : '#CBD5E1',
                        }}
                      />
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Section 4: Advisor Note */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
              <BookOpen size={18} color="#0284C7" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ۴. نکته و تحلیل مشاور تحصیلی
              </Typography>
            </Stack>
            <TextField
              fullWidth
              multiline
              rows={2.5}
              size="small"
              value={formData.advisorNote}
              onChange={(e) => handleChange('advisorNote', e.target.value)}
              placeholder="توصیه‌ها و تحلیل مشاور پیرامون وضعیت تحصیلی دانش‌آموز..."
            />
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="text" sx={{ color: '#64748B', fontWeight: 700 }}>
          انصراف
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<CheckCircle2 size={18} />}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            px: 3,
            py: 1.1,
            borderRadius: 2.5,
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
            },
          }}
        >
          ثبت و ایجاد کارنامه دانش‌آموز
        </Button>
      </DialogActions>
    </Dialog>
  );
}
