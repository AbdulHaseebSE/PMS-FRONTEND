import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, InputAdornment, TextField } from '@mui/material'

// ** MUI Imports
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import requireAuth from '../../utils/requireAuth'

// ** Custom Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import toast, { Toaster } from 'react-hot-toast'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import UserService from 'src/services/UserService'
import TableStickyHeader from 'src/views/tables/CustomerTable'
import Loader from 'src/utils/loader'

const Dashboard = () => {
  const router = useRouter()
  const [loader, setLoader] = useState(false)

  const [orders, setOrders] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }

  const searchCustomer = () => {
    setLoader(true)
    UserService.searchCustomers(searchTerm)
      .then(res => {
        if (res?.data.responseCode === 2000) {
          toast.success('Customer Found')
          setOrders(res.data.data)
          setLoader(false)
        }
      })

      .catch(err => {
        setLoader(false)

        toast.error(err.response?.data?.error)
      })
  }
  useEffect(() => {
    setLoader(true)
    UserService.getCustomers()
      .then(res => {
        if (res.data.responseCode === 2000) {
          setOrders(res.data.data)
          setLoader(false)
        
        }
      })
      .catch(err => {
        console.log(err)
        setLoader(false)
      })
  }, [])

  const handleClick = e => {
    e.preventDefault()
    router.push('/customers/addCustomer')
  }
  if (loader) {
    return <Loader />
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} sx={{ justifyContent: 'right' }}>
        <Button onClick={handleClick} variant='contained' sx={{ marginTop: '20px' }}>
          Add Customer
        </Button>
        <Grid item xs={12}>
          {orders.length ? (
            <Card>
              <CardHeader title='Customers' titleTypographyProps={{ variant: 'h6' }} />
              <Container maxWidth='md' sx={{ mb: 4, mt: 1, marginLeft: '5px' }}>
                <TextField
                  id='search'
                  type='search'
                  label='Search Customer by Email'
                  size='small'
                  value={searchTerm}
                  onChange={handleSearch}
                  sx={{ width: 700 }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'></InputAdornment>
                  }}
                />
                <Button variant='contained' sx={{ marginLeft: '5px' }} onClick={searchCustomer}>
                  Search
                </Button>
              </Container>
              <TableStickyHeader data={orders} />
            </Card>
          ) : null}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default requireAuth(Dashboard)
