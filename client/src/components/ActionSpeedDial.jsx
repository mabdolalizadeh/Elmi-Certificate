import React, { useRef, useState } from 'react';
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Box,
  Typography,
} from '@mui/material';
import {
  UploadCloud,
  FileDown,
  Sparkles,
  Plus,
} from 'lucide-react';
import { downloadExcelTemplate } from '../utils/excelService';

export default function ActionSpeedDial({
  onFileSelect,
  onLoadDemo,
}) {
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const actions = [
    {
      icon: <UploadCloud size={22} />,
      name: 'بارگذاری فایل اکسل جدید',
      description: 'انتخاب و پردازش فایل اکسل نمرات و وضعیت دانش‌آموزان',
      onClick: () => {
        fileInputRef.current?.click();
        setOpen(false);
      },
      color: '#4F46E5',
    },
    {
      icon: <FileDown size={22} />,
      name: 'دانلود قالب استاندارد اکسل',
      description: 'دریافت فایل نمونه XLSX با سرستون‌های ۱۲ گانه فارسی',
      onClick: () => {
        downloadExcelTemplate();
        setOpen(false);
      },
      color: '#059669',
    },
    {
      icon: <Sparkles size={22} />,
      name: 'بارگذاری اطلاعات نمونه پایه هفتم',
      description: 'بارگذاری داده‌های پیش‌فرض ۶ دانش‌آموز جهت تست فوری',
      onClick: () => {
        onLoadDemo();
        setOpen(false);
      },
      color: '#D97706',
    },
  ];

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
      />

      <SpeedDial
        ariaLabel="عملیات اکسل و داده‌ها"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{
          position: 'fixed',
          bottom: 28,
          left: '28px !important',
          right: 'auto !important',
          zIndex: 1200,
          '& .MuiFab-primary': {
            bgcolor: '#4F46E5',
            width: 58,
            height: 58,
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
            '&:hover': {
              bgcolor: '#4338CA',
            },
          },
        }}
        icon={<SpeedDialIcon icon={<Plus size={26} />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={
              <Box sx={{ textAlign: 'right', p: 0.5, minWidth: 200, direction: 'rtl' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.82rem' }}>
                  {action.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E2E8F0', display: 'block', fontSize: '0.72rem', mt: 0.4, lineHeight: 1.4 }}>
                  {action.description}
                </Typography>
              </Box>
            }
            tooltipOpen
            onClick={action.onClick}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: '#FFFFFF',
                color: action.color,
                width: 48,
                height: 48,
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#F8FAFC',
                  transform: 'scale(1.1)',
                },
              },
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                bgcolor: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                borderRadius: 2.5,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'normal',
                px: 1.8,
                py: 1,
              },
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
}
