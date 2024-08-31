import React from 'react';
import { Box, Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button } from '@mui/material';
import { countAdmins, countUsers, fetchUserList} from '../../api/db/users';
import { countProducts } from '../../api/db/products';
import { countservices} from '../../api/db/services';
import { countRentals } from '../../api/db/rentals';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useAuth } from '../../api/AuthContext';

export default function AdminOverview() {
    const [adminCount, setadminCount] = React.useState(0);
    const [merchantCount, setmerchantCount] = React.useState(0);
    const [customerCount, setcustomerCount] = React.useState(0);
    const [productCount, setProductCount] = React.useState(0);
    const [serviceCount, setServiceCount] = React.useState(0);
    const [rentalCount,setRentalCount]=React.useState(0);

    React.useEffect(() => {
        const fetchCounts = async () => {
            const admins = await countAdmins();
            const merchants = await countUsers(true); //ismerchant
            const customers = await countUsers(false);//ismerchant
            const products = await countProducts();
           const rentals = await countRentals();
            const services = await countservices();
            setadminCount(admins);
            setmerchantCount(merchants);
            setcustomerCount(customers);
            setProductCount(products);
            setRentalCount(rentals);
            setServiceCount(services);
        };
        fetchCounts();
    }, []);
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Admins
                        </Typography>
                        <Typography variant="h4">
                            {adminCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Merchants
                        </Typography>
                        <Typography variant="h4">
                            {merchantCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Customers
                        </Typography>
                        <Typography variant="h4">
                            {customerCount}
                        </Typography>
                    </Paper>
                </Grid>
                </Grid>
                <Grid container spacing={3} mt={2}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Products
                        </Typography>
                        <Typography variant="h4">
                            {productCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Rentals
                        </Typography>
                        <Typography variant="h4">
                            {rentalCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Services
                        </Typography>
                        <Typography variant="h4">
                            {serviceCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <UsersTable />
                </Grid>
                <Grid item xs={12}>
                    <ContactResponsesTable />
                </Grid>
                <Grid item xs={12}>
                    <ProductsTable />
                </Grid>
                <Grid item xs={12}>
                    <RentalsTable />
                </Grid>
                <Grid item xs={12}>
                    <ServicesTable />
                </Grid>
            </Grid>
        </Box>
    );
}

function UsersTable() {
    const {user}=useAuth();
    const[users, setUsers] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await fetchUserList();
            setUsers(data);
        }
        fetchData();
    }, []);

    const cols = ["No", "Name", "Email", "Role","Counts","Action"]
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {cols.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} >{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(0,5).map((usr, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{usr.firstName + ' ' + usr.lastName}</TableCell>
                                    <TableCell>{usr.email}</TableCell>
                                    <TableCell>{usr.isMerchant?'Merchant':'Customer'}</TableCell>
                                    <TableCell>{usr.isMerchant?`P - ${usr.myProducts && usr.myProducts.length} , R - ${usr.myRentals && usr.myRentals.length} , S - ${usr.myServices && usr.myServices.length}`:'P - 0 , R - 0 , S - 0'}</TableCell>
                                    <TableCell><Button disabled={!user?.approved} variant='primary' >Assign</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}


function ContactResponsesTable() {
    const [responses, setResponses] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const q = await getDocs(query(collection(db,'contactus'),where("status","==","new"),orderBy('timestamp','asc'),limit(5)))
                const responses = q.docs.map((doc)=>doc.data())
                setResponses(responses);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();
    }, []);

    const cols = ['No', 'Name', 'Email', 'Status', 'Message'];

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Contact Us Responses
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {cols.map((column, index) => (
                                    <TableCell key={index} style={{ backgroundColor: 'black', color: 'white' }}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {responses.length > 0 ? (
                                responses.map((response, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{response.firstName+' '+response.lastName}</TableCell>
                                        <TableCell>{response.email}</TableCell>
                                        <TableCell>{response.status}</TableCell>
                                        <TableCell>{response.message}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={cols.length}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {error && (
                <Typography color="error">
                    Error fetching data: {error}
                </Typography>
            )}
        </>
    );
}

function ProductsTable() {
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const q = await getDocs(query(collection(db,'products'),orderBy('timestamp','asc'),limit(5)))
            const data = q.docs.map((doc)=>doc.data())
            setProducts(data);
        }
        fetchData();
    }, []);
    const cols = ["No", "Name", "Quantity", "Price"]
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Products
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {cols.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} >{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length>0?(
                            products.slice(0,5).map((product, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.price}</TableCell>

                                </TableRow>
                            ))):(                                
                                <TableRow>
                                    <TableCell colSpan={cols.length}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

function RentalsTable() {
    const [rentals, setRentals] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const q = await getDocs(query(collection(db,'rentals'),orderBy('timestamp','asc'),limit(5)))
            const data = q.docs.map((doc)=>doc.data())
            setRentals(data);
        }
        fetchData();
    }, []);
    const cols = ["No", "Name", "Quntity", "Price"]
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Rentals
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {cols.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} >{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rentals.length>0?(
                            rentals.slice(0,5).map((rental, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{rental.title}</TableCell>
                                    <TableCell>{rental.quantity}</TableCell>
                                    <TableCell>{rental.price}</TableCell>

                                </TableRow>
                            ))):(                                
                                <TableRow>
                                    <TableCell colSpan={cols.length}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

function ServicesTable() {
    const [services, setServices] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const q = await getDocs(query(collection(db,'services'),orderBy('timestamp','asc'),limit(5)))
            const data = q.docs.map((doc)=>doc.data())
            setServices(data);
        }
        fetchData();
    }, []);
    const cols = ["No", "Name", "Category", "Price"]
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Services
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {cols.map((column) => (
                                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} >{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.length>0?(
                            services.slice(0,5).map((service, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{service.serviceName}</TableCell>
                                    <TableCell>{service.serviceLocation}</TableCell>
                                    <TableCell>{service.price}</TableCell>

                                </TableRow>
                            ))):(                                
                                <TableRow>
                                    <TableCell colSpan={cols.length}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}