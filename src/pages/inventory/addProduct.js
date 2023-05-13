// ** React Imports
import React, { forwardRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import toast, { Toaster } from 'react-hot-toast'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Loader from 'src/utils/loader'
import UserService from 'src/services/UserService'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const FormLayoutsSeparator = () => {
  const [loader, setLoader] = useState(false)
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState('/images/dummy.png')
  const [value, setValue] = React.useState(true)
  const [image, setImage] = useState(null)

  const handleChangeRadio = event => {
    setValue(event.target.value)
    console.log(event.target.value);
  }

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      setImage(files[0])
    }
  }

  const [formData, setFormData] = useState({
    product_name: '',
    product_sku: '',
    product_quantity: '',
    product_unit_price: '',
    product_age_limit: '',
    product_description: ''
  })

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    formData.product_age_limit = Boolean(value)

    const formDataPayload = new FormData()
    formDataPayload.append('productImage', image)
    formDataPayload.append('product_name', formData.product_name)
    formDataPayload.append('product_sku', formData.product_sku)
    formDataPayload.append('product_quantity', formData.product_quantity)
    formDataPayload.append('product_unit_price', formData.product_unit_price)
    formDataPayload.append('product_age_limit', formData.product_age_limit)
    formDataPayload.append('product_description', formData.product_description)

    console.log('form data', formData)
    setLoader(true)
    UserService.addProduct(formDataPayload)
      .then(res => {
        if (res?.data.responseCode === 2000) {
          toast.success('Product Added Successfully')
          setLoader(false)
          router.push('/inventory')
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
      <CardHeader title='Add Product' titleTypographyProps={{ variant: 'h6' }} />

      <Divider sx={{ margin: 0 }} />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <ImgStyled src={imgSrc} alt='Product Pic' />
            <Box>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  onChange={onChange}
                  accept='image/png, image/jpeg'
                  id='account-settings-upload-image'
                />
              </ButtonStyled>
              <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/dummy.png')}>
                Reset
              </ResetButtonStyled>
              <Typography variant='body2' sx={{ marginTop: 5 }}>
                Allowed PNG or JPEG. Max size of 5 MB.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.product_name}
                onChange={handleChange}
                fullWidth
                label='Product Name'
                placeholder='Product Name'
                name='product_name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.product_sku}
                onChange={handleChange}
                fullWidth
                label='Product SKU'
                placeholder='Product SKU'
                name='product_sku'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.product_quantity}
                onChange={handleChange}
                fullWidth
                label='Product Quantity'
                placeholder='Product Quantity'
                name='product_quantity'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.product_unit_price}
                onChange={handleChange}
                fullWidth
                label='Product Unit Price'
                placeholder='Product Unit Price'
                name='product_unit_price'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.product_description}
                onChange={handleChange}
                fullWidth
                label='Product Description'
                placeholder='Product Description'
                name='product_description'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormLabel id='demo-row-radio-buttons-group-label'>Age Limit</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={value}
                  onChange={handleChangeRadio}
                >
                  <FormControlLabel value={true} control={<Radio />} label='True' />
                  <FormControlLabel value={false} control={<Radio />} label='False' />
                </RadioGroup>
              </FormControl>
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
