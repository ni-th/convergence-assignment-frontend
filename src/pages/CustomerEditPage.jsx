import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import customerService from '../services/customerService'

const CustomerEditPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const customerId = useMemo(() => Number(searchParams.get('id')), [searchParams])

  const [form, setForm] = useState({
    name: '',
    nic: '',
    dateOfBirth: '',
    mobileNumber: '',
    familyMembers: [],
    addresses: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId || Number.isNaN(customerId)) {
        setError('Customer id is missing. Open edit from Customer List.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const customer = await customerService.getCustomerById(customerId)
        setForm({
          name: customer.name ?? '',
          nic: customer.nic ?? '',
          dateOfBirth: customer.dateOfBirth ?? '',
          mobileNumber: customer.mobileNumbers?.[0] ?? '',
          familyMembers: customer.familyMembers ?? [],
          addresses: customer.addresses ?? [],
        })
      } catch (err) {
        setError('Failed to load customer details.')
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()
  }, [customerId])

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!customerId || Number.isNaN(customerId)) {
      setError('Customer id is missing. Open edit from Customer List.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await customerService.updateCustomer(customerId, form)
      navigate(`/customers/view?id=${customerId}`)
    } catch (err) {
      setError('Failed to update customer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Edit Customer
      </Typography>

      <Paper component="form" variant="outlined" onSubmit={onSubmit} sx={{ mt: 3, p: 3, maxWidth: 640 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField label="Name" value={form.name} onChange={onChange('name')} required fullWidth />
          <TextField label="NIC" value={form.nic} onChange={onChange('nic')} required fullWidth />
          <TextField
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={onChange('mobileNumber')}
            required
            fullWidth
          />
          <TextField
            label="Date Of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={onChange('dateOfBirth')}
            required
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/customers')}>
              Back to List
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default CustomerEditPage
