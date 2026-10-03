import React, { useState, useMemo } from 'react';
import { Box, Container, Snackbar, Alert } from '@mui/material';
import Header from './components/Header';
import FileImportCard from './components/FileImportCard';
import ControlBar from './components/ControlBar';
import ReportCardPreviewer from './components/ReportCardPreviewer';
import { SAMPLE_STUDENTS, enrichStudentData } from './utils/excelService';

export default function App() {
  // Initialize with sample students so UI is immediately rich and interactive
  const [students, setStudents] = useState(() =>
    SAMPLE_STUDENTS.map((item, idx) => enrichStudentData(item, idx))
  );

  const [selectedStudentIds, setSelectedStudentIds] = useState(() =>
    SAMPLE_STUDENTS.map((_, idx) => `student-${idx + 1}`)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const [visibility, setVisibility] = useState({
    academic: true,
    attendance: true,
    discipline: true,
    homework: true,
    advisor: true,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Available unique classes
  const availableClasses = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set);
  }, [students]);

  // Filter students based on search term, class, and trend
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search filter
      if (searchTerm && !s.name.includes(searchTerm)) {
        return false;
      }

      // Class filter
      if (selectedClass !== 'ALL' && s.className !== selectedClass) {
        return false;
      }

      // Trend filter
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

  const handleStudentsLoaded = (loadedStudents) => {
    setStudents(loadedStudents);
    setSelectedStudentIds(loadedStudents.map((s) => s.id));
    setCurrentPreviewIndex(0);
  };

  const handleReset = () => {
    setStudents([]);
    setSelectedStudentIds([]);
    setCurrentPreviewIndex(0);
  };

  const handleToggleSelectAll = () => {
    const allFilteredSelected = filteredStudents.every((s) => selectedStudentIds.includes(s.id));
    if (allFilteredSelected) {
      // Deselect filtered
      const filteredIds = new Set(filteredStudents.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Select all filtered
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

    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:5001/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: studentsToExport,
          visibility,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطا در دریافت پاسخ سرور (${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `کارنامه_افقی_دانش‌آموزان_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setNotification({
        severity: 'success',
        message: `فایل PDF چندصفحه‌ای شامل ${studentsToExport.length} کارنامه با موفقیت دانلود شد.`,
      });
    } catch (err) {
      setNotification({
        severity: 'error',
        message: `خطا در ساخت PDF: ${err.message}. لطفاً بررسی نمایید که سرویس سرور (Port 5001) فعال باشد.`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6, flex: 1 }}>
        <FileImportCard
          onStudentsLoaded={handleStudentsLoaded}
          currentCount={students.length}
          onReset={handleReset}
        />

        {students.length > 0 && (
          <>
            <ControlBar
              students={students}
              filteredStudents={filteredStudents}
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
              onToggleSelectAll={handleToggleSelectAll}
              onExportPdf={handleExportPdf}
              isExporting={isExporting}
            />

            <ReportCardPreviewer
              students={filteredStudents}
              visibility={visibility}
              currentIndex={currentPreviewIndex}
              onIndexChange={setCurrentPreviewIndex}
            />
          </>
        )}
      </Container>

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={6000}
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
