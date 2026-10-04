import React, { useState } from 'react';
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
import { FileSpreadsheet, X, Download, Calendar, Clock, AlertTriangle, Users } from 'lucide-react';
import {
  downloadExcelTemplate,
  SCHOOL_PERSIAN_MONTHS,
} from '../utils/excelService';

const AVAILABLE_YEARS = ['1405', '1406', '1407'];

export default function DownloadTemplateModal({
  open,
  onClose,
  existingStudents = [],
}) {
  const [selectedYear, setSelectedYear] = useState('1405');
  const [selectedMonth, setSelectedMonth] = useState('آبان');

  const handleDownload = () => {
    downloadExcelTemplate({
      year: selectedYear,
      month: selectedMonth,
      studentList: existingStudents,
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
                placeholder="سال دلخواه (مثلاً 1405)"
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

          {/* Student Status Notice */}
          {existingStudents.length === 0 ? (
            <Alert
              severity="warning"
              icon={<AlertTriangle size={20} />}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid #FDE68A',
                bgcolor: '#FEFCE8',
                color: '#92400E',
                '& .MuiAlert-icon': { color: '#D97706' },
              }}
            >
              هنوز هیچ دانش‌آموزی در سامانه تعریف نشده است. لطفاً ابتدا از طریق دکمه «+» در بالای صفحه، اسامی دانش‌آموزان را تعریف کنید تا شناسه یکتا (UUID) و نام آن‌ها در فایل اکسل قرار گیرد.
            </Alert>
          ) : (
            <Alert
              severity="success"
              icon={<Users size={20} />}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid #BBF7D0',
                bgcolor: '#F0FDF4',
                color: '#166534',
                '& .MuiAlert-icon': { color: '#16A34A' },
              }}
            >
              تعداد {existingStudents.length} دانش‌آموز تعریف شده به همراه شناسه یکتا (UUID) و نام در فایل اکسل قرار خواهند گرفت.
            </Alert>
          )}

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
          disabled={existingStudents.length === 0}
          startIcon={<Download size={18} />}
          sx={{
            bgcolor: '#059669',
            '&:hover': { bgcolor: '#047857' },
            '&.Mui-disabled': {
              bgcolor: '#E2E8F0',
              color: '#94A3B8',
            },
            fontWeight: 800,
            px: 3,
            py: 1.1,
            borderRadius: 2.5,
            boxShadow: existingStudents.length > 0 ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none',
          }}
        >
          {existingStudents.length === 0
            ? 'ابتدا دانش‌آموزان را ثبت کنید'
            : `دریافت فایل اکسل (${selectedMonth} ${selectedYear})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
