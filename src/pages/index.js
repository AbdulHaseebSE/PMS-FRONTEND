
import React, {useState , useEffect} from 'react'
// ** MUI Imports

import Grid from '@mui/material/Grid'
import requireAuth from '../utils/requireAuth';
import Loader from 'src/utils/loader'

// ** Custom Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'


// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'


import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import UserService from 'src/services/UserService'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import { useRouter } from 'next/router';
import { route } from 'next/dist/server/router';

const Dashboard = () => {
  const [orders , setOrders] = useState('')
  const [loader, setLoader] = useState(false)
  const router = useRouter();

  const { reloaded }  = router.query

  useEffect(() => {
    if(reloaded ==1){
      router.reload();
    }
    setLoader(true)
    UserService.getOrders()
    .then((res) => {
     
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/pages/login');
        }
        else if(res === undefined){
          
          router.reload();
        }
      }
      
      if(res.data.responseCode === 2000){
        setOrders(res.data.data)
        setLoader(false)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  },[])


if (loader) {
  return <Loader />
}

  return (
    <>
    

    <ApexChartWrapper>
      
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <StatisticsCard  data={orders}/>
        </Grid>
        <Grid item xs={12}>
        <Card>
          <CardHeader title='Orders' titleTypographyProps={{ variant: 'h6' }} />
          <TableStickyHeader  data={orders} />
        </Card>
      </Grid>
      </Grid>
    </ApexChartWrapper>
    </>
  )
}

export default requireAuth(Dashboard);
