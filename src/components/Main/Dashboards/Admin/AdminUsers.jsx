import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Grid } from "@mui/material";
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';

const AdminUsers = () => {
    const columns = [
        { id: 'id', name: 'Id' },
        { id: 'name', name: 'Name' },
        { id: 'email', name: 'Email' },
        { id: 'phone', name: 'Phone' },
        { id: 'status', name: 'Status' },
        { id: 'role', name: 'Role' }, 
        { id: 'requestStatus', name: 'Request Status' },
        { id: 'action', name: 'Action' },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleView = (row) => {
        console.log("View row:", row);
    };

    const handleDelete = (rowId) => {
        console.log("Delete row with id:", rowId);
        setRows(rows.filter(row => row.id !== rowId));
    };

    const handleAddUser = () => {
        console.log("Add user clicked");
    };

    const initialRows = [
        { id: 1, name: 'Sadamali Jayarathna', email: 'sada@gmail.com', phone: '0774566079', status: 'Active', role: 'Seller', requestStatus: 'Accepted' },
        { id: 2, name: 'Nayana Munasinhe', email: 'naya@gmail.com', phone: '0778964563', status: 'Inactive', role: 'Renter', requestStatus: 'Rejected' },
        { id: 3, name: 'Janani Welipitiya', email: 'jana@gmail.com', phone: '0778564573', status: 'Active', role: 'User', requestStatus: 'Pending' },
        { id: 4, name: 'Ruchi Welipitiya', email: 'ruchi@gmail.com', phone: '0778964565', status: 'Inactive', role: 'Renter', requestStatus: 'Accepted' },
        { id: 5, name: 'Sathya Jayasundara', email: 'sathya@gmail.com', phone: '0778969563', status: 'Inactive', role: 'Renter', requestStatus: 'Pending' },
    ];

    const [rows, setRows] = useState(initialRows);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <Box sx={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
            <Grid container alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Grid item sx={{ mt: 5 }}>
                    <h1>AdminUsers</h1>
                </Grid>
                <Grid item sx={{ ml: 50, mt: 5 }}>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: 'green', color: 'white' }}
                        startIcon={<AddIcon />}
                        onClick={handleAddUser}
                    >
                        Add User
                    </Button>
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%',  mb: 4}}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} key={column.id}>{column.name}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows && rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        {columns.map((column) => {
                                            let value = row[column.id];
                                            return (
                                                <TableCell key={column.id}>
                                                    {column.id === 'action' ? (
                                                        <Box display="flex" gap={1}>
                                                            <Button variant="outlined" color="secondary" size="small" onClick={() => handleView(row)}>View</Button>
                                                            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(row.id)}>Delete</Button>
                                                        </Box>
                                                    ) : column.id === 'requestStatus' ? (
                                                        <span style={{ color: value === 'Accepted' ? 'green' : value === 'Rejected' ? 'red' : value === 'Pending' ? 'blue' : 'inherit' }}>
                                                            {value}
                                                        </span>
                                                    ) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={rows.length}
                    component="div"
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Paper>
        </Box>
    );
}

export default AdminUsers;

