import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../backend/secrets'

function Admins() {
    const [admins, setAdmins] = useState([])

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const q = query(collection(db, 'systemusers'), where('role', '==', 'admin'));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const adminsData = querySnapshot.docs.map(doc => doc.data());
                    console.log(adminsData)
                    setAdmins(adminsData);
                } else {
                    console.log('No admin documents found');
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <>
            <h2>Admins</h2>
            {admins.length > 0 ? (
                <ul>
                    {admins.map((admin, index) => (
                        <li key={index}>
                            Email: {admin.fname}, Role: {admin.role}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No admins found</p>
            )}
            {/*
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
                    <Typography id="add-user-modal-title" variant="h6" component="h2">
                        Add New User
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="name"
                        label="Name"
                        value={newUser.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="email"
                        label="Email"
                        value={newUser.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="phone"
                        label="Phone"
                        value={newUser.phone}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="address"
                        label="Address"
                        value={newUser.address}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="status"
                        label="Status"
                        value={newUser.status}
                        onChange={handleInputChange}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add User
                    </Button>
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
                            <strong>Id:</strong> {selectedUser.id}
                        </Typography>
                        <Typography id="view-user-modal-description" sx={{ mt: 2 }}>
                            <strong>Name:</strong> {selectedUser.name}
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
                            <strong>Status:</strong> {selectedUser.status}
                        </Typography>
                        <Button onClick={handleViewClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>*/}
        </>
    )
}

export default Admins
