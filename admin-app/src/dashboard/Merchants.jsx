import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../api/firebase";
import { useAuth } from "../api/AuthContext";

export default function Merchants() {
    const columns = [
        { id: 'id', name: 'Id' },
        { id: 'name', name: 'Name' },
        { id: 'email', name: 'Email' },
        { id: 'phone', name: 'Phone' },
        { id: 'address', name: 'Address' },
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
    const [merchants, setMerchanr] = useState([])
    const { user } = useAuth()
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [newUser, setNewUser] = useState({ id: '', name: '', email: '', phone: '', address: '', status: 'Active' });
    const [selectedUser, setSelectedUser] = useState(null);

    const handleClose = () => {
        setOpen(false);
        setNewUser({ id: '', name: '', email: '', phone: '', address: '', status: 'Active' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRows([...rows, { ...newUser, id: rows.length + 1 }]);
        handleClose();
    };

    const handleView = (row) => {
        setSelectedUser(row);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = (rowId) => {
        console.log("Delete row with id:", rowId);
        setRows(rows.filter(row => row.id !== rowId));
    };


    const fetchMerchants = async () => {
        try {
            const q = query(collection(db, "systemusers"),where('isMerchant','==',true))
            const qSnapshot = await getDocs(q)
            if (!qSnapshot.empty) {
                const userList = qSnapshot.docs.map(doc => doc.data());
                setMerchanr(userList)
            }
        } catch (e) {
            //console.log(e)
        }
    }
    useEffect(() => {
        fetchMerchants()
    }, [])

    const handleAssign = () => {

    }

    return (
        <Box sx={{ textAlign: 'center', margin: 'auto' ,mt:2}}>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }}>{column.name}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.approved ? merchants.map((user, index) => (
                                <TableRow>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {(user.displayName ? user.displayName : (user.fname, " ", user.lname)) || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {user.email || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {user.phone || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {user.address || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {user.role}
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <Button disabled={user.approved} variant="outlined" color="primary" size="small" onClick={handleAssign}>Assign</Button>
                                            <Button disabled={user.approved} variant="outlined" color="secondary" size="small" onClick={handleView}>View</Button>
                                            <Button disabled={user.approved} variant="outlined" color="error" size="small" >Delete</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )) : 'wait for admin approval'}
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

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-user-modal-title"
                aria-describedby="add-user-modal-description"
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4
                    }}
                >

                </Box>
            </Modal>

            {selectedUser && (
                <Modal
                    open={viewOpen}
                    onClose={handleViewClose}
                    aria-labelledby="view-user-modal-title"
                    aria-describedby="view-user-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4
                        }}
                    >
                        <Typography id="view-user-modal-title" variant="h6" component="h2">
                            User Details
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Id:</strong> {selectedUser.uid}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Name:</strong> {selectedUser.dname}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Email:</strong> {selectedUser.email}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Phone:</strong> {selectedUser.phone}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Address:</strong> {selectedUser.address}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Status:</strong> {selectedUser.role}
                        </Typography>
                        <Button onClick={handleViewClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
}