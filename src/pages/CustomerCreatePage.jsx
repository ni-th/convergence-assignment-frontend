import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import customerService from '../services/customerService'

const CustomerCreatePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    nic: '',
    dateOfBirth: '',
    mobileNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const created = await customerService.createCustomer({
        name: form.name,
        nic: form.nic,
        dateOfBirth: form.dateOfBirth,
        mobileNumbers: [form.mobileNumber],
        familyMembers: [],
        addresses: [],
      })

      navigate(`/customers/view?id=${created.id}`)
    } catch (err) {
      setError('Failed to create customer. Please check your values and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Create Customer
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
            type="date"
            value={form.dateOfBirth}
            onChange={onChange('dateOfBirth')}
            required
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/customers')}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default CustomerCreatePage
