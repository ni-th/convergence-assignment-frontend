import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        minHeight: 56,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        CMS &copy; 2024. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer
