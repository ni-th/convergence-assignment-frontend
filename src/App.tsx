import { Box, Typography } from '@mui/material'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'

const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Header />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <Box component="main" sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4">
            Dashboard
          </Typography>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default App