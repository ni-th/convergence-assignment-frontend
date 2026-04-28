import { useState, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
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
  const [uploadId, setUploadId] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    let intervalId
    if (uploadId && polling) {
      intervalId = setInterval(async () => {
        try {
          const status = await customerService.getUploadStatus(uploadId)
          setUploadStatus(status)

          if (status.status === 'COMPLETED') {
            setPolling(false)
            setSuccessMessage(`Upload completed successfully! Processed ${status.processedRecords || 0} records.`)
            setSuccessDialogOpen(true)
            setSelectedFile(null)
            setUploadId(null)
            setUploadStatus(null)
          } else if (status.status === 'FAILED') {
            setPolling(false)
            setError(status.message || 'Upload failed')
            showErrorDialog(status.message || 'Upload failed')
            setUploadId(null)
            setUploadStatus(null)
          }
        } catch (err) {
          setPolling(false)
          setError('Failed to check upload status')
          showErrorDialog('Failed to check upload status')
          setUploadId(null)
          setUploadStatus(null)
        }
      }, 2000) // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [uploadId, polling])

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
      const response = await customerService.uploadCustomerExcelAsync(selectedFile)
      setUploadId(response.uploadId)
      setUploadStatus({ status: 'STARTED', message: response.message })
      setPolling(true)
    } catch (err) {
      const backendMessage =
        typeof err?.response?.data === 'string' && err.response.data.trim()
          ? err.response.data
          : 'Failed to start upload. Please try again.'
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

          {uploadStatus && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status: {uploadStatus.status}
              </Typography>
              {uploadStatus.message && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {uploadStatus.message}
                </Typography>
              )}
              {uploadStatus.totalRecords && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Progress: {uploadStatus.processedRecords || 0} / {uploadStatus.totalRecords} records
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadStatus.totalRecords > 0 ? ((uploadStatus.processedRecords || 0) / uploadStatus.totalRecords) * 100 : 0}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
              {polling && (
                <Typography variant="body2" color="text.secondary">
                  Checking status...
                </Typography>
              )}
            </Paper>
          )}

          <Button variant="outlined" component="label">
            Choose XLSX File
            <input type="file" hidden accept=".xlsx" onChange={onFileChange} />
          </Button>

          <Typography variant="body2" color={selectedFile ? 'text.primary' : 'text.secondary'}>
            {selectedFile ? `Selected: ${selectedFile.name}` : 'No file selected'}
          </Typography>

          <Box>
            <Button 
              variant="contained" 
              onClick={onUpload} 
              disabled={loading || polling}
            >
              {loading ? 'Starting Upload...' : polling ? 'Upload in Progress...' : 'Upload'}
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
