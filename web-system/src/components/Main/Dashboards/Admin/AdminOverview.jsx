import React from 'react';
import { Box, Grid, Paper, Typography, Divider, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { countRenters, countSellers, countUsers, fetchUserList } from '../../../../backend/db/users';
import { fetchContactUsResponsesList } from '../../../../backend/db/contactus';
import { countProducts, fetchProducts } from '../../../../backend/db/products';

function AdminOverview() {
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
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <UsersTable />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <ContactResponsesTable />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <ProductsTable />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminOverview;

function UsersTable() {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await fetchUserList();
            setUsers(data);
        }
        fetchData();
    }, []);
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.fname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}


function ContactResponsesTable() {
    const [responses, setResponses] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await fetchContactUsResponsesList();
            setResponses(data);
        }
        fetchData();
    }, []);
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Contact Us Responses
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Message</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responses.map((response) => (
                        <TableRow key={response.id}>
                            <TableCell>{response.id}</TableCell>
                            <TableCell>{response.name}</TableCell>
                            <TableCell>{response.email}</TableCell>
                            <TableCell>{response.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
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
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Products
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}