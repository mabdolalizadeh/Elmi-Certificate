import React from 'react';
import { Box, Typography, Chip, Container, Stack } from '@mui/material';
import { Award, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function Header() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
        color: '#FFFFFF',
        pt: { xs: 4, md: 5 },
        pb: { xs: 4, md: 5 },
        px: 2,
        borderRadius: { xs: '0 0 24px 24px', md: '0 0 32px 32px' },
        boxShadow: '0 10px 30px -10px rgba(30, 27, 75, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          right: '20%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={3}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  p: 0.75,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="لوگوی سامانه"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                سامانه هوشمند صدور و تحلیل کارنامه
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 750, fontSize: '0.98rem' }}>
              تولید کارنامه‌های جامع دانش‌آموزی در قالب افقی (Landscape) با نمودار تحلیلی رشد، شاخص‌های انضباط و حضور، و دانلود چندصفحه‌ای PDF
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip
              icon={<Sparkles size={16} color="#FFFFFF" />}
              label="طراحی افقی استاندارد A4/A5"
              sx={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                px: 0.5,
              }}
            />
            <Chip
              icon={<FileSpreadsheet size={16} color="#34D399" />}
              label="ورودی اکسل پویا"
              sx={{
                background: 'rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(6px)',
                color: '#A7F3D0',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                px: 0.5,
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
