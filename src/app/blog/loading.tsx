import { Container, Grid, CircularProgress, Box } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
}
