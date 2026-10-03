import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { downloadExcelTemplate, parseExcelFile, SAMPLE_STUDENTS, enrichStudentData } from '../utils/excelService';

export default function FileImportCard({ onStudentsLoaded, currentCount, onReset }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setErrorMsg('فرمت فایل نامعتبر است. لطفاً فقط فایل با پسوند .xlsx یا .xls انتخاب فرمایید.');
      setSuccessMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await parseExcelFile(file);
      setFileName(file.name);
      setSuccessMsg(`اطلاعات ${result.totalRows} دانش‌آموز با موفقیت بارگذاری و تحلیل شد.`);
      onStudentsLoaded(result.students);
    } catch (err) {
      setErrorMsg(err.message || 'خطا در بارگذاری فایل اکسل رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleProcessFile(files[0]);
    }
    // Reset file input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadDemoData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockStudents = SAMPLE_STUDENTS.map((item, idx) => enrichStudentData(item, idx));
      setFileName('اطلاعات_نمونه_پیش‌فرض.xlsx');
      setSuccessMsg(`اطلاعات نمونه شامل ${mockStudents.length} دانش‌آموز با تحلیل خودکار بارگذاری شد.`);
      setErrorMsg(null);
      setIsLoading(false);
      onStudentsLoaded(mockStudents);
    }, 400);
  };

  const handleClear = () => {
    setFileName(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    onReset();
  };

  return (
    <Card
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: '#EEF2FF',
                  color: '#4F46E5',
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FileSpreadsheet size={24} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  بارگذاری داده‌های کارنامه از فایل اکسل
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  فایل نمرات و مشخصات دانش‌آموزان را بارگذاری کرده یا از قالب آماده استاندارد استفاده نمایید.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Download size={18} />}
              onClick={downloadExcelTemplate}
              sx={{
                borderColor: '#CBD5E1',
                color: '#334155',
                bgcolor: '#F8FAFC',
                '&:hover': {
                  borderColor: '#4F46E5',
                  bgcolor: '#EEF2FF',
                  color: '#4F46E5',
                },
              }}
            >
              دانلود قالب اکسل (XLSX)
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Sparkles size={18} />}
              onClick={handleLoadDemoData}
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
              }}
            >
              بارگذاری داده‌های نمونه
            </Button>

            {currentCount > 0 && (
              <Tooltip title="پاک‌سازی داده‌ها">
                <IconButton onClick={handleClear} sx={{ color: '#94A3B8', '&:hover': { color: '#F43F5E' } }}>
                  <RotateCcw size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Dropzone Area */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? '#4F46E5' : '#CBD5E1',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragging ? 'rgba(79, 70, 229, 0.04)' : '#F8FAFC',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#4F46E5',
              bgcolor: 'rgba(79, 70, 229, 0.02)',
            },
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
          />

          {isLoading ? (
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={42} thickness={4} sx={{ color: '#4F46E5' }} />
              <Typography variant="body1" sx={{ color: '#475569', fontWeight: 600 }}>
                در حال تجزیه و پردازش تحلیل‌های اکسل...
              </Typography>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: isDragging ? '#EEF2FF' : '#E2E8F0',
                  color: isDragging ? '#4F46E5' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <UploadCloud size={30} />
              </Box>

              <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>
                فایل اکسل کارنامه را اینجا بکشید یا برای انتخاب کلیک کنید
              </Typography>

              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                پشتیبانی از فرمت‌های استاندارد .XLSX و .XLS (شامل ستون‌های نمرات، حضور، انضباط و توضیحات مشاور)
              </Typography>

              {fileName && (
                <Chip
                  icon={<FileSpreadsheet size={16} />}
                  label={`فایل فعال: ${fileName}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1, bgcolor: '#EEF2FF' }}
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Alerts */}
        {errorMsg && (
          <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ mt: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ mt: 2, borderRadius: 2 }}>
            {successMsg}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
