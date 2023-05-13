// ** React Imports
import React, { forwardRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import toast, { Toaster } from 'react-hot-toast';
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Loader from 'src/utils/loader'
import UserService from 'src/services/UserService'

const FormLayoutsSeparator = () => {
  const [loader, setLoader] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    postCode: '',
    city: '',
    country: '',
    address: ''
  })

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async ()=> {
    setLoader(true)
    UserService.addCustomers(formData)
      .then(res => {
        if (res?.data.responseCode === 2000) {
            toast.success("customer Added Successfully")
          setLoader(false)
          router.push('/customers')
        }
      })
      .catch(err => {
        setLoader(false)
        toast.error(err.response?.data?.error)
      })
  }

  if (loader) {
    return <Loader />
  }

  return (
    <Card>
      <CardHeader title='Add Customer' titleTypographyProps={{ variant: 'h6' }} />

      <Divider sx={{ margin: 0 }} />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                label='First Name'
                placeholder='First Name'
                name='first_name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                label='Last Name'
                placeholder='Last Name'
                name='last_name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.email}
                onChange={handleChange}
                fullWidth
                type='email'
                label='Email'
                placeholder='Email'
                name='email'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                label='Date of Birth'
                placeholder='e.g 2000-01-13'
                name='dob'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.postCode}
                onChange={handleChange}
                fullWidth
                label='Post Code'
                placeholder='Post Code'
                name='postCode'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.city}
                onChange={handleChange}
                fullWidth
                label='City'
                placeholder='City'
                name='city'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.country}
                onChange={handleChange}
                fullWidth
                label='Country'
                placeholder='Country'
                name='country'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.address}
                onChange={handleChange}
                fullWidth
                label='Address'
                placeholder='Address'
                name='address'
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
