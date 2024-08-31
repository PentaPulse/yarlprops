import React from 'react'
import { useAuth } from '../../api/AuthContext';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { Swal } from 'sweetalert2'
import { Button, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

function MerchantOrders() {
  return (
    <>
      <ProductList />
    </>
  )
}

export default MerchantOrders

const ProductList = ({ onEditProduct, onViewProduct }) => {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchProductList = async () => {
      const q = await getDocs(query(collection(db, 'products'), where('merchantId', '==', user.uid)))
      const fetchedProducts = q.docs.map(doc => doc.data())
      setProducts(fetchedProducts);
    };
    fetchProductList();
  }, [user.uid]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(product => product.id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `The product has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error deleting the product.',
      });
    }
  };

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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <Typography>MY PRODUCT ORDERS</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Location</StyledTableCell>
              <StyledTableCell align="center">Current Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
              <StyledTableRow key={product.pid}>
                {/* <TableCell>{product.id}</TableCell> */}
                <StyledTableCell align="center">{product.title}</StyledTableCell>
                <StyledTableCell align="center">{product.category}</StyledTableCell>
                <StyledTableCell align="center">{product.type}</StyledTableCell>
                <StyledTableCell align="justify">{product.description}</StyledTableCell>
                <StyledTableCell align="center">{product.quantity}</StyledTableCell>
                <StyledTableCell align="center">{product.location}</StyledTableCell>
                <StyledTableCell align="center">{product.status}</StyledTableCell>

                <StyledTableCell align="center">
                  <Button onClick={() => onViewProduct(product.pid)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                  <Button onClick={() => onEditProduct(product.pid)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                  <Button onClick={() => handleDelete(product.pid)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                </StyledTableCell>
              </StyledTableRow>
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
};