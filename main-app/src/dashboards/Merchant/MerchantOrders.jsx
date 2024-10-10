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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function MerchantOrders() {
  return (
    <>
      <ProductOrders />
      <RentalOrders />
      <ServiceOrders />
    </>
  )
}

function ProductOrders() {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchProductList = async () => {
      if (user?.uid) {
        const q = await getDocs(
          query(collection(db, 'products'), where('merchantId', '==', user.uid))
        );
        const fetchedProducts = q.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      }
    };
    fetchProductList();
  }, [user?.uid]);

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
      <Typography variant="h6">MY PRODUCT ORDERS</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>Customer details</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Current Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <Row key={product.id} row={product} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

function RentalOrders() {
  const [rentals, setRentals] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchRentalList = async () => {
      if (user?.uid) {
        const q = await getDocs(
          query(collection(db, 'rentals'), where('merchantId', '==', user.uid))
        );
        const fetchedRentals = q.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRentals(fetchedRentals);
      }
    };
    fetchRentalList();
  }, [user?.uid]);

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
      <Typography variant="h6">MY RENTAL ORDERS</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Current Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rental) => (
                <Row key={rental.rid} row={rental} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rentals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

function ServiceOrders() {
  const [services, setServices] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchServiceList = async () => {
      if (user?.uid) {
        const q = await getDocs(
          query(collection(db, 'services'), where('merchantId', '==', user.uid))
        );
        const fetchedServices = q.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(fetchedServices);
      }
    };
    fetchServiceList();
  }, [user?.uid]);

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
      <Typography variant="h6">MY SERVICE ORDERS</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Current Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <Row key={service.sid} row={service} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={services.length}
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
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <Tooltip title={'click here'}>
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
        <TableCell align="center">{row.quantity}</TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orders?.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {order.orderDate}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell align="right">{order.quantity}</TableCell>
                      <TableCell align="right">${order.price}</TableCell>
                      <TableCell align="right">{order.status}</TableCell>
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
