import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Popover,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Search,
  Filter,
  ChevronDown,
  FileDown,
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Layers,
  RotateCcw,
  BookOpen,
  CalendarX2,
  ShieldCheck,
  Quote,
  Settings,
  UserPlus,
} from 'lucide-react';
import { toPersianDigits } from '../utils/excelService';

export default function FiltersDropdownToolbar({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedTrend,
  onTrendChange,
  availableClasses = [],
  visibility,
  onVisibilityChange,
  selectedStudentIds,
  filteredStudents = [],
  totalStudentsCount = 0,
  onToggleSelectAll,
  onExportPdf,
  isExporting,
  onOpenSettings,
  onOpenCreateStudent,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenFilters = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  // Count active filters (non-default)
  let activeFilterCount = 0;
  if (selectedClass !== 'ALL') activeFilterCount += 1;
  if (selectedTrend !== 'ALL') activeFilterCount += 1;
  if (!visibility.academic || !visibility.attendance || !visibility.discipline || !visibility.homework || !visibility.advisor) {
    activeFilterCount += 1;
  }

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  const selectedCount = selectedStudentIds.length;

  const handleResetFilters = () => {
    onClassChange('ALL');
    onTrendChange('ALL');
    onVisibilityChange('academic', true);
    onVisibilityChange('attendance', true);
    onVisibilityChange('discipline', true);
    onVisibilityChange('homework', true);
    onVisibilityChange('advisor', true);
  };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 3.5,
        p: 2,
        mb: 2.5,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        {/* Left / Start: Search & Filter Dropdown Button */}
        <Stack direction="row" spacing={1.5} alignItems="center" flex={1}>
          <TextField
            size="small"
            placeholder="جستجوی نام دانش‌آموز..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#94A3B8" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 260 },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F8FAFC',
                borderRadius: 2.5,
              },
            }}
          />

          {/* Add User Icon Button (no text, near search box) */}
          {onOpenCreateStudent && (
            <Tooltip title="افزودن دانش‌آموز جدید">
              <IconButton
                onClick={onOpenCreateStudent}
                sx={{
                  bgcolor: '#EEF2FF',
                  color: '#4F46E5',
                  border: '1.5px solid #C7D2FE',
                  borderRadius: 2.5,
                  p: 1.1,
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.12)',
                  flexShrink: 0,
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': {
                    bgcolor: '#4F46E5',
                    color: '#FFFFFF',
                    borderColor: '#4F46E5',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
                  },
                }}
              >
                <UserPlus size={19} />
              </IconButton>
            </Tooltip>
          )}

          {/* Filters Dropdown Trigger Button */}
          <Badge badgeContent={activeFilterCount > 0 ? toPersianDigits(activeFilterCount) : 0} color="primary" overlap="circular">
            <Button
              variant="outlined"
              onClick={handleOpenFilters}
              startIcon={<Filter size={17} />}
              endIcon={<ChevronDown size={16} />}
              sx={{
                borderColor: activeFilterCount > 0 ? '#4F46E5' : '#CBD5E1',
                color: activeFilterCount > 0 ? '#4F46E5' : '#334155',
                bgcolor: activeFilterCount > 0 ? '#EEF2FF' : '#F8FAFC',
                fontWeight: 700,
                borderRadius: 2.5,
                px: 2,
                '&:hover': {
                  borderColor: '#4F46E5',
                  bgcolor: '#EEF2FF',
                },
              }}
            >
              فیلترها و تنظیمات
            </Button>
          </Badge>

          {/* Customization Settings Button */}
          {onOpenSettings && (
            <Tooltip title="شخصی‌سازی عناوین، لوگو و واترمارک به تفکیک پایه">
              <Button
                variant="outlined"
                onClick={onOpenSettings}
                startIcon={<Settings size={16} />}
                sx={{
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  bgcolor: '#F8FAFC',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#4F46E5',
                    bgcolor: '#EEF2FF',
                    color: '#4F46E5',
                  },
                }}
              >
                شخصی‌سازی کارنامه
              </Button>
            </Tooltip>
          )}

          {/* Active Filter Chips summary */}
          {selectedClass !== 'ALL' && (
            <Chip
              label={`کلاس: ${selectedClass}`}
              size="small"
              onDelete={() => onClassChange('ALL')}
              color="primary"
              variant="outlined"
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            />
          )}

          {selectedTrend !== 'ALL' && (
            <Chip
              label="فیلتر روند فعال"
              size="small"
              onDelete={() => onTrendChange('ALL')}
              color="secondary"
              variant="outlined"
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            />
          )}
        </Stack>

        {/* Right / End: Selection & PDF Export Trigger */}
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end" flexWrap="wrap" sx={{ gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onToggleSelectAll}
            startIcon={allFilteredSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            sx={{
              borderColor: '#CBD5E1',
              color: '#334155',
              bgcolor: '#F8FAFC',
              fontWeight: 600,
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
            }}
          >
            {allFilteredSelected ? 'لغو انتخاب' : 'انتخاب همه'}
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={selectedCount === 0 || isExporting}
            onClick={onExportPdf}
            startIcon={<FileDown size={18} />}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2.5,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              },
            }}
          >
            {isExporting ? 'در حال ایجاد PDF...' : `چاپ PDF (${toPersianDigits(selectedCount)} کارنامه)`}
          </Button>
        </Stack>
      </Stack>

      {/* Popover Menu with Filters */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            p: { xs: 2.5, sm: 3.5 },
            width: 440,
            maxWidth: '92vw',
            borderRadius: 4,
            border: '1px solid #CBD5E1',
            boxShadow: '0 16px 40px -4px rgba(15, 23, 42, 0.16)',
            direction: 'rtl',
          },
        }}
      >
        <Stack spacing={2.2} sx={{
          p: 2
        }}>
          {/* Header */}
          <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E1B4B' }}>
              تنظیمات فیلترها و بخش‌های کارنامه
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                variant="text"
                color="error"
                startIcon={<RotateCcw size={14} />}
                onClick={handleResetFilters}
                sx={{ fontSize: '0.75rem', p: 0.5 }}
              >
                بازنشانی
              </Button>
            )}
          </Stack>

          <Divider />

          {/* Class Filter */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block', mb: 1 }}>
              فیلتر بر اساس کلاس:
            </Typography>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ gap: 0.8 }}>
              <Chip
                label="تمام کلاس‌ها"
                size="small"
                onClick={() => onClassChange('ALL')}
                color={selectedClass === 'ALL' ? 'primary' : 'default'}
                variant={selectedClass === 'ALL' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer', fontWeight: selectedClass === 'ALL' ? 700 : 500 }}
              />
              {availableClasses.map((cls) => (
                <Chip
                  key={cls}
                  label={cls}
                  size="small"
                  onClick={() => onClassChange(cls)}
                  color={selectedClass === cls ? 'primary' : 'default'}
                  variant={selectedClass === cls ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer', fontWeight: selectedClass === cls ? 700 : 500 }}
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Analytical Trend Filter */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block', mb: 1 }}>
              فیلتر بر اساس روند تحلیلی نمرات:
            </Typography>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ gap: 0.8 }}>
              <Chip
                label="همه دانش‌آموزان"
                size="small"
                onClick={() => onTrendChange('ALL')}
                color={selectedTrend === 'ALL' ? 'primary' : 'default'}
                variant={selectedTrend === 'ALL' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<TrendingUp size={13} />}
                label="پیشرفت در ریاضی"
                size="small"
                onClick={() => onTrendChange('MATH_IMPROVE')}
                color={selectedTrend === 'MATH_IMPROVE' ? 'success' : 'default'}
                variant={selectedTrend === 'MATH_IMPROVE' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<TrendingDown size={13} />}
                label="افت در ریاضی"
                size="small"
                onClick={() => onTrendChange('MATH_DECLINE')}
                color={selectedTrend === 'MATH_DECLINE' ? 'error' : 'default'}
                variant={selectedTrend === 'MATH_DECLINE' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<TrendingUp size={13} />}
                label="پیشرفت میانگین کل"
                size="small"
                onClick={() => onTrendChange('TOTAL_IMPROVE')}
                color={selectedTrend === 'TOTAL_IMPROVE' ? 'primary' : 'default'}
                variant={selectedTrend === 'TOTAL_IMPROVE' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<TrendingDown size={13} />}
                label="افت میانگین کل"
                size="small"
                onClick={() => onTrendChange('TOTAL_DECLINE')}
                color={selectedTrend === 'TOTAL_DECLINE' ? 'error' : 'default'}
                variant={selectedTrend === 'TOTAL_DECLINE' ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Section Visibility Switches */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 1 }}>
              <Layers size={16} color="#4F46E5" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                نمایش / عدم نمایش بخش‌ها در کارنامه:
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.academic}
                    onChange={(e) => onVisibilityChange('academic', e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">تحلیل نمرات و مقایسه دوره‌ای</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.attendance}
                    onChange={(e) => onVisibilityChange('attendance', e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">غیبت‌ها و تاخیرها</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.discipline}
                    onChange={(e) => onVisibilityChange('discipline', e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">وضعیت انضباط</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.homework}
                    onChange={(e) => onVisibilityChange('homework', e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">نرخ ارسال تکالیف</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.advisor}
                    onChange={(e) => onVisibilityChange('advisor', e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">یادداشت و امضای مشاور</Typography>}
              />
            </Stack>
          </Box>
        </Stack>
      </Popover>
    </Box>
  );
}
