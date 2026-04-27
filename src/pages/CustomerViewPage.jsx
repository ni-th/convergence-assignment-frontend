import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import customerService from '../services/customerService'

const CustomerViewPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const customerId = useMemo(() => Number(searchParams.get('id')), [searchParams])

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId || Number.isNaN(customerId)) {
        setError('Customer id is missing. Open view from Customer List.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const result = await customerService.getCustomerById(customerId)
        setCustomer(result)
      } catch (err) {
        setError('Failed to load customer details.')
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()
  }, [customerId])

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Customer Details
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/customers')}>
          Back to List
        </Button>
        {customerId && !Number.isNaN(customerId) && (
          <Button variant="contained" onClick={() => navigate(`/customers/edit?id=${customerId}`)}>
            Edit Customer
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Typography color="text.secondary">Loading customer details...</Typography>}

      {customer && (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 700 }}>
          <Stack spacing={1.5}>
            <Typography>
              <strong>ID:</strong> {customer.id}
            </Typography>
            <Typography>
              <strong>Name:</strong> {customer.name}
            </Typography>
            <Typography>
              <strong>NIC:</strong> {customer.nic}
            </Typography>
            <Typography>
              <strong>Mobile Number(s):</strong> {customer.mobileNumbers?.join(', ') || '-'}
            </Typography>
            <Typography>
              <strong>Date Of Birth:</strong> {customer.dateOfBirth}
            </Typography>
            <Typography>
              <strong>Family Members:</strong> {customer.familyMembers?.length ?? 0}
            </Typography>
            <Typography>
              <strong>Addresses:</strong> {customer.addresses?.length ?? 0}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default CustomerViewPage
