// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiAvatar from '@mui/material/Avatar'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import UserService from 'src/services/UserService'
import toast, { Toaster } from 'react-hot-toast'

// ** Icons Imports
import Cart from 'mdi-material-ui/Cart'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { useEffect } from 'react'
import router from 'next/router'
import { json } from 'react-router-dom'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = ({ placeOrder, data }) => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [dataofOrder, setDataOfOrder] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [theData , setTheData] = useState(undefined)

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  const placeOrderNow = () => {
    const newArray = [
      ...dataofOrder.map(obj => {
        console.log(obj)
        const { product_id, count: quantity } = obj

        return { product_id, quantity }
      })
    ]

    const payload = {
      customer_id: +theData.id,
      charges: totalPrice.toString(),
      products: newArray
    }
    UserService.placeOrder(payload)
      .then(res => {
        if (res.data.responseCode === 2000) {
          toast.success('Order Placed Successfully')
          //router.push('/')
          router.push({
            pathname: '/',
            query: { reloaded: 1},
          })
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.error)
      })
  }

  useEffect(() => {
    if (placeOrder) {
      const myArray = placeOrder.filter(obj => obj.count > 0)

      const totalAmount = myArray.map(item => item.count * item.product_unit_price).reduce((acc, val) => acc + val, 0)
      setTotalPrice(totalAmount)

      setDataOfOrder(myArray)
    }

    if(data)
    {
      setTheData(JSON.parse(data))
    }
  }, [placeOrder, data])

  console.log('data', dataofOrder)

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Cart style={{ fontSize: '38px', marginTop: '20px' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 800 }}>Place Order</Typography>
            <Chip
              size='large'
              label={`Total Amount : ${totalPrice}`}
              color='primary'
              sx={{ height: 30, fontSize: '0.75rem', fontWeight: 800, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        {dataofOrder.length ? (
          <>
            <ScrollWrapper>
              {dataofOrder?.map(item => {
                return (
                  <>
                    <MenuItem>
                      {' '}
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        {/* <Avatar alt='Flora' src='/images/avatars/4.png' /> */}
                        <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                          <MenuItemTitle>{item.product_name}</MenuItemTitle>
                          <MenuItemSubtitle variant='body2'>Quantity : {item.count}</MenuItemSubtitle>
                        </Box>
                        <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                          price : {item.product_unit_price}
                        </Typography>
                      </Box>
                    </MenuItem>
                  </>
                )
              })}
            </ScrollWrapper>
            <MenuItem
              disableRipple
              sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
            >
              <Button fullWidth variant='contained' onClick={placeOrderNow}>
                Place Order
              </Button>
            </MenuItem>
          </>
        ) : (
          <Typography sx={{ textAlign: 'center', margin: '20px 0px' }}>No items in cart</Typography>
        )}
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
