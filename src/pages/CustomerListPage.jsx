import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import customerService from '../services/customerService'

const CustomerListPage = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError('')
      const page = await customerService.getCustomers({ page: 0, size: 20, sort: 'id,asc' })
      setCustomers(page.content ?? [])
    } catch (err) {
      setError('Failed to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        Customer List
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
        <Button variant="contained" onClick={() => navigate('/customers/create')}>
          Create Customer
        </Button>
        <Button variant="outlined" onClick={loadCustomers}>
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Date Of Birth</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.nic}</TableCell>
                  <TableCell>{customer.mobileNumbers?.[0] ?? '-'}</TableCell>
                  <TableCell>{customer.dateOfBirth}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/customers/view?id=${customer.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/customers/edit?id=${customer.id}`)}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {!loading && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No customers found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">Loading customers...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default CustomerListPage
