import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import FileImportCard from './components/FileImportCard';
import { SAMPLE_STUDENTS, enrichStudentData } from './utils/excelService';

export default function App() {
  // Initialize with sample students so UI is immediately rich and testable
  const [students, setStudents] = useState(() =>
    SAMPLE_STUDENTS.map((item, idx) => enrichStudentData(item, idx))
  );

  const handleStudentsLoaded = (loadedStudents) => {
    setStudents(loadedStudents);
  };

  const handleReset = () => {
    setStudents([]);
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
      </Container>
    </Box>
  );
}
