import { collection, getDocs, query, where } from 'firebase/firestore'
import * as React from 'react'
import { db } from '../../../../backend/secrets'
import { Box, Button, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

function Admins() {
    const [admins, setAdmins] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const [newAdmin, setNewAdmin] = React.useState({})

    React.useEffect(() => {
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

    const columns = ["index", "Display Name", "First name", "Last name", "Email", "Gender"]

    const handleAssignAdimns = () => {
        setOpen(!open)
    }

    const handleOpen = () => {
        setOpen(!open)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin({ ...newAdmin, [name]: value });
    };

    const handleSubmit = () => {

    }
    return (
        <>
            <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                <Grid container alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                    <Grid item sx={{ mt: 5 }}>
                        <h1>Adminstrators</h1>
                    </Grid>
                    <Grid item sx={{ ml: 50, mt: 5 }}>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'green', color: 'white' }}
                            //startIcon={<AddIcon />}
                            onClick={handleAssignAdimns}
                        >
                            Assign admins
                        </Button>
                    </Grid>
                </Grid>
                <Paper sx={{ width: '100%', mb: 4 }}>
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
                                {admins.map((admin, index) => (
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{admin.displayName}</TableCell>
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

                <Modal
                    open={open}
                    onClose={handleOpen}
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
                            value={newAdmin.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="email"
                            label="Email"
                            value={newAdmin.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="phone"
                            label="Phone"
                            value={newAdmin.phone}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="address"
                            label="Address"
                            value={newAdmin.address}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="status"
                            label="Status"
                            value={newAdmin.status}
                            onChange={handleInputChange}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Add User
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </>
    )
}

export default Admins
