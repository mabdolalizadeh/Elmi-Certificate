import React, { useState, useMemo } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import Sidebar from './components/Sidebar';
import FiltersDropdownToolbar from './components/FiltersDropdownToolbar';
import ReportCardPreviewer from './components/ReportCardPreviewer';
import ExportModal from './components/ExportModal';
import ActionSpeedDial from './components/ActionSpeedDial';
import GradeCustomizationModal from './components/GradeCustomizationModal';
import DownloadTemplateModal from './components/DownloadTemplateModal';
import { SAMPLE_STUDENTS, enrichStudentData, parseExcelFile } from './utils/excelService';
import {
  loadGradeConfigs,
  saveGradeConfigs,
  extractUniqueScopes,
  resolveConfigForStudent,
} from './utils/gradeConfigService';

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState('7th');

  // Initialize with empty array (no default/seed students)
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Grade customization settings state (synced with localStorage)
  const [gradeConfigs, setGradeConfigs] = useState(() => loadGradeConfigs());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [visibility, setVisibility] = useState({
    academic: true,
    attendance: true,
    discipline: true,
    homework: true,
    advisor: true,
  });

  const [exportModalState, setExportModalState] = useState({
    open: false,
    status: 'loading',
    errorMessage: '',
    count: 0,
  });

  const [notification, setNotification] = useState(null);

  // Available unique classes and grades
  const uniqueScopes = useMemo(() => extractUniqueScopes(students), [students]);

  const availableClasses = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [students]);

  const handleSaveGradeConfigs = (newConfigs) => {
    setGradeConfigs(newConfigs);
    saveGradeConfigs(newConfigs);
    setNotification({
      severity: 'success',
      message: 'تنظیمات اختصاصی با موفقیت ذخیره و اعمال گردید.',
    });
  };

  // Filter students based on search term, class, and trend
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (searchTerm && !s.name.includes(searchTerm)) {
        return false;
      }

      if (selectedClass !== 'ALL' && s.className !== selectedClass) {
        return false;
      }

      if (selectedTrend === 'MATH_IMPROVE' && s.mathTrend.status !== 'improvement') {
        return false;
      }
      if (selectedTrend === 'MATH_DECLINE' && s.mathTrend.status !== 'decline') {
        return false;
      }
      if (selectedTrend === 'TOTAL_IMPROVE' && s.overallTrend.status !== 'improvement') {
        return false;
      }
      if (selectedTrend === 'TOTAL_DECLINE' && s.overallTrend.status !== 'decline') {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedClass, selectedTrend]);

  // SpeedDial handlers
  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setNotification({
        severity: 'error',
        message: 'فرمت فایل نامعتبر است. لطفاً فایل با پسوند .xlsx یا .xls انتخاب فرمایید.',
      });
      return;
    }

    try {
      const result = await parseExcelFile(file);
      setStudents(result.students);
      setSelectedStudentIds(result.students.map((s) => s.id));
      setCurrentPreviewIndex(0);
      setNotification({
        severity: 'success',
        message: `اطلاعات ${result.totalRows} دانش‌آموز از فایل "${file.name}" با موفقیت بارگذاری و تحلیل شد.`,
      });
    } catch (err) {
      setNotification({
        severity: 'error',
        message: err.message || 'خطا در بارگذاری فایل اکسل رخ داد.',
      });
    }
  };

  const handleLoadDemo = () => {
    const mockStudents = SAMPLE_STUDENTS.map((item, idx) => enrichStudentData(item, idx));
    setStudents(mockStudents);
    setSelectedStudentIds(mockStudents.map((s) => s.id));
    setCurrentPreviewIndex(0);
    setNotification({
      severity: 'info',
      message: `اطلاعات نمونه شامل ${mockStudents.length} دانش‌آموز پایه هفتم بارگذاری شد.`,
    });
  };

  const handleToggleSelectAll = () => {
    const allFilteredSelected =
      filteredStudents.length > 0 &&
      filteredStudents.every((s) => selectedStudentIds.includes(s.id));

    if (allFilteredSelected) {
      const filteredIds = new Set(filteredStudents.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredStudents.map((s) => s.id);
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleVisibilityChange = (key, value) => {
    setVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportPdf = async () => {
    const studentsToExport = students.filter((s) => selectedStudentIds.includes(s.id));
    if (studentsToExport.length === 0) {
      setNotification({ severity: 'warning', message: 'حداقل یک دانش‌آموز را برای صدور PDF انتخاب نمایید.' });
      return;
    }

    setExportModalState({
      open: true,
      status: 'loading',
      errorMessage: '',
      count: studentsToExport.length,
    });

    try {
      const apiUrl = window.location.port === '5173' ? '/api/generate-pdf' : 'http://localhost:5001/api/generate-pdf';
      let response;

      const exportPayload = {
        students: studentsToExport,
        visibility,
        gradeConfigs,
      };

      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exportPayload),
        });
      } catch (networkErr) {
        response = await fetch('http://localhost:5001/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exportPayload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطا در دریافت پاسخ سرور (${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `کارنامه_افقی_پایه_هفتم_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportModalState((prev) => ({
        ...prev,
        status: 'success',
      }));
    } catch (err) {
      console.error('PDF Export Error:', err);
      setExportModalState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: err.message || 'خطا در برقراری ارتباط با سرویس سرور رخ داد.',
      }));
    }
  };

  const handleCloseExportModal = () => {
    setExportModalState((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: '#F8FAFC' }}>
      {/* Right Sidebar for switching between grades */}
      <Sidebar
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
        studentCount={students.length}
      />

      {/* Main Content Area (Left side in RTL) */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Filters Dropdown Toolbar */}
        <FiltersDropdownToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          selectedTrend={selectedTrend}
          onTrendChange={setSelectedTrend}
          availableClasses={availableClasses}
          visibility={visibility}
          onVisibilityChange={handleVisibilityChange}
          selectedStudentIds={selectedStudentIds}
          filteredStudents={filteredStudents}
          totalStudentsCount={students.length}
          onToggleSelectAll={handleToggleSelectAll}
          onExportPdf={handleExportPdf}
          isExporting={exportModalState.open && exportModalState.status === 'loading'}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Live Certificate Previewer */}
        <Box sx={{ flex: 1 }}>
          <ReportCardPreviewer
            students={filteredStudents}
            visibility={visibility}
            currentIndex={currentPreviewIndex}
            onIndexChange={setCurrentPreviewIndex}
            gradeConfigs={gradeConfigs}
          />
        </Box>
      </Box>

      {/* Grade Customization Settings Modal */}
      <GradeCustomizationModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        gradeConfigs={gradeConfigs}
        onSaveConfigs={handleSaveGradeConfigs}
        availableGrades={uniqueScopes.grades}
        availableClasses={uniqueScopes.classes}
      />

      {/* SpeedDial Floating Button for Upload and Download */}
      <ActionSpeedDial
        onFileSelect={handleFileSelect}
        onLoadDemo={handleLoadDemo}
        onOpenDownloadTemplate={() => setIsTemplateModalOpen(true)}
      />

      {/* Dynamic Excel Template Download Modal */}
      <DownloadTemplateModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        existingStudents={students}
        availableClasses={availableClasses}
      />

      {/* Export Loading & Feedback Modal */}
      <ExportModal
        open={exportModalState.open}
        studentCount={exportModalState.count}
        status={exportModalState.status}
        errorMessage={exportModalState.errorMessage}
        onClose={handleCloseExportModal}
      />

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={5000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert
            onClose={() => setNotification(null)}
            severity={notification.severity}
            sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
