

import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
              }}
            >
              URBIO LED
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
