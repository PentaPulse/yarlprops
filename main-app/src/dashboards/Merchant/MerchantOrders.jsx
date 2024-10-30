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
import { rejectOrder,approveOrder, fetchOrdersForItem, fetchProductsToOrders, fetchRentalsToOrders, fetchServicesToOrders } from '../../api/db/orders';
import { Button } from '@mui/material';
import { useAuth } from '../../api/AuthContext';
import formatDate from '../../components/date/dateTime';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const { user } = useAuth()

  const handleRowClick = async () => {
    if (!open) {
      const fetchedOrders = await fetchOrdersForItem(row.pid || row.rid || row.sid, user.uid);
      setOrders(fetchedOrders);
    }
    setOpen(!open);
  };

  const handleApproval = async (order) => {
    await approveOrder(order)
  }

  const handleReject=async(order)=>{
    await rejectOrder(order)
  }

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
          <TableCell >{row.quantity}</TableCell>
        }
        <TableCell>{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Orders for {row.title}
              </Typography>
              {orders.length > 0 ?
                <Table size="small" aria-label="orders">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell >Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">{formatDate(order.date)}</TableCell>
                        <TableCell>{order.custName}</TableCell>
                        <TableCell>{order.itemQuantity}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.status === 'pending'||order.status==='cancelled' ? <><Button onClick={() => handleApproval(order)}>Approval</Button><Button onClick={()=>handleReject(order)}>Reject</Button> </>: <Typography>Approved</Typography>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                :
                <Typography>No orders yet</Typography>
              }
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
  const { user } = useAuth()

  React.useEffect(() => {
    const fetchProducts = async() => {
      const data = await fetchProductsToOrders(user.uid)
      setProducts(data)
    }
    const fetchRentals = async() => {
      const data = await fetchRentalsToOrders(user.uid)
      setRentals(data)
    }
    const fetchServices = async() => {
      const data = await fetchServicesToOrders(user.uid)
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
    <TableContainer component={Paper} sx={{ mt: 4, ml: 3 }}>
      <Typography variant='h5' textAlign={'center'} mt={2}>{title}</Typography>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            {title !== 'Services' &&
              <TableCell >Quantity</TableCell>
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
