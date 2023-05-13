// ** React Imports
import { useState } from 'react'

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

import {
  Button,
  Dialog,

  DialogActions
} from '@mui/material'

const columns = [
  { id: 'order_id', label: 'Order ID', minWidth: 10 , align: 'center'},
  { id: 'first_name', label: 'Name', minWidth: 100 , align: 'center'},
  {
    id: 'charges',
    label: 'charges',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'created_at',
    label: 'Date',
    minWidth: 170,
    align: 'center'
  },
  { id: 'view', label: 'View', minWidth: 100, align: 'center' },
]



const TableStickyHeader = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [row, setRow] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)

  const handleOpen = (id) => {
    const foundObject = data?.orders?.find(obj => obj.order_id === id);
    setOrderDetails(foundObject.order_items)
    setRow(row)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  function createData(order_id, first_name, charges, created_at) {
    return { order_id, first_name, charges, created_at }
  }

  const rows = []
  data?.orders?.forEach(item => {
    const { order_id, first_name, charges, created_at } = item
    rows.push(createData(order_id, first_name, charges, moment(created_at).format('MMMM Do YYYY')))
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

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 700 }}>
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
                      if (column.id === 'view') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button variant="contained" sx={{color:"white !important" , fontSize:"12px" , padding:"10px"}} onClick={() => handleOpen(row.order_id)}>view Items</Button>
                          </TableCell>
                        )
                      }
                        else {
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
      <Dialog open={open} onClose={handleClose}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Unit Price</TableCell>
            <TableCell align="left">Quantity</TableCell>
        
          </TableRow>
        </TableHead>
        <TableBody>
          {orderDetails?.map((row) => (
            <TableRow
              key={row.product_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
              <TableCell align="left">{row.product_id}</TableCell>
              <TableCell align="left">{row.product_name}</TableCell>
              <TableCell align="left">{row.product_unit_price}</TableCell>
              <TableCell align="left">{row.product_quaunity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TableStickyHeader
