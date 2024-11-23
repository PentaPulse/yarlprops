import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAuth } from "../../api/AuthContext";
import Swal from "sweetalert2";

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

    const [merchants, setMerchants] = useState([]);
    const { user } = useAuth();
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

    const handleDelete = async (user) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete the user ${user.displayName || user.email}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const userDocRef = doc(db, "systemusers", user.uid);
                await deleteDoc(userDocRef);
                setMerchants(merchants.filter((merchant) => merchant.uid !== user.uid));
                Swal.fire("Deleted!", "The user has been deleted.", "success");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire("Error", "Failed to delete the user. Please try again.", "error");
        }
    };

    const fetchMerchants = async () => {
        try {
            const q = query(collection(db, "systemusers"), where('isMerchant', '==', true));
            const qSnapshot = await getDocs(q);
            if (!qSnapshot.empty) {
                const userList = qSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setMerchants(userList);
            }
        } catch (e) {
            console.error("Error fetching merchants:", e);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    return (
        <Box sx={{ textAlign: 'center', margin: 'auto', mt: 2 }}>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} style={{ backgroundColor: 'black', color: 'white' }}>
                                        {column.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.approved ? merchants.map((merchant, index) => (
                                <TableRow key={merchant.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{merchant.displayName || `${merchant.fname || ''} ${merchant.lname || ''}` || "-"}</TableCell>
                                    <TableCell>{merchant.email || "-"}</TableCell>
                                    <TableCell>{merchant.phone || "-"}</TableCell>
                                    <TableCell>{merchant.address || "-"}</TableCell>
                                    <TableCell>{merchant.role || "-"}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <Button disabled={merchant.approved} variant="outlined" color="secondary" size="small" onClick={() => handleView(merchant)}>View</Button>
                                            <Button disabled={merchant.approved} variant="outlined" color="error" size="small" onClick={() => handleDelete(merchant)}>Delete</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )) : 'wait for admin approval'}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={rows.length}
                    component="div"
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
                />
            </Paper>

            <Modal open={viewOpen} onClose={handleViewClose}>
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
                    <Typography variant="h6">User Details</Typography>
                    {selectedUser && (
                        <>
                            <Typography><strong>Id:</strong> {selectedUser.uid}</Typography>
                            <Typography><strong>Name:</strong> {selectedUser.displayName}</Typography>
                            <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                            <Typography><strong>Phone:</strong> {selectedUser.phone}</Typography>
                            <Typography><strong>Address:</strong> {selectedUser.address}</Typography>
                            <Typography><strong>Status:</strong> {selectedUser.role}</Typography>
                            <Button onClick={handleViewClose} variant="contained" color="primary" sx={{ mt: 2 }}>Close</Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
