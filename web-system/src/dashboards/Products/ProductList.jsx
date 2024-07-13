import React, { useState, useEffect } from 'react';
import { fetchProducts, db } from '../../backend/db/products';
import { deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const ProductList = ({ onEditProduct, onViewProduct }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);    
    
    useEffect(() => {
        const fetchProductList = async () => {
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);
        };
        fetchProductList();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    // const handleDelete = id => {
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'Are you sure?',
    //       text: "You won't be able to revert this!",
    //       showCancelButton: true,
    //       confirmButtonText: 'Yes, delete it!',
    //       cancelButtonText: 'No, cancel!',
    //     }).then(result => {
    //       if (result.value) {
    //         const [employee] = employees.filter(employee => employee.id === id);
    
    //         deleteDoc(doc(db, "employees", id));
    
    //         Swal.fire({
    //           icon: 'success',
    //           title: 'Deleted!',
    //           text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    
    //         const employeesCopy = employees.filter(employee => employee.id !== id);
    //         setEmployees(employeesCopy);
    //       }
    //     });
    //   };

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
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                    <StyledTableRow key={product.id}>
                        {/* <TableCell>{product.id}</TableCell> */}
                        <StyledTableCell align="center">{product.title}</StyledTableCell>
                        <StyledTableCell align="center">{product.category}</StyledTableCell>
                        <StyledTableCell align="center">{product.type}</StyledTableCell>
                        <StyledTableCell align="justify">{product.description}</StyledTableCell>
                        <StyledTableCell align="center">{product.quantity}</StyledTableCell>
                        <StyledTableCell align="center">{product.location}</StyledTableCell>
                        <StyledTableCell align="center">
                            <Button onClick={() => onViewProduct(product.id)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                            <Button onClick={() => onEditProduct(product.id)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                            <Button onClick={() => handleDelete(product.id)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
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
    );
};

export default ProductList;
