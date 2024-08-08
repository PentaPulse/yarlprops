import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { db } from '../../api/firebase';
import { fetchServices } from '../../api/db/services';
import { deleteDoc, doc } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';

const ServicesList = ({ onEditService, onViewService }) => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    useEffect(() => {
        const fetchServiceList = async () => {
            const fetchedServices = await fetchServices();
            setServices(fetchedServices);
        };
        fetchServiceList();
    }, []);

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

            if (result.isConfirmed){
                await deleteDoc(doc(db, 'services', id));
                setServices(services.filter(service => service.id !== id));

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `The Service has been deleted.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error("Error deleting service: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an error deleting the service.',
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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {/* <TableCell>ID</TableCell> */}
                        
                        <StyledTableCell align="center">Service Name</StyledTableCell>
                        <StyledTableCell align="center">Description</StyledTableCell>
                        <StyledTableCell align="center">Location</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(service => (
                    <StyledTableRow key={service.id}>
                        {/* <TableCell>{product.id}</TableCell> */}
                        <StyledTableCell align="center">{service.serviceName}</StyledTableCell>
                        <StyledTableCell align="center">{service.serviceDescription}</StyledTableCell>
                        <StyledTableCell align="center">{service.serviceLocation}</StyledTableCell>
                        <StyledTableCell align="center">
                            <Button onClick={() => onViewService(service.id)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                            <Button onClick={() => onEditService(service.id)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                            <Button onClick={() => handleDelete(service.id)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                        </StyledTableCell>
                    </StyledTableRow>
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
    );

}

export default ServicesList;
