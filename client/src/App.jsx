import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './components/Header';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6, flex: 1 }}>
        {/* Modules will be connected here */}
      </Container>
    </Box>
  );
}
