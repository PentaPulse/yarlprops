import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrdersForItem, fetchProductsToOrders, fetchRentalsToOrders, fetchServicesToOrders } from '../../api/db/orders';
import { Button } from '@mui/material';

function formatDate(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}.${minutes}.${seconds}`;
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [orders, setOrders] = React.useState([]);

  const handleRowClick = async () => {
    if (!open) {
      const fetchedOrders = await fetchOrdersForItem(row.pid || row.rid || row.sid);
      setOrders(fetchedOrders);
    }
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleRowClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.title}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.subCategory}</TableCell>
        {!row.sid &&
          <TableCell align="right">{row.quantity}</TableCell>
        }
        <TableCell>{row.currentStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Orders for {row.title}
              </Typography>
              <Table size="small" aria-label="orders">
                <TableHead>
                  <TableRow>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">{formatDate(order.date)}</TableCell>
                      <TableCell>{order.custName}</TableCell>
                      <TableCell align="right">{order.quantity}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell><Button>Approval</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    currentStatus: PropTypes.string.isRequired,
  }).isRequired,
};

export default function MerchantOrders() {
  const [products, setProducts] = React.useState([])
  const [rentals, setRentals] = React.useState([])
  const [services, setServices] = React.useState([])

  React.useEffect(() => {
    const fetchProducts = async () => {
      const data = await fetchProductsToOrders()
      setProducts(data)
    }
    const fetchRentals = async () => {
      const data = await fetchRentalsToOrders()
      setRentals(data)
    }
    const fetchServices = async () => {
      const data = await fetchServicesToOrders()
      setServices(data)
    }

    fetchProducts()
    fetchRentals()
    fetchServices()
  }, [])
  return (
    <>
      <ItemOrders title={'Products'} rows={products} />
      <ItemOrders title={'Rentals'} rows={rentals} />
      <ItemOrders title={'Services'} rows={services} />
    </>
  )
}

function ItemOrders({ title, rows }) {
  return (
    <TableContainer component={Paper} sx={{mt:4,ml:3}}>
      <Typography variant='h5' textAlign={'center'} mt={2}>{title}</Typography>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            {title !== 'Services' &&
              <TableCell align="right">Quantity</TableCell>
            }
            <TableCell>Current Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
