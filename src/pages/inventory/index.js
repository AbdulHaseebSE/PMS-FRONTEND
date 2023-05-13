import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import requireAuth from '../../utils/requireAuth'
import { Button } from '@mui/material'

// ** Custom Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UserService from 'src/services/UserService'
import TableStickyHeader from 'src/views/tables/InventoryTable'

const Dashboard = () => {
  const router = useRouter()
  const [orders, setOrders] = useState('')

  const handleClick = e => {
    e.preventDefault()
    router.push('/inventory/addProduct')
  }
  useEffect(() => {
    UserService.getInventory()
      .then(res => {
        if (res.data.responseCode === 2000) {
          setOrders(res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  console.log(orders)

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} sx={{ justifyContent: 'right' }}>
      <Button onClick={handleClick} variant='contained' sx={{ marginTop: '20px' }}>
          Add Product
        </Button>
        <Grid item xs={12}>
          {orders.length ? (
            <Card>
              <CardHeader title='Products' titleTypographyProps={{ variant: 'h6' }} />
              <TableStickyHeader data={orders} />
            </Card>
          ) : null}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default requireAuth(Dashboard)
