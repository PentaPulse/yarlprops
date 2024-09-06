import React from 'react';
import { Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button } from '@mui/material';
import { countAdmins, countUsers, fetchUserList } from '../../api/db/users';
import { countProducts } from '../../api/db/products';
import { countservices } from '../../api/db/services';
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
    const [rentalCount, setRentalCount] = React.useState(0);

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

    const cards = (title, count) => {
        return (
            <>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: 120, height: 100, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4">
                        {count}
                    </Typography>
                </Paper>
            </>
        )
    }

    const userCounts = [['Admins', adminCount], ['Merchants', merchantCount], ['Customers', customerCount]]
    const itemCounts = [['Products', productCount], ['Rentals', rentalCount], ['Services', serviceCount]]
    return (
        <>
            <Grid item spacing={2} display={'flex'} gap={2}>
                {userCounts.map((userc) => (
                    cards(userc[0], userc[1])
                ))}
            </Grid>
            <Grid item spacing={2} display={'flex'} gap={2}>
                {itemCounts.map((itemc) => (
                    cards(itemc[0], itemc[1])
                ))}
            </Grid>
            <Grid item size={24}>
                <Tables />
            </Grid>
        </>
    );
}

function Tables() {
    const { user } = useAuth();
    const [users, setUsers] = React.useState([]);
    const [responses, setResponses] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [rentals, setRentals] = React.useState([]);
    const [services, setServices] = React.useState([]);

    React.useEffect(() => {
        async function fetchUsers() {
            const data = await fetchUserList();
            setUsers(data);
        }
        fetchUsers();
        async function fetchC() {
            try {
                const q = await getDocs(query(collection(db, 'contactus'), where("status", "==", "new"), orderBy('timestamp', 'asc'), limit(5)))
                const responses = q.docs.map((doc) => doc.data())
                setResponses(responses);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchC();
        async function fetchP() {
            const q = await getDocs(query(collection(db, 'products'), orderBy('timestamp', 'asc'), limit(5)))
            const data = q.docs.map((doc) => doc.data())
            setProducts(data);
        }
        fetchP();
        async function fetchR() {
            const q = await getDocs(query(collection(db, 'rentals'), orderBy('timestamp', 'asc'), limit(5)))
            const data = q.docs.map((doc) => doc.data())
            setRentals(data);
        }
        fetchR();
        async function fetchS() {
            const q = await getDocs(query(collection(db, 'services'), orderBy('timestamp', 'asc'), limit(5)))
            const data = q.docs.map((doc) => doc.data())
            setServices(data);
        }
        fetchS();
    }, []);

    const details = [
        ['Users', ["No", "displayName", "email",  "Counts", "Action"], users],
        ['Contact us requests', ['No', 'Name', 'Email', 'Status', 'Message'], responses],
        ['Products', ["No", "Name", "Quantity", "Price"], products],
        ['Rentals', ["No", "Name", "Quantity", "Price"], rentals],
        ['Services', ["No", "Name", "Category", "Price"], services]
    ];
    
    return (
        <>
            {details.map((detail, index) => (
            <DefaultTables
                key={index}
                title={detail[0]}       // Map title
                columns={detail[1]}     // Map columns array
                items={detail[2]}       // Map items array
            />
        ))}
        </>
    );
}

function DefaultTables({ title, columns, items }) {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, colIndex) => (
                                    <TableCell
                                        key={colIndex}  // Assign key to the TableCell
                                        style={{ backgroundColor: 'black', color: 'white' }}
                                    >
                                        {column} {/* Directly display the column name since it's a string */}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length > 0 ? (
                                items.slice(0, 5).map((item, index) => (
                                    <TableRow key={index}> {/* Assign key to TableRow */}
                                        {columns.map((column, colIndex) => (
                                            <TableCell key={colIndex}>
                                                {/* Dynamically access item data based on column index */}
                                                {colIndex === 0 ? index + 1 :colIndex===columns.length-1?'': item[Object.keys(item)[colIndex - 1]]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}