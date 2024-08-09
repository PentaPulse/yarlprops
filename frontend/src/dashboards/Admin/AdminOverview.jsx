import React from 'react';
import { Box, Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { countRenters, countSellers, countUsers, fetchUserList} from '../../api/db/users';
import { countProducts ,fetchProducts} from '../../api/db/products';
import axios from 'axios';

export default function AdminOverview() {
    const [userCount, setUserCount] = React.useState(0);
    const [sellerCount, setSellerCount] = React.useState(0);
    const [renterCount, setRenterCount] = React.useState(0);
    const [productCount, setProductCount] = React.useState(0);

    React.useEffect(() => {
        const fetchCounts = async () => {
            const users = await countUsers();
            const sellers = await countSellers();
            const renters = await countRenters();
            const products = await countProducts();
            setUserCount(users);
            setSellerCount(sellers);
            setRenterCount(renters);
            setProductCount(products);
        };

        fetchCounts();
    }, []);
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Users
                        </Typography>
                        <Typography variant="h4">
                            {userCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Sellers
                        </Typography>
                        <Typography variant="h4">
                            {sellerCount}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 150 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Renters
                        </Typography>
                        <Typography variant="h4">
                            {renterCount}
                        </Typography>
                    </Paper>
                </Grid>
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
                <Grid item xs={12}>
                    <UsersTable />
                </Grid>
                <Grid item xs={12}>
                    <ContactResponsesTable />
                </Grid>
                <Grid item xs={12}>
                    <ProductsTable />
                </Grid>
            </Grid>
        </Box>
    );
}

function UsersTable() {
    const[users, setUsers] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await fetchUserList();
            setUsers(data);
        }
        fetchData();
    }, []);

    const cols = ["No", "Name", "Email", "Role"]
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
                                    <TableCell>{usr.fname + ' ' + usr.lname}</TableCell>
                                    <TableCell>{usr.email}</TableCell>
                                    <TableCell>{usr.role}</TableCell>

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
                // Fetch data from the API
                const response = await axios.get('http://localhost:5000/api/c/responses');
                // Set responses data
                setResponses(response.data);
            } catch (err) {
                // Handle error
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
            const data = await fetchProducts();
            setProducts(data);
        }
        fetchData();
    }, []);
    const cols = ["No", "Name", "Category", "Price"]
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
                            {products.slice(0,5).map((pro, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{pro.name}</TableCell>
                                    <TableCell>{pro.type}</TableCell>
                                    <TableCell>{pro.price}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}