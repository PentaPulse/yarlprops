import React, { useState } from 'react';
import ServicesList from '../Service/ServicesList';
import ServiceDetails from '../Service/ServiceDetails';
import ServicesForm from '../Service/ServicesForm';
import { Container, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AdminServices = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [viewingServiceId, setViewingServiceId] = useState(null);

  const handleAddService = () =>{
    setEditingServiceId(null);
    setShowAddService(true);
    setViewingServiceId(null);
  }

  const handleEditService = (sId) => {
    setEditingServiceId(sId);
    setShowAddService(true);
    setViewingServiceId(null);
  }

  const handleViewService = (sId) => {
    setViewingServiceId(sId);
    setShowAddService(false);
  }

  const handleSuccess = () => {
    setShowAddService(false);
    setViewingServiceId(null);
  };

  const handleCancel = () => {
    setShowAddService(false);
    setViewingServiceId(null);
  };

  return (
    <>
      <h2>SERVICES</h2>

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={handleAddService}
        style={{ margin: '20px' }}
      >
        Add Service
      </Button>
      
      <Container>
        {showAddService ? (
          <ServicesForm sid={editingServiceId} onSuccess={handleSuccess} onCancel={handleCancel} />
        ) : viewingServiceId? (
          <ServiceDetails sid={viewingServiceId} onBack={handleCancel} />
        ):(
          <ServicesList onEditService={handleEditService} onViewService={handleViewService}/>
        )}
      </Container>
    </>
  );
};

export default AdminServices;
