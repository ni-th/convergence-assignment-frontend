import { Box, Typography } from '@mui/material'

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        height: 72,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        CMS
      </Typography>
    </Box>
  )
}

export default Header
