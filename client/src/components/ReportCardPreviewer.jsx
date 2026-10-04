import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Eye,
  Maximize2,
  Users,
} from 'lucide-react';
import ReportCard from './ReportCard';
import { toPersianDigits } from '../utils/excelService';
import { resolveConfigForStudent } from '../utils/gradeConfigService';

// Framer motion slide variants
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export default function ReportCardPreviewer({
  students = [],
  visibility,
  currentIndex,
  onIndexChange,
  gradeConfigs = {},
}) {
  const [[page, direction], setPage] = useState([currentIndex || 0, 0]);

  // Keep internal page in sync with prop currentIndex
  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== page) {
      setPage([currentIndex, currentIndex > page ? 1 : -1]);
    }
  }, [currentIndex]);

  const paginate = (newDirection) => {
    if (students.length === 0) return;
    const nextIndex = (page + newDirection + students.length) % students.length;
    setPage([nextIndex, newDirection]);
    if (onIndexChange) onIndexChange(nextIndex);
  };

  const jumpTo = (index) => {
    const dir = index > page ? 1 : -1;
    setPage([index, dir]);
    if (onIndexChange) onIndexChange(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // In RTL, ArrowRight moves backward in sequence, ArrowLeft moves forward
      if (e.key === 'ArrowLeft') {
        paginate(1);
      } else if (e.key === 'ArrowRight') {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, students.length]);

  if (!students || students.length === 0) {
    return (
      <Card
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: '#FFFFFF',
          borderRadius: 4,
          border: '1px dashed #CBD5E1',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={32} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
            دانش‌آموزی برای نمایش وجود ندارد
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 400 }}>
            لطفاً یک فایل اکسل بارگذاری کنید یا فیلترهای اعمال شده در بخش بالا را تنظیم فرمایید.
          </Typography>
        </Stack>
      </Card>
    );
  }

  const currentStudent = students[page] || students[0];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Top Carousel Navigation Bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
        }}
      >
        {/* Left info: current student count */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.8,
              borderRadius: 2,
              bgcolor: '#EEF2FF',
              color: '#4F46E5',
            }}
          >
            <Eye size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
              پیش‌نمایش زنده کارنامه افقی
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              کارنامه {toPersianDigits(page + 1)} از {toPersianDigits(students.length)} دانش‌آموز (جهت جابه‌جایی از کلیدهای جهت‌نما استفاده کنید)
            </Typography>
          </Box>
        </Stack>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Tooltip title="اولین دانش‌آموز">
            <span>
              <IconButton
                size="small"
                onClick={() => jumpTo(0)}
                disabled={page === 0}
                sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}
              >
                <ChevronsRight size={18} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="دانش‌آموز قبلی (کلید راست کیبورد)">
            <span>
              <IconButton
                size="small"
                onClick={() => paginate(-1)}
                disabled={students.length <= 1}
                sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}
              >
                <ChevronRight size={20} />
              </IconButton>
            </span>
          </Tooltip>

          <Chip
            label={`${toPersianDigits(page + 1)} از ${toPersianDigits(students.length)}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800, px: 1, minWidth: 80, fontSize: '0.85rem' }}
          />

          <Tooltip title="دانش‌آموز بعدی (کلید چپ کیبورد)">
            <span>
              <IconButton
                size="small"
                onClick={() => paginate(1)}
                disabled={students.length <= 1}
                sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}
              >
                <ChevronLeft size={20} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="آخرین دانش‌آموز">
            <span>
              <IconButton
                size="small"
                onClick={() => jumpTo(students.length - 1)}
                disabled={page === students.length - 1}
                sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}
              >
                <ChevronsLeft size={18} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Interactive Carousel Frame - Full Width, Zero Horizontal Margin Waste */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 4,
          p: 0,
          bgcolor: 'transparent',
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStudent.id || page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: '100%' }}
          >
            <ReportCard
              student={currentStudent}
              visibility={visibility}
              config={resolveConfigForStudent(currentStudent, gradeConfigs)}
            />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Quick Student Selector Chips */}
      {students.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            overflowX: 'auto',
            pb: 1,
            '::-webkit-scrollbar': { height: 6 },
          }}
        >
          {students.map((std, idx) => (
            <Chip
              key={std.id || idx}
              label={std.name}
              onClick={() => jumpTo(idx)}
              color={idx === page ? 'primary' : 'default'}
              variant={idx === page ? 'filled' : 'outlined'}
              sx={{
                cursor: 'pointer',
                fontWeight: idx === page ? 700 : 500,
                fontSize: '0.8rem',
                flexShrink: 0,
                borderColor: idx === page ? 'primary.main' : '#CBD5E1',
                bgcolor: idx === page ? 'primary.main' : '#FFFFFF',
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
