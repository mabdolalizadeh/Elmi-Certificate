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
  Alert,
} from '@mui/material';
import {
  UserPlus,
  X,
  Users,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { generateUUID, toPersianDigits } from '../utils/excelService';

export default function CreateStudentModal({
  open,
  onClose,
  onSaveStudents,
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

  const [className, setClassName] = useState(getDefaultClassName());
  const [namesText, setNamesText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setClassName(getDefaultClassName());
      setNamesText('');
      setErrorMsg('');
    }
  }, [open, currentGradeName]);

  // Calculate parsed names count in real time
  const parsedNames = namesText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const handleSubmit = () => {
    if (parsedNames.length === 0) {
      setErrorMsg('لطفاً حداقل نام یک دانش‌آموز را در کادر زیر وارد فرمایید.');
      return;
    }

    const targetClass = className.trim() || getDefaultClassName();

    // Create a student object for each name with a unique UUID
    const newStudents = parsedNames.map((name) => {
      const uuid = generateUUID();
      return {
        id: uuid,
        name: name,
        className: targetClass,
        year: '1403',
        month: 'آبان',
        currTotal: 0,
        prevTotal: 0,
        currMath: 0,
        prevMath: 0,
        absences: 0,
        tardies: 0,
        discipline: 'خوب',
        homeworkSubmitted: 0,
        homeworkTotal: 0,
        homeworkRate: 0,
        advisorNote: '',
      };
    });

    onSaveStudents(newStudents);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
              تعریف و ثبت دانش‌آموزان جدید
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
              اسامی را خط‌به‌خط وارد کنید تا شناسه یکتای UUID برای هر دانش‌آموز تولید شود
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Class input */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <GraduationCap size={18} color="#4F46E5" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                کلاس / عنوان شعبه:
              </Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="مثال: هفتم ۱"
            />
          </Box>

          {/* Multi-line names input */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Users size={18} color="#059669" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                  اسامی دانش‌آموزان (هر نام در یک خط):
                </Typography>
              </Stack>
              <Chip
                label={`تعداد: ${toPersianDigits(parsedNames.length)} دانش‌آموز`}
                size="small"
                color={parsedNames.length > 0 ? 'primary' : 'default'}
                sx={{
                  fontWeight: 800,
                  bgcolor: parsedNames.length > 0 ? '#EEF2FF' : '#F1F5F9',
                  color: parsedNames.length > 0 ? '#4F46E5' : '#64748B',
                }}
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={9}
              value={namesText}
              onChange={(e) => {
                setNamesText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={`علیرضا حسینی\nمحمد صادقی\nسارا رحیمی\nامیررضا کریمی\nفاطمه نوری`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#F8FAFC',
                  fontFamily: 'inherit',
                  lineHeight: 1.8,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1 }}>
              💡 پس از ثبت، این اسامی همراه با شناسه اختصاصی (UUID) در قالب اکسل دانلود خواهند شد تا بتوانید نمرات را در اکسل وارد نمایید.
            </Typography>
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
          disabled={parsedNames.length === 0}
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
          {parsedNames.length > 0
            ? `ثبت ${toPersianDigits(parsedNames.length)} دانش‌آموز و ایجاد UUID`
            : 'ثبت و تولید شناسه UUID'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
