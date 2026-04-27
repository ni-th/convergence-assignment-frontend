import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import customerService from '../services/customerService'

const MAX_MOBILE_NUMBERS = 3
const MAX_ADDRESSES = 3

const createEmptyAddress = () => ({
  addressLine1: '',
  addressLine2: '',
  city: { city: '' },
  country: { country: '' },
})

const normalizeAddress = (address) => ({
  addressLine1: address?.addressLine1 ?? '',
  addressLine2: address?.addressLine2 ?? '',
  city: { city: address?.city?.city ?? '' },
  country: { country: address?.country?.country ?? '' },
})

const CustomerEditPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const customerId = useMemo(() => Number(searchParams.get('id')), [searchParams])
  const [editId, setEditId] = useState(searchParams.get('id') ?? '')

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
  const [isCustomerLoaded, setIsCustomerLoaded] = useState(false)

  useEffect(() => {
    setEditId(searchParams.get('id') ?? '')
  }, [searchParams])

  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId || Number.isNaN(customerId)) {
        setError('')
        setIsCustomerLoaded(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        setIsCustomerLoaded(false)
        const customer = await customerService.getCustomerById(customerId)
        setForm({
          name: customer.name ?? '',
          nic: customer.nic ?? '',
          dateOfBirth: customer.dateOfBirth ?? '',
          mobileNumbers:
            customer.mobileNumbers?.length > 0
              ? customer.mobileNumbers.slice(0, MAX_MOBILE_NUMBERS)
              : [''],
          familyMembers: customer.familyMembers ?? [],
          addresses:
            customer.addresses?.length > 0
              ? customer.addresses.slice(0, MAX_ADDRESSES).map((address) => normalizeAddress(address))
              : [createEmptyAddress()],
        })
        setIsCustomerLoaded(true)
      } catch (err) {
        setError('Failed to load customer details.')
        setIsCustomerLoaded(false)
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()
  }, [customerId])

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
    if (!customerId || Number.isNaN(customerId)) {
      setError('Please enter a valid customer ID and load customer details.')
      return
    }

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

      await customerService.updateCustomer(customerId, {
        ...form,
        mobileNumbers: sanitizedMobileNumbers,
        addresses: sanitizedAddresses,
      })
      navigate(`/customers/view?id=${customerId}`)
    } catch (err) {
      setError('Failed to update customer.')
    } finally {
      setLoading(false)
    }
  }

  const onLoadCustomer = () => {
    const normalizedId = editId.trim()
    if (!normalizedId || Number.isNaN(Number(normalizedId))) {
      setError('Please enter a valid numeric customer ID.')
      return
    }

    setError('')
    navigate(`/customers/edit?id=${Number(normalizedId)}`)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Edit Customer
      </Typography>

      <Paper variant="outlined" sx={{ mt: 2, p: 2, maxWidth: 640 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Customer ID"
            value={editId}
            onChange={(event) => setEditId(event.target.value)}
            placeholder="Enter customer id"
            fullWidth
          />
          <Button variant="contained" onClick={onLoadCustomer} sx={{ minWidth: 170 }}>
            Load Customer
          </Button>
        </Stack>
      </Paper>

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

          <TextField
            type="date"
            value={form.dateOfBirth}
            onChange={onChange('dateOfBirth')}
            required
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading || !isCustomerLoaded}>
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
