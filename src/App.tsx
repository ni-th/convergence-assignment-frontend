import { Box, Button, Stack, Typography } from '@mui/material'

const App = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Box
        component="aside"
        sx={{
          width: 280,
          p: 3,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h6">
          Customer Actions
        </Typography>

        <Stack spacing={2}>
          <Button variant="contained" size="large" fullWidth>
            Create Customer
          </Button>
          <Button variant="contained" size="large" fullWidth>
            Update Customer
          </Button>
          <Button variant="contained" size="large" fullWidth>
            View Customer
          </Button>
        </Stack>
      </Box>

      <Box component="main" sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
      </Box>
    </Box>
  )
}

export default App