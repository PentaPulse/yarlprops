import React from 'react';
import { useAuth } from '../../api/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Button,
  Dialog,
  DialogTitle
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';

export default function MerchantOrders() {
  return (
    <>
      <ItemOrders itemType={'product'} />
      <ItemOrders itemType={'rental'} />
      <ItemOrders itemType={'service'} />
    </>
  );
}

function ItemOrders({ itemType }) {
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchItemList = async () => {
      if (user?.uid) {
        const q = await getDocs(
          query(collection(db, `${itemType}s`), where('merchantId', '==', user.uid))
        );
        const fetchedItems = q.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      }
    };
    fetchItemList();
  }, [user?.uid, itemType]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <>
      <Typography variant="h6">MY {itemType.toUpperCase()} ORDERS</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>Customer details</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              {itemType !== 'service' && (
                <StyledTableCell align="center">Quantity</StyledTableCell>
              )}
              <StyledTableCell align="center">Current Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <Row key={item.id} row={item} itemType={itemType} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

function Row(props) {
  const { row, itemType } = props;
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const qSnapshot = await getDocs(
          query(
            collection(db, 'orders'),
            where('itemType', '==', itemType),
            where('itemId', '==', row.id) // Fetch orders by itemId
          )
        );
        const codata = qSnapshot.docs.map((doc) => doc.data());
        setOrders(codata);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCustomerOrders();
  }, [itemType, row.id]);

  const handleApproval = () => {
    // Add approval logic here
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <Tooltip title={'Click here'}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center">{row.title}</TableCell>
        <TableCell align="center">{row.category}</TableCell>
        <TableCell align="center">{row.subCategory}</TableCell>
        {itemType !== 'service' && (
          <TableCell align="center">{row.quantity || '-'}</TableCell>
        )}
        <TableCell align="center">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Table size="small" aria-label="order details">
                <TableHead>
                  <TableRow>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {order.date}
                      </TableCell>
                      <TableCell>{order.custName}</TableCell>
                      <TableCell align="center">{order.quantity || '-'}</TableCell>
                      <TableCell align="center">Rs {order.price || '-'}</TableCell>
                      <TableCell align="center">{order.status}</TableCell>
                      <TableCell align="center">
                        <Button onClick={handleApproval}>Approval</Button>
                      </TableCell>
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
  row: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
};
