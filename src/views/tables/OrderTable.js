// ** React Imports

import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

const moment = require('moment')

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Button, Typography } from '@mui/material'
import { ControllerClassicOutline } from 'mdi-material-ui'
import { toast } from 'react-hot-toast'

const img_url = 'http://localhost:9010/public/'

const columns = [
  { id: 'url', label: 'Image' },
  { id: 'product_id', label: 'ID' },
  { id: 'product_name', label: 'Name' },
  {
    id: 'product_sku',
    label: 'Product SKU'
  },
  {
    id: 'created_at',
    label: 'Created On'
  },
  {
    id: 'product_quantity',
    label: 'Quantity'
  },
 
  { id: 'product_unit_price', label: 'Unit Price' },
  { id: 'view', label: 'order', minWidth: 100 }
]

const TableStickyHeader = ({ data, setPlaceOrder, age }) => {
  const [open, setOpen] = useState(false)
  const [row, setRow] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [theAge, setTheAge] = useState(undefined)

  const handleClose = () => {
    setOpen(false)
  }

  function createData(
    url,
    product_id,
    product_name,
    product_sku,
    created_at,
    product_quantity,
    product_unit_price,
    count
  ) {
    return { url, product_id, product_name, product_sku, created_at, product_quantity,  product_unit_price, count }
  }

  const rows = []

  orders?.forEach(item => {
    const { url, product_id, product_name, product_sku, created_at ,product_quantity,  product_unit_price, count } = item

    rows.push(
      createData(
        url,
        product_id,
        product_name,
        product_sku,
        moment(created_at).format('MMMM Do YYYY'),
        product_quantity,
        product_unit_price,
        count
      )
    )
  })

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleAdd = id => {
    const hereIsAge = false

    const checkage = orders.map(item => {
      if (item.product_id === id) {
        hereIsAge = item.product_age_limit
      }
    })
    
    
    if (hereIsAge && theAge.age) {
      toast.error('Age Limit : customer is below 18')
      console.log(hereIsAge)
      console.log(theAge)
    } else {
      const updatedItems = orders.map(item => {
        if (item.product_id === id) {
          const updatedItem = { ...item, count: item.count + 1 }
          
          return updatedItem
        } else {
          return item
        }
      })
      console.log('here is item:', updatedItems)

      setOrders(updatedItems)
      setPlaceOrder(updatedItems)
    }
  }

  const handleRemove = id => {
    const updatedItems = orders.map(item => {
      if (item.product_id === id) {
        const updatedItem = { ...item, count: item.count - 1 }
        console.log(updatedItem)
        return updatedItem
      } else {
        return item
      }
    })
    console.log(updatedItems)
    setOrders(updatedItems)
    setPlaceOrder(updatedItems)
  }

  useEffect(() => {
    console.log('useeffect triggered')
    if (data) {
      data.map(item => {
        item.count = 0
      })
      setOrders(data)
    }
    if (age) {
      setTheAge(JSON.parse(age))
    }
  }, [data, age])

  console.log(theAge)

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 10000 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <>
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  </>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id]
                      if (column.id === 'url') {
                        return (
                          <>
                            {value ? (
                              <TableCell key={column.id} align={column.align}>
                                <img src={`${img_url + value}`} alt='image' width='80' height='80'></img>
                              </TableCell>
                            ) : (
                              <TableCell key={column.id} align={column.align}>
                                <img src='/images/dummy.png' alt='image' width='80' height='80'></img>
                              </TableCell>
                            )}
                          </>
                        )
                      } else if (column.id === 'view') {
                        return (
                          <>
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                justifyItems: 'center',
                                marginTop: '15px'
                              }}
                            >
                              <Button
                               disabled={row.product_quantity < 1}
                                variant='contained'
                                sx={{ color: 'white !important', fontSize: '8px', padding: '5px' }}
                                onClick={() => handleAdd(row.product_id)}
                              >
                                +
                              </Button>
                              <Typography sx={{ textAlign: 'center' }}>{row.count}</Typography>

                              <Button
                                disabled={row.count < 1}
                                variant='contained'
                                sx={{ color: 'white !important', fontSize: '8px', padding: '5px', background: 'red' }}
                                onClick={() => handleRemove(row.product_id)}
                              >
                                -
                              </Button>
                            </TableCell>
                          </>
                        )
                      } else {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        )
                      }
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default TableStickyHeader
