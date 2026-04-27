import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import customerService from '../services/customerService'

const BulkUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState('')

  const showErrorDialog = (message) => {
    setErrorDialogMessage(message)
    setErrorDialogOpen(true)
  }

  const onFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setError('')
  }

  const onUpload = async () => {
    if (!selectedFile) {
      const message = 'Please choose an .xlsx file before uploading.'
      setError(message)
      showErrorDialog(message)
      return
    }

    if (!selectedFile.name.toLowerCase().endsWith('.xlsx')) {
      const message = 'Only .xlsx files are allowed.'
      setError(message)
      showErrorDialog(message)
      return
    }

    try {
      setLoading(true)
      setError('')
      const responseMessage = await customerService.uploadCustomerExcel(selectedFile)
      setSuccessMessage(responseMessage || 'Upload successful')
      setSuccessDialogOpen(true)
      setSelectedFile(null)
    } catch (err) {
      const backendMessage =
        typeof err?.response?.data === 'string' && err.response.data.trim()
          ? err.response.data
          : 'Failed to upload file. Please try again.'
      setError(backendMessage)
      showErrorDialog(backendMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Bulk Upload
      </Typography>

      <Paper variant="outlined" sx={{ mt: 3, p: 3, maxWidth: 640 }}>
        <Stack spacing={2}>
          <Typography variant="body1" color="text.secondary">
            Upload your customer Excel file in `.xlsx` format.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="outlined" component="label">
            Choose XLSX File
            <input type="file" hidden accept=".xlsx" onChange={onFileChange} />
          </Button>

          <Typography variant="body2" color={selectedFile ? 'text.primary' : 'text.secondary'}>
            {selectedFile ? `Selected: ${selectedFile.name}` : 'No file selected'}
          </Typography>

          <Box>
            <Button variant="contained" onClick={onUpload} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Complete</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mt: 1 }}>
            {successMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Failed</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 1 }}>
            {errorDialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BulkUploadPage
