import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import * as React from 'react'
import { db } from '../../api/firebase'
import { Box, Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useAuth } from '../../api/AuthContext';

export default function Admins() {
    const { user } = useAuth()
    const [admins, setAdmins] = React.useState([])
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const q = query(collection(db, 'admins'));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const adminsData = querySnapshot.docs.map(doc => doc.data());
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

    const columns = ["index", "Display Name", "First name", "Last name", "Email", "Gender", "Approved"]

    const handleApproveAdimns = () => {
        setOpen(!open)
    }
    const handleRemoveAdimns = () => {
        setOpen(!open)
    }

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <>
            <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                <Grid container alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                    <Grid item sx={{ mt: 5 }}>
                        <h1>Adminstrators</h1>
                    </Grid>
                    <Grid item sx={{ ml: 50, mt: 5 }}>
                        <ButtonGroup>
                            <Button
                                disabled={!user.approved}
                                variant="contained"
                                sx={{ backgroundColor: 'green', color: 'white' }}
                                //startIcon={<AddIcon />}
                                onClick={handleApproveAdimns}
                            >
                                Approve admins
                            </Button>
                            <Button
                                disabled={!user.approved}
                                variant="contained"
                                sx={{ backgroundColor: 'green', color: 'white' }}
                                //startIcon={<AddIcon />}
                                onClick={handleRemoveAdimns}
                            >
                                Remove admins
                            </Button>
                        </ButtonGroup>
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
                                {user.approved ? admins.map((admin, index) => (
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{admin.displayName}</TableCell>
                                        <TableCell>{admin.firstName}</TableCell>
                                        <TableCell>{admin.lastName}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.gender}</TableCell>
                                        <TableCell>{admin.approved ? "yes" : "no"}</TableCell>
                                    </TableRow>
                                )) : 'wait for admin approval'}
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
                    <ApproveAdmin />
                </Modal>
            </Box>
        </>
    )
}

function ApproveAdmin() {
    const [adminDetails, setAdminDetails] = React.useState({
        adminId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        status: ''
    });

    const [unapprovedList, setUnapprovedList] = React.useState([]);
    //const [user] = useAuth();

    React.useEffect(() => {
        const fetchUnapprovedAdmins = async () => {
            try {
                const data = await getDocs(query(collection(db, 'admins'), where('approved', '==', false)));
                const fetchedList = data.docs.map((doc) => (
                    doc.data()
                ));
                setUnapprovedList(fetchedList);
                console.log(fetchedList);
            } catch (e) {
                console.error('Error fetching unapproved admins:', e);
            }
        };
        fetchUnapprovedAdmins();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails({ ...adminDetails, [name]: value });
    };

    const handleChange = (event) => {
        const selectedAdmin = unapprovedList.find(admin => admin.adminId === event.target.value);
        setAdminDetails({
            adminId: selectedAdmin.id,
            firstName: selectedAdmin.firstName,
            lastName: selectedAdmin.lastName,
            email: selectedAdmin.email,
            phoneNumber: selectedAdmin.phoneNumber,
            address: selectedAdmin.address,
            status: selectedAdmin.status
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adminRef = doc(db, 'admins', adminDetails.adminId);
            await updateDoc(adminRef, { approved: true });
            setUnapprovedList(unapprovedList.filter(admin => admin.adminId !== adminDetails.adminId));
            setAdminDetails({
                adminId: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                address: '',
                status: ''
            });
        } catch (e) {
            console.error('Error approving admin:', e);
        }
    };

    return (
        <>
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
                    Approve Admin
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Admin</InputLabel>
                    <Select
                        name="adminId"
                        value={adminDetails.adminId}
                        onChange={handleChange}
                        required
                    >
                        {unapprovedList.map((admin) => (
                            <MenuItem key={admin.adminId} value={admin.adminId}>
                                {admin.firstName} {admin.lastName} ({admin.email})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    name="firstName"
                    label="First Name"
                    value={adminDetails.firstName}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="lastName"
                    label="Last Name"
                    value={adminDetails.lastName}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email"
                    value={adminDetails.email}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="phoneNumber"
                    label="Phone Number"
                    value={adminDetails.phoneNumber}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="address"
                    label="Address"
                    value={adminDetails.address}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="status"
                    label="Approved"
                    value={adminDetails.approved}
                    onChange={handleInputChange}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Approve
                </Button>
            </Box>
        </>
    );
}


function RemoveAdmin() {
    return (
        <>

        </>
    )
}