import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useState } from "react";

const Users = () => {
    const columns = [
        { id: 'id', name: 'Id' },
        { id: 'name', name: 'Name' },
        { id: 'email', name: 'Email' },
        { id: 'phone', name: 'Phone' },
        { id: 'status', name: 'Status' },
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

    const initialRows = [
        { id: 1, name: 'Sadamali Jayarathna', email: 'sada@gmail.com', phone: '0774566079', status: 'Active' },
        { id: 2, name: 'Nayana Munasinhe', email: 'naya@gmail.com', phone: '0778964563', status: 'Inactive' },
        
    ];

    const [rows, setRows] = useState(initialRows);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Manage Users</h1>

            <Paper sx={{ width: '90%', marginLeft: '5%' }}>
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
        </div>
    );
}

export default Users;
