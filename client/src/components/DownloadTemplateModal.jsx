import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { FileSpreadsheet, X, Download, Calendar, Layers, Clock } from 'lucide-react';
import {
  downloadExcelTemplate,
  SCHOOL_PERSIAN_MONTHS,
} from '../utils/excelService';

const AVAILABLE_GRADES_CLASSES = [
  { label: 'پایه هفتم - کلاس هفتم ۱', grade: 'پایه هفتم', className: 'هفتم ۱' },
  { label: 'پایه هفتم - کلاس هفتم ۲', grade: 'پایه هفتم', className: 'هفتم ۲' },
  { label: 'پایه هفتم - کلاس هفتم ۳', grade: 'پایه هفتم', className: 'هفتم ۳' },
  { label: 'پایه هشتم - کلاس هشتم ۱', grade: 'پایه هشتم', className: 'هشتم ۱' },
  { label: 'پایه نهم - کلاس نهم ۱', grade: 'پایه نهم', className: 'نهم ۱' },
];

const AVAILABLE_YEARS = ['1403', '1404', '1405'];

export default function DownloadTemplateModal({
  open,
  onClose,
  existingStudents = [],
  availableClasses = [],
}) {
  const [selectedClassOption, setSelectedClassOption] = useState('هفتم ۱');
  const [selectedYear, setSelectedYear] = useState('1403');
  const [selectedMonth, setSelectedMonth] = useState('آبان');

  const handleDownload = () => {
    // If we have existing students in that class, use their names & UUIDs
    const matchingStudents = existingStudents.filter(
      (s) => s.className === selectedClassOption
    );

    downloadExcelTemplate({
      className: selectedClassOption,
      year: selectedYear,
      month: selectedMonth,
      studentList: matchingStudents.length > 0 ? matchingStudents : existingStudents,
    });

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
              bgcolor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSpreadsheet size={24} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.1rem' }}>
              دریافت قالب اکسل استاندارد کارنامه
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
              تولید فایل XLSX با ستون‌های ۱۲ گانه و پیش‌فرض شناسه، سال و ماه
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Grade & Class Selector */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
              <Layers size={18} color="#4F46E5" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                پایه و کلاس دانش‌آموزان:
              </Typography>
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel id="class-select-label">انتخاب کلاس</InputLabel>
              <Select
                labelId="class-select-label"
                value={selectedClassOption}
                label="انتخاب کلاس"
                onChange={(e) => setSelectedClassOption(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {AVAILABLE_GRADES_CLASSES.map((item) => (
                  <MenuItem key={item.className} value={item.className}>
                    {item.label}
                  </MenuItem>
                ))}
                {availableClasses
                  .filter((c) => !AVAILABLE_GRADES_CLASSES.some((a) => a.className === c))
                  .map((c) => (
                    <MenuItem key={c} value={c}>
                      کلاس {c}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* Year Selector */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
              <Calendar size={18} color="#0284C7" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                سال تحصیلی (سال برگزاری آزمون):
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5}>
              {AVAILABLE_YEARS.map((yr) => (
                <Chip
                  key={yr}
                  label={`سال ${yr}`}
                  clickable
                  onClick={() => setSelectedYear(yr)}
                  color={selectedYear === yr ? 'primary' : 'default'}
                  variant={selectedYear === yr ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    px: 1.5,
                    py: 2.2,
                    borderRadius: 2,
                    fontSize: '0.88rem',
                  }}
                />
              ))}
              <TextField
                size="small"
                placeholder="سال دلخواه (مثلاً 1404)"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{ width: 160 }}
                inputProps={{ style: { textAlign: 'center', fontWeight: 800 } }}
              />
            </Stack>
          </Box>

          {/* Month Selector */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
              <Clock size={18} color="#D97706" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ماه برگزاری آزمون (نوبت سنجش):
              </Typography>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
              }}
            >
              {SCHOOL_PERSIAN_MONTHS.map((m) => {
                const isSelected = selectedMonth === m;
                return (
                  <Chip
                    key={m}
                    label={m}
                    clickable
                    onClick={() => setSelectedMonth(m)}
                    color={isSelected ? 'warning' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{
                      fontWeight: 800,
                      borderRadius: 2,
                      py: 2,
                      bgcolor: isSelected ? '#D97706' : undefined,
                      color: isSelected ? '#FFFFFF' : '#334155',
                      border: isSelected ? 'none' : '1px solid #CBD5E1',
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Template Format Preview Box */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: '#F8FAFC',
              border: '1px dashed #CBD5E1',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 0.8 }}>
              پیش‌نمایش ساختار فایل خروجی:
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.6 }}>
              ستون‌های پیش‌پر شده: <strong>شناسه (UUID)</strong>، <strong>نام و نام خانوادگی</strong>، <strong>سال ({selectedYear})</strong>، <strong>ماه ({selectedMonth})</strong>
              <br />
              ستون‌های ورودی عملکرد: <strong>درصد کل</strong>، <strong>درصد ریاضی</strong>، <strong>غیبت</strong>، <strong>تاخیر</strong>، <strong>وضعیت انضباط</strong>، <strong>تکالیف تحویل شده</strong>، <strong>کل تکالیف</strong>، <strong>نکته مشاورهای</strong>
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
          onClick={handleDownload}
          variant="contained"
          startIcon={<Download size={18} />}
          sx={{
            bgcolor: '#059669',
            '&:hover': { bgcolor: '#047857' },
            fontWeight: 800,
            px: 3,
            py: 1.1,
            borderRadius: 2.5,
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
          }}
        >
          دریافت فایل اکسل ({selectedMonth} {selectedYear})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
