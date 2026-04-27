import { Box, Button, Stack } from '@mui/material'

const Sidebar = () => {
  return (
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
  )
}

export default Sidebar
