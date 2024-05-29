import React, { useState } from 'react';
import RentersForm from './RentersForm';
import RentersList from './RentersList';
import { Container, Typography } from '@mui/material';

const RentersSection = () => {
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

export default RentersSection;
