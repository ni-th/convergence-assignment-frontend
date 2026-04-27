import { Box, Button, Stack } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Customer List', to: '/customers' },
    { label: 'Create Customer', to: '/customers/create' },
    { label: 'Update Customer', to: '/customers/edit' },
    { label: 'View Customer', to: '/customers/view' },
    { label: 'Bulk Upload', to: '/customers/bulk-upload' },
  ]

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
        {navItems.map((item) => {
          const isActive = location.pathname === item.to

          return (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              variant={isActive ? 'contained' : 'outlined'}
              size="large"
              fullWidth
            >
              {item.label}
            </Button>
          )
        })}
      </Stack>
    </Box>
  )
}

export default Sidebar
