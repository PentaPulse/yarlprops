import React, { useState ,useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,TextField, Button, Checkbox, FormControlLabel, Container, Typography } from '@mui/material';

const RentersForm = ({ currentRenter, onSave }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    monthlyRentalPrice: '',
    facilities: []
  });

  useEffect(() => {
    if (currentRenter) {
      setFormValues(currentRenter);
    } else {
      setFormValues({
        name: '',
        mobileNumber: '',
        address: '',
        monthlyRentalPrice: '',
        facilities: []
      });
    }
  }, [currentRenter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setFormValues({
      ...formValues,
      facilities: checked 
        ? [...formValues.facilities, value]
        : formValues.facilities.filter((facility) => facility !== value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {currentRenter ? 'Edit Renter' : 'Add New Renter'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={formValues.mobileNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={formValues.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Monthly Rental Price"
          name="monthlyRentalPrice"
          value={formValues.monthlyRentalPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <div>
          <Typography variant="h6" component="h2" gutterBottom>
            Facilities
          </Typography>
          <FormControlLabel
            control={
              <Checkbox 
                value="Parking" 
                checked={formValues.facilities.includes("Parking")} 
                onChange={handleFacilityChange} 
              />
            }
            label="Parking"
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="Gym" 
                checked={formValues.facilities.includes("Gym")} 
                onChange={handleFacilityChange} 
              />
            }
            label="Gym"
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="Pool" 
                checked={formValues.facilities.includes("Pool")} 
                onChange={handleFacilityChange} 
              />
            }
            label="Pool"
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="Internet" 
                checked={formValues.facilities.includes("Internet")} 
                onChange={handleFacilityChange} 
              />
            }
            label="Internet"
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          {currentRenter ? 'Update Renter' : 'Add Renter'}
        </Button>
      </form>
    </Container>
  );
};
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

const RenterOverview = () => {
  const [renters, setRenters] = useState([]);
  const [currentRenter, setCurrentRenter] = useState(null);

  const handleSaveRenter = (renter) => {
    if (currentRenter) {
      setRenters(renters.map(r => r === currentRenter ? renter : r));
      setCurrentRenter(null);
    } else {
      setRenters([...renters, renter]);
    }
  };

  const handleEditRenter = (renter) => {
    setCurrentRenter(renter);
  };

  const handleDeleteRenter = (renter) => {
    setRenters(renters.filter(r => r !== renter));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Renters Management
      </Typography>
      <RentersForm currentRenter={currentRenter} onSave={handleSaveRenter} />
      <RentersList renters={renters} onEdit={handleEditRenter} onDelete={handleDeleteRenter} />
    </Container>
  );
};

export default RenterOverview;
