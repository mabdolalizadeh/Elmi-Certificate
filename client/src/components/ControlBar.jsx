import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControlLabel,
  Switch,
  Divider,
  Badge,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Search,
  Filter,
  FileDown,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  CalendarX2,
  Quote,
  Layers,
} from 'lucide-react';

export default function ControlBar({
  students = [],
  filteredStudents = [],
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
  onToggleSelectAll,
  onExportPdf,
  isExporting,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const allSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));
  const someSelected =
    filteredStudents.some((s) => selectedStudentIds.includes(s.id)) && !allSelected;

  const selectedCount = students.filter((s) => selectedStudentIds.includes(s.id)).length;

  return (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #CBD5E1',
        borderRadius: 4,
        boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.08)',
        position: 'sticky',
        top: 16,
        zIndex: 100,
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
        {/* Main Action Strip */}
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          {/* Search & Class Filter */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flex={1}>
            <TextField
              size="small"
              placeholder="جستجوی دانش‌آموز بر اساس نام..."
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
                minWidth: { xs: '100%', sm: 260 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F8FAFC',
                  borderRadius: 2.5,
                },
              }}
            />

            {/* Class Chips */}
            <Stack direction="row" spacing={0.8} sx={{ overflowX: 'auto', maxWidth: '100%', py: 0.5 }}>
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
          </Stack>

          {/* Export Action & Selection summary */}
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            {/* Select All Toggle */}
            <Button
              size="small"
              variant="outlined"
              onClick={onToggleSelectAll}
              startIcon={allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
              sx={{
                borderColor: '#CBD5E1',
                color: '#334155',
                bgcolor: '#F8FAFC',
                fontWeight: 600,
              }}
            >
              {allSelected ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </Button>

            {/* Toggle advanced settings & section visibilities */}
            <Button
              size="small"
              variant="text"
              onClick={() => setShowAdvanced(!showAdvanced)}
              startIcon={<SlidersHorizontal size={16} />}
              endIcon={showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              sx={{ color: '#475569', fontWeight: 600 }}
            >
              بخش‌های کارنامه
            </Button>

            {/* PDF Export Trigger */}
            <Button
              variant="contained"
              color="primary"
              disabled={selectedCount === 0 || isExporting}
              onClick={onExportPdf}
              startIcon={<FileDown size={18} />}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                px: 2.5,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              {isExporting ? (
                'در حال ایجاد PDF چندصفحه‌ای...'
              ) : (
                `چاپ PDF (${selectedCount} کارنامه)`
              )}
            </Button>
          </Stack>
        </Stack>

        {/* Trend Filters */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.8 }}>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, ml: 1 }}>
            فیلتر تحلیلی:
          </Typography>

          <Chip
            label="همه دانش‌آموزان"
            size="small"
            onClick={() => onTrendChange('ALL')}
            color={selectedTrend === 'ALL' ? 'secondary' : 'default'}
            variant={selectedTrend === 'ALL' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
          />

          <Chip
            icon={<TrendingUp size={14} color={selectedTrend === 'MATH_IMPROVE' ? '#FFFFFF' : '#10B981'} />}
            label="پیشرفت در ریاضی"
            size="small"
            onClick={() => onTrendChange('MATH_IMPROVE')}
            color={selectedTrend === 'MATH_IMPROVE' ? 'success' : 'default'}
            variant={selectedTrend === 'MATH_IMPROVE' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
          />

          <Chip
            icon={<TrendingDown size={14} color={selectedTrend === 'MATH_DECLINE' ? '#FFFFFF' : '#F43F5E'} />}
            label="افت در ریاضی"
            size="small"
            onClick={() => onTrendChange('MATH_DECLINE')}
            color={selectedTrend === 'MATH_DECLINE' ? 'error' : 'default'}
            variant={selectedTrend === 'MATH_DECLINE' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
          />

          <Chip
            icon={<TrendingUp size={14} color={selectedTrend === 'TOTAL_IMPROVE' ? '#FFFFFF' : '#4F46E5'} />}
            label="پیشرفت کل"
            size="small"
            onClick={() => onTrendChange('TOTAL_IMPROVE')}
            color={selectedTrend === 'TOTAL_IMPROVE' ? 'primary' : 'default'}
            variant={selectedTrend === 'TOTAL_IMPROVE' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
          />

          <Chip
            icon={<TrendingDown size={14} color={selectedTrend === 'TOTAL_DECLINE' ? '#FFFFFF' : '#F43F5E'} />}
            label="افت کل"
            size="small"
            onClick={() => onTrendChange('TOTAL_DECLINE')}
            color={selectedTrend === 'TOTAL_DECLINE' ? 'error' : 'default'}
            variant={selectedTrend === 'TOTAL_DECLINE' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
          />
        </Stack>

        {/* Collapsible Section Visibility Toggles */}
        <Collapse in={showAdvanced}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Layers size={18} color="#4F46E5" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                نمایش / عدم نمایش بخش‌های کارنامه در خروجی چاپ:
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.academic}
                    onChange={(e) => onVisibilityChange('academic', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <BookOpen size={16} color="#4F46E5" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      تحلیل نمرات و نمودارها
                    </Typography>
                  </Stack>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.attendance}
                    onChange={(e) => onVisibilityChange('attendance', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <CalendarX2 size={16} color="#DC2626" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      غیبت و تاخیر
                    </Typography>
                  </Stack>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.discipline}
                    onChange={(e) => onVisibilityChange('discipline', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <ShieldCheck size={16} color="#059669" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      وضعیت انضباط
                    </Typography>
                  </Stack>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.homework}
                    onChange={(e) => onVisibilityChange('homework', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <CheckSquare size={16} color="#4F46E5" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      نرخ تکالیف
                    </Typography>
                  </Stack>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={visibility.advisor}
                    onChange={(e) => onVisibilityChange('advisor', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <Quote size={16} color="#D97706" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      یادداشت و امضای مشاور
                    </Typography>
                  </Stack>
                }
              />
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
