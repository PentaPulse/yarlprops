import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const RentersList = ({ renters, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Monthly Rental Price</TableCell>
            <TableCell>Facilities</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renters.map((renter, index) => (
            <TableRow key={index}>
              <TableCell>{renter.name}</TableCell>
              <TableCell>{renter.mobileNumber}</TableCell>
              <TableCell>{renter.address}</TableCell>
              <TableCell>{renter.monthlyRentalPrice}</TableCell>
              <TableCell>{renter.facilities.join(', ')}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => onEdit(renter)}>Edit</Button>
                <Button variant="contained" color="secondary" onClick={() => onDelete(renter)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RentersList;
