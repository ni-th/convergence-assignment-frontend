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
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import customerService from '../services/customerService'

const MAX_MOBILE_NUMBERS = 3
const MAX_ADDRESSES = 3

const createEmptyAddress = () => ({
  addressLine1: '',
  addressLine2: '',
  city: { city: '' },
  country: { country: '' },
})

const getBackendErrorMessage = (err, fallbackMessage) => {
  const data = err?.response?.data

  if (!data) {
    return fallbackMessage
  }

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (item?.defaultMessage) {
          return item.defaultMessage
        }

        return ''
      })
      .filter(Boolean)
      .join(', ')
  }

  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    const firstFieldError = Object.entries(data.fieldErrors)
      .map(([field, message]) => {
        if (Array.isArray(message)) {
          return `${field}: ${message.join(', ')}`
        }

        return `${field}: ${String(message)}`
      })
      .find(Boolean)

    if (firstFieldError) {
      return firstFieldError
    }
  }

  return fallbackMessage
}

const CustomerCreatePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    nic: '',
    dateOfBirth: '',
    mobileNumbers: [''],
    familyMembers: [],
    addresses: [createEmptyAddress()],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState('')

  const showErrorDialog = (message) => {
    setErrorDialogMessage(message)
    setErrorDialogOpen(true)
  }

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const onMobileNumberChange = (index) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      mobileNumbers: prev.mobileNumbers.map((mobileNumber, currentIndex) =>
        currentIndex === index ? value : mobileNumber,
      ),
    }))
  }

  const onAddMobileNumber = () => {
    setForm((prev) => {
      if (prev.mobileNumbers.length >= MAX_MOBILE_NUMBERS) {
        return prev
      }

      return {
        ...prev,
        mobileNumbers: [...prev.mobileNumbers, ''],
      }
    })
  }

  const onRemoveMobileNumber = (index) => {
    setForm((prev) => {
      if (prev.mobileNumbers.length <= 1) {
        return prev
      }

      return {
        ...prev,
        mobileNumbers: prev.mobileNumbers.filter((_, currentIndex) => currentIndex !== index),
      }
    })
  }

  const onAddressLineChange = (index, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      addresses: prev.addresses.map((address, currentIndex) =>
        currentIndex === index ? { ...address, [field]: value } : address,
      ),
    }))
  }

  const onAddressNestedChange = (index, nestedField) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      addresses: prev.addresses.map((address, currentIndex) => {
        if (currentIndex !== index) {
          return address
        }

        if (nestedField === 'city') {
          return { ...address, city: { city: value } }
        }

        return { ...address, country: { country: value } }
      }),
    }))
  }

  const onAddAddress = () => {
    setForm((prev) => {
      if (prev.addresses.length >= MAX_ADDRESSES) {
        return prev
      }

      return {
        ...prev,
        addresses: [...prev.addresses, createEmptyAddress()],
      }
    })
  }

  const onRemoveAddress = (index) => {
    setForm((prev) => {
      if (prev.addresses.length <= 1) {
        return prev
      }

      return {
        ...prev,
        addresses: prev.addresses.filter((_, currentIndex) => currentIndex !== index),
      }
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const sanitizedMobileNumbers = form.mobileNumbers.map((value) => value.trim()).filter(Boolean)
      const sanitizedAddresses = form.addresses
        .map((address) => ({
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2.trim(),
          city: { city: address.city.city.trim() },
          country: { country: address.country.country.trim() },
        }))
        .filter(
          (address) =>
            address.addressLine1 || address.addressLine2 || address.city.city || address.country.country,
        )

      const created = await customerService.createCustomer({
        name: form.name,
        nic: form.nic,
        dateOfBirth: form.dateOfBirth,
        mobileNumbers: sanitizedMobileNumbers,
        familyMembers: form.familyMembers,
        addresses: sanitizedAddresses,
      })

      navigate(`/customers/view?id=${created.id}`)
    } catch (err) {
      const backendMessage = getBackendErrorMessage(
        err,
        'Failed to create customer. Please check your values and try again.',
      )
      setError(backendMessage)
      showErrorDialog(backendMessage)
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

          <Typography variant="h6">Mobile Numbers</Typography>
          {form.mobileNumbers.map((mobileNumber, index) => (
            <Stack key={`mobile-${index}`} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={`Mobile Number ${index + 1}`}
                value={mobileNumber}
                onChange={onMobileNumberChange(index)}
                required={index === 0}
                fullWidth
              />
              {form.mobileNumbers.length > 1 && (
                <Button type="button" variant="outlined" color="error" onClick={() => onRemoveMobileNumber(index)}>
                  Remove
                </Button>
              )}
            </Stack>
          ))}
          {form.mobileNumbers.length < MAX_MOBILE_NUMBERS && (
            <Button type="button" variant="text" onClick={onAddMobileNumber} sx={{ alignSelf: 'flex-start' }}>
              Add Mobile Number
            </Button>
          )}

          <Typography variant="h6">Addresses</Typography>
          {form.addresses.map((address, index) => (
            <Paper key={`address-${index}`} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label={`Address Line 1 (${index + 1})`}
                  value={address.addressLine1}
                  onChange={onAddressLineChange(index, 'addressLine1')}
                  fullWidth
                />
                <TextField
                  label="Address Line 2"
                  value={address.addressLine2}
                  onChange={onAddressLineChange(index, 'addressLine2')}
                  fullWidth
                />
                <TextField
                  label="City"
                  value={address.city.city}
                  onChange={onAddressNestedChange(index, 'city')}
                  fullWidth
                />
                <TextField
                  label="Country"
                  value={address.country.country}
                  onChange={onAddressNestedChange(index, 'country')}
                  fullWidth
                />
                {form.addresses.length > 1 && (
                  <Button type="button" variant="outlined" color="error" onClick={() => onRemoveAddress(index)}>
                    Remove Address
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
          {form.addresses.length < MAX_ADDRESSES && (
            <Button type="button" variant="text" onClick={onAddAddress} sx={{ alignSelf: 'flex-start' }}>
              Add Address
            </Button>
          )}
          <label>Date of Birth</label>
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

export default CustomerCreatePage
