import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Divider,
  IconButton,
  Chip,
  Paper,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Settings,
  UploadCloud,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Type,
  AlignRight,
  AlignCenter,
  AlignLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  DEFAULT_GRADE_CONFIG,
  exportConfigsToJson,
  importConfigsFromJson,
} from '../utils/gradeConfigService';
import { toPersianDigits } from '../utils/excelService';

export default function GradeCustomizationModal({
  open,
  onClose,
  gradeConfigs = {},
  onSaveConfigs,
  availableGrades = [],
  availableClasses = [],
}) {
  // Active scope tab (e.g. 'DEFAULT', 'پایه هفتم', etc.)
  const [activeTab, setActiveTab] = useState('DEFAULT');
  const [localConfigs, setLocalConfigs] = useState(() => ({ ...gradeConfigs }));
  const [alertInfo, setAlertInfo] = useState(null);
  const logoFileInputRef = useRef(null);
  const jsonFileInputRef = useRef(null);

  // Sync local state when modal opens
  React.useEffect(() => {
    if (open) {
      setLocalConfigs({ ...gradeConfigs });
      setAlertInfo(null);
    }
  }, [open, gradeConfigs]);

  // Current config being edited
  const currentConfig = localConfigs[activeTab] || {
    ...(localConfigs.DEFAULT || DEFAULT_GRADE_CONFIG),
  };

  const handleUpdateCurrentField = (field, value) => {
    setLocalConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] || prev.DEFAULT || DEFAULT_GRADE_CONFIG),
        [field]: value,
      },
    }));
  };

  const handleUpdateWatermarkField = (field, value) => {
    setLocalConfigs((prev) => {
      const targetConfig = prev[activeTab] || prev.DEFAULT || DEFAULT_GRADE_CONFIG;
      return {
        ...prev,
        [activeTab]: {
          ...targetConfig,
          watermark: {
            ...(targetConfig.watermark || DEFAULT_GRADE_CONFIG.watermark),
            [field]: value,
          },
        },
      };
    });
  };

  // Logo file upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlertInfo({ severity: 'error', message: 'لطفاً یک فایل تصویری (PNG, JPG, SVG) انتخاب نمایید.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      handleUpdateCurrentField('logoUrl', base64);
      setAlertInfo({ severity: 'success', message: 'لوگوی تصویر با موفقیت بارگذاری شد.' });
    };
    reader.readAsDataURL(file);

    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    handleUpdateCurrentField('logoUrl', '');
    setAlertInfo({ severity: 'info', message: 'لوگو حذف شد و نشان پیش‌فرض جایگزین گردید.' });
  };

  // Reset to default for active tab
  const handleResetActiveTab = () => {
    if (activeTab === 'DEFAULT') {
      handleUpdateCurrentField('title', DEFAULT_GRADE_CONFIG.title);
      handleUpdateCurrentField('subtitle', DEFAULT_GRADE_CONFIG.subtitle);
      handleUpdateCurrentField('examPeriod', DEFAULT_GRADE_CONFIG.examPeriod);
      handleUpdateCurrentField('logoUrl', '');
      handleUpdateCurrentField('logoAlignment', 'right');
      handleUpdateCurrentField('logoSize', 54);
      handleUpdateCurrentField('watermark', { ...DEFAULT_GRADE_CONFIG.watermark });
    } else {
      // Inherit from DEFAULT
      setLocalConfigs((prev) => {
        const next = { ...prev };
        delete next[activeTab];
        return next;
      });
    }
    setAlertInfo({ severity: 'info', message: `تنظیمات "${activeTab}" به حالت پیش‌فرض بازگردانی شد.` });
  };

  // Import JSON handler
  const handleImportJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importConfigsFromJson(file);
      setLocalConfigs(imported);
      setAlertInfo({ severity: 'success', message: 'تنظیمات با موفقیت از فایل JSON بارگذاری شدند.' });
    } catch (err) {
      setAlertInfo({ severity: 'error', message: err.message });
    }

    if (jsonFileInputRef.current) {
      jsonFileInputRef.current.value = '';
    }
  };

  // Save changes
  const handleSave = () => {
    onSaveConfigs(localConfigs);
    onClose();
  };

  // Build tabs list: DEFAULT + available detected grades
  const allTabs = [
    { id: 'DEFAULT', label: 'عمومی (همه پایه‌ها)' },
    ...availableGrades.map((g) => ({ id: g, label: g })),
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
          direction: 'rtl',
        },
      }}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={logoFileInputRef}
        onChange={handleLogoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={jsonFileInputRef}
        onChange={handleImportJson}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* Modal Title Bar */}
      <DialogTitle sx={{ p: 2.5, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={22} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1B4B', fontSize: '1.15rem' }}>
                تنظیمات اختصاصی و شخصی‌سازی کارنامه
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                شخصی‌سازی عناوین، نشان مدرسه، لوگو و واترمارک پس‌زمینه به تفکیک پایه تحصیلی
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {/* Alerts Feedback */}
        {alertInfo && (
          <Alert
            severity={alertInfo.severity}
            onClose={() => setAlertInfo(null)}
            sx={{ mb: 2.5, borderRadius: 2.5, fontWeight: 600 }}
          >
            {alertInfo.message}
          </Alert>
        )}

        {/* Scope Tabs (Grades) */}
        <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.88rem',
                minHeight: 46,
              },
            }}
          >
            {allTabs.map((tab) => {
              const hasCustom = localConfigs[tab.id] && tab.id !== 'DEFAULT';
              return (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <span>{tab.label}</span>
                      {hasCustom && (
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981' }} />
                      )}
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        <Stack spacing={3}>
          {/* SECTION 1: HEADER & TITLES */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', mb: 2 }}>
              ۱. عناوین و اطلاعات هدر کارنامه ({activeTab === 'DEFAULT' ? 'عمومی' : activeTab})
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="نام مجتمع آموزشی / سربرگ اصلی"
                value={currentConfig.title || ''}
                onChange={(e) => handleUpdateCurrentField('title', e.target.value)}
                placeholder="مثال: مجتمع آموزشی و دبیرستان نمونه رشد"
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#FFFFFF' }}
              />

              <TextField
                fullWidth
                size="small"
                label="عنوان گزارش و زیرنویس کارنامه"
                value={currentConfig.subtitle || ''}
                onChange={(e) => handleUpdateCurrentField('subtitle', e.target.value)}
                placeholder="مثال: کارنامه رسمی عملکرد تحصیلی، رفتار کلاسی و تحلیل رشد مستمر دانش‌آموز"
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#FFFFFF' }}
              />

              <TextField
                fullWidth
                size="small"
                label="دوره آزمون و سال تحصیلی"
                value={currentConfig.examPeriod || ''}
                onChange={(e) => handleUpdateCurrentField('examPeriod', e.target.value)}
                placeholder="مثال: سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم"
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: '#FFFFFF' }}
              />
            </Stack>
          </Paper>

          {/* SECTION 2: LOGO CONFIGURATION */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                ۲. نشان و لوگوی اختصاصی مدرسه
              </Typography>
              {currentConfig.logoUrl && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<Trash2 size={15} />}
                  onClick={handleRemoveLogo}
                  sx={{ borderRadius: 2 }}
                >
                  حذف لوگو
                </Button>
              )}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              {/* Logo Preview */}
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 3,
                  border: '2px dashed #CBD5E1',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                }}
              >
                {currentConfig.logoUrl ? (
                  <Box
                    component="img"
                    src={currentConfig.logoUrl}
                    alt="Logo Preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <ImageIcon size={34} color="#94A3B8" />
                )}
              </Box>

              {/* Upload & Alignment Controls */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <Stack spacing={1.8}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<UploadCloud size={16} />}
                      onClick={() => logoFileInputRef.current?.click()}
                      sx={{ bgcolor: '#4F46E5', borderRadius: 2.5 }}
                    >
                      انتخاب فایل تصویر لوگو
                    </Button>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      فرمت‌های مجاز: PNG, JPG, SVG (حجم کمتر از ۱ مگابایت)
                    </Typography>
                  </Stack>

                  {/* Alignment & Size Controls */}
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                    <Box sx={{ width: { xs: '100%', md: 240 } }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block', mb: 0.5 }}>
                        اندازه لوگو در هدر ({toPersianDigits(currentConfig.logoSize || 54)} پیکسل):
                      </Typography>
                      <Slider
                        size="small"
                        value={currentConfig.logoSize || 54}
                        min={36}
                        max={80}
                        step={2}
                        onChange={(e, val) => handleUpdateCurrentField('logoSize', val)}
                        sx={{ color: '#4F46E5' }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block', mb: 0.5 }}>
                        موقعیت قرارگیری در هدر:
                      </Typography>
                      <RadioGroup
                        row
                        value={currentConfig.logoAlignment || 'right'}
                        onChange={(e) => handleUpdateCurrentField('logoAlignment', e.target.value)}
                      >
                        <FormControlLabel value="right" control={<Radio size="small" />} label={<Typography variant="caption">سمت راست</Typography>} />
                        <FormControlLabel value="center" control={<Radio size="small" />} label={<Typography variant="caption">وسط</Typography>} />
                        <FormControlLabel value="left" control={<Radio size="small" />} label={<Typography variant="caption">سمت چپ</Typography>} />
                      </RadioGroup>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 3: WATERMARK CONFIGURATION */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                  ۳. واترمارک امنیتی پس‌زمینه (Watermark)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  نمایش محو در پس‌زمینه جهت ارتقای رسمیت سند و پیشگیری از جعل
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(currentConfig.watermark?.enabled)}
                    onChange={(e) => handleUpdateWatermarkField('enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: currentConfig.watermark?.enabled ? '#4F46E5' : '#64748B' }}>
                    {currentConfig.watermark?.enabled ? 'فعال' : 'غیرفعال'}
                  </Typography>
                }
              />
            </Stack>

            {currentConfig.watermark?.enabled && (
              <Stack spacing={2.2} sx={{ mt: 1 }}>
                <Divider />

                {/* Watermark Type */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                    نوع واترمارک:
                  </Typography>
                  <RadioGroup
                    row
                    value={currentConfig.watermark?.type || 'text'}
                    onChange={(e) => handleUpdateWatermarkField('type', e.target.value)}
                  >
                    <FormControlLabel
                      value="text"
                      control={<Radio size="small" />}
                      label={
                        <Stack direction="row" spacing={0.6} alignItems="center">
                          <Type size={16} />
                          <Typography variant="body2">واترمارک متنی</Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      value="logo"
                      control={<Radio size="small" />}
                      label={
                        <Stack direction="row" spacing={0.6} alignItems="center">
                          <ImageIcon size={16} />
                          <Typography variant="body2">واترمارک لوگو / تصویر</Typography>
                        </Stack>
                      }
                    />
                  </RadioGroup>
                </Stack>

                {/* Text input if text watermark */}
                {currentConfig.watermark?.type !== 'logo' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="متن واترمارک"
                    value={currentConfig.watermark?.text || ''}
                    onChange={(e) => handleUpdateWatermarkField('text', e.target.value)}
                    placeholder="مثال: دبیرستان رشد • محرمانه"
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: '#FFFFFF' }}
                  />
                )}

                {/* Sliders: Opacity & Rotation */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                        شفافیت و وضوح واترمارک:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#4F46E5' }}>
                        ٪{toPersianDigits(Math.round((currentConfig.watermark?.opacity || 0.08) * 100))}
                      </Typography>
                    </Stack>
                    <Slider
                      size="small"
                      value={Math.round((currentConfig.watermark?.opacity || 0.08) * 100)}
                      min={4}
                      max={25}
                      step={1}
                      onChange={(e, val) => handleUpdateWatermarkField('opacity', val / 100)}
                      sx={{ color: '#4F46E5' }}
                    />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                      (میزان ۵٪ تا ۱۲٪ جهت عدم تداخل با خوانایی نمرات پیشنهاد می‌شود)
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                        زاویه چرخش واترمارک:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#4F46E5' }}>
                        {toPersianDigits(currentConfig.watermark?.rotation ?? -30)} درجه
                      </Typography>
                    </Stack>
                    <Slider
                      size="small"
                      value={currentConfig.watermark?.rotation ?? -30}
                      min={-45}
                      max={45}
                      step={5}
                      onChange={(e, val) => handleUpdateWatermarkField('rotation', val)}
                      sx={{ color: '#4F46E5' }}
                    />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                      (زاویه مورب استاندارد: ۳۰- درجه)
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      {/* Modal Actions Footer */}
      <DialogActions sx={{ p: 2.5, px: 3, borderTop: '1px solid #E2E8F0', justifyContent: 'space-between' }}>
        {/* Import / Export Utilities */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="خروجی فایل تنظیمات JSON">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={() => exportConfigsToJson(localConfigs)}
              sx={{ borderColor: '#CBD5E1', color: '#475569', borderRadius: 2 }}
            >
              خروجی JSON
            </Button>
          </Tooltip>

          <Tooltip title="بارگذاری فایل تنظیمات JSON">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Upload size={16} />}
              onClick={() => jsonFileInputRef.current?.click()}
              sx={{ borderColor: '#CBD5E1', color: '#475569', borderRadius: 2 }}
            >
              بارگذاری JSON
            </Button>
          </Tooltip>

          <Button
            size="small"
            color="warning"
            startIcon={<RotateCcw size={16} />}
            onClick={handleResetActiveTab}
            sx={{ borderRadius: 2 }}
          >
            بازنشانی این بخش
          </Button>
        </Stack>

        {/* Primary Save & Close Buttons */}
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2.5, px: 2.5 }}>
            انصراف
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle2 size={18} />}
            onClick={handleSave}
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
              borderRadius: 2.5,
              px: 3.5,
              fontWeight: 700,
            }}
          >
            ذخیره و اعمال تنظیمات
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
