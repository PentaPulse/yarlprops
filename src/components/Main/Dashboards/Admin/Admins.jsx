import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../backend/secrets'
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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

    const columns = ["Display Name","First name","Last name","Email","Gender"]

    return (
        <>
            {
        <Box sx={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
            <Grid container alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Grid item sx={{ mt: 5 }}>
                    <h1>Adminstrators</h1>
                </Grid>
                <Grid item sx={{ ml: 50, mt: 5 }}>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: 'green', color: 'white' }}
                        //startIcon={<AddIcon />}
                        //onClick={handleAddUser}
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
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} >{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin)=>(
                                <TableRow>
                                    <TableCell>{admin.fname+" "+admin.lname}</TableCell>
                                    <TableCell>{admin.fname}</TableCell>
                                    <TableCell>{admin.lname}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.gender}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
{/*
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
            )}*/}
        </Box>}
        </>
    )
}

export default Admins
