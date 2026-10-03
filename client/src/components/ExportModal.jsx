import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  LinearProgress,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { FileDown, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ExportModal({
  open,
  studentCount,
  status = 'loading', // 'loading' | 'success' | 'error'
  errorMessage = '',
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={status === 'loading' ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          textAlign: 'center',
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.2)',
        },
      }}
    >
      <DialogContent>
        {status === 'loading' && (
          <Stack alignItems="center" spacing={2.5} sx={{ py: 2 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={72} thickness={4} sx={{ color: '#4F46E5' }} />
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4F46E5',
                }}
              >
                <FileDown size={28} />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 0.5 }}>
                در حال تولید PDF دسته‌جمعی افقی
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                موتور رندر در حال کامپایل و صفحه‌بندی {studentCount} کارنامه است...
              </Typography>
            </Box>

            <Box sx={{ width: '100%', px: 2 }}>
              <LinearProgress
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#EEF2FF',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4F46E5, #0EA5E9)',
                  },
                }}
              />
            </Box>

            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip
                icon={<Sparkles size={14} />}
                label="فرمت افقی A4 بدون افت کیفیت"
                size="small"
                sx={{ bgcolor: '#F8FAFC', color: '#475569', fontSize: '0.75rem' }}
              />
            </Stack>
          </Stack>
        )}

        {status === 'success' && (
          <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={36} />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#065F46', mb: 0.5 }}>
                دانلود PDF با موفقیت آغاز شد
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                فایل تجمیعی شامل {studentCount} کارنامه آماده چاپ شد.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                mt: 1,
                bgcolor: '#10B981',
                '&:hover': { bgcolor: '#059669' },
                borderRadius: 2.5,
                px: 3,
              }}
            >
              متوجه شدم
            </Button>
          </Stack>
        )}

        {status === 'error' && (
          <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#FFF1F2',
                color: '#F43F5E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={36} />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#9F1239', mb: 0.5 }}>
                خطا در فرآیند تولید PDF
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 300, mx: 'auto' }}>
                {errorMessage || 'ارتباط با سرویس سرور ناموفق بود. لطفاً اتصال سرور را بررسی فرمایید.'}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              sx={{
                mt: 1,
                borderRadius: 2.5,
                px: 3,
              }}
            >
              بستن
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
