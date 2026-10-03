import React, { useRef } from 'react';
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Tooltip,
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
      icon: <UploadCloud size={20} />,
      name: 'بارگذاری فایل اکسل جدید',
      onClick: () => fileInputRef.current?.click(),
      color: '#4F46E5',
    },
    {
      icon: <FileDown size={20} />,
      name: 'دانلود قالب استاندارد اکسل (XLSX)',
      onClick: downloadExcelTemplate,
      color: '#059669',
    },
    {
      icon: <Sparkles size={20} />,
      name: 'بارگذاری اطلاعات نمونه پایه هفتم',
      onClick: onLoadDemo,
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
        sx={{
          position: 'fixed',
          bottom: 28,
          left: 28,
          zIndex: 1100,
          '& .MuiFab-primary': {
            bgcolor: '#4F46E5',
            '&:hover': {
              bgcolor: '#4338CA',
            },
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
          },
        }}
        icon={<SpeedDialIcon icon={<Plus size={24} />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: '#FFFFFF',
                color: action.color,
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                '&:hover': {
                  bgcolor: '#F8FAFC',
                },
              },
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                bgcolor: 'rgba(15, 23, 42, 0.9)',
                color: '#FFFFFF',
                borderRadius: 2,
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                px: 1.5,
                py: 0.5,
              },
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
}
