import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
} from '@mui/material';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = [
        {
          orderId: '1234',
          customerName: 'John Doe',
          product: 'Product A',
          quantity: 2,
          status: 'Processing',
        },
        {
          orderId: '5678',
          customerName: 'Jane Smith',
          product: 'Product B',
          quantity: 1,
          status: 'Shipped',
        },
        {
          orderId: '91011',
          customerName: 'Bob Johnson',
          product: 'Product C',
          quantity: 5,
          status: 'Delivered',
        },
      ];
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleView = (orderId) => {
    console.log(`Viewing order ${orderId}`);
    // Add your view logic here
  };

  const handleEdit = (orderId) => {
    console.log(`Editing order ${orderId}`);
    // Add your edit logic here
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting order ${orderId}`);
    // Add your delete logic here
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleView(order.orderId)}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEdit(order.orderId)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(order.orderId)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SellerOrders;
