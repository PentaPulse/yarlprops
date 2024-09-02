import React, { useState,useEffect } from 'react';
import { Container, Button, styled, Paper, Typography, TextField,  Grid, TableCell, TableRow, tableCellClasses, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import {fetchSelectedService,updateService,addService,fetchServices}from '../../api/db/services'
import Swal from 'sweetalert2';
import { deleteDoc, doc } from 'firebase/firestore';
import {useAuth} from '../../api/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete';

const AdminServices = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [viewingServiceId, setViewingServiceId] = useState(null);
  const {user}=useAuth()

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
      
      <Container>
        {user.approved?(showAddService ? (
          <ServicesForm sid={editingServiceId} onSuccess={handleSuccess} onCancel={handleCancel} />
        ) : viewingServiceId? (
          <ServiceDetails sid={viewingServiceId} onBack={handleCancel} />
        ):(
          <ServicesList onEditService={handleEditService} onViewService={handleViewService}/>
        )):'wait for admin approval'}
      </Container>
    </>
  );
};

export default AdminServices;

const ServicesForm =  ({ sid, onSuccess, onCancel }) => {
  const [service, setService] = useState({
    serviceName : '',
    serviceDescription : [''],
    serviceLocation : '',
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (sid) {
      const fetchServices = async () => {
        const fetchedService = await fetchSelectedService(sid);
        if (fetchedService){
          setService(fetchedService);
          setExistingImages(fetchedService.images || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchServices();
    }
  }, [sid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setService({ ...service, [name]: value });
  }

  const handleDescriptionChange = (index, event) => {
    const newServiceDescription = [...service.serviceDescription];
    newServiceDescription[index] = event.target.value;
    setService({ ...service, serviceDescription: newServiceDescription });
  }

  const addDescriptionLine = () => {
    setService({ ...service, serviceDescription: [...service.serviceDescription, '']});
  }

  const handleRemoveDescriptionLine = (index) =>{
    const updatedDescriptions = service.serviceDescription.filter((_, i) => i !== index);
    setService({ ...service, serviceDescription: updatedDescriptions });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImages([...newImages, file]);
    }
  }

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const totalImages = existingImages.length + newImages.length;
  
    if(totalImages < 2 || totalImages > 5){
      setValidationMessage('You must upload at least 2 images and no more than 5 images');
      return;
    }
  setValidationMessage('');

  try{
    const newImageUrls = await Promise.all(newImages.map(async (image) => {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      return await getDownloadURL(imageRef);
    }));

    const allImageUrls = [...existingImages, ...newImageUrls];

    if (sid) {
      await updateService(sid, { ...service, images: allImageUrls });
    } else {
      await addService({ ...service, images: allImageUrls });
    }

    Swal.fire({
      icon: 'success',
      title: 'Service saved successfully',
      showConfirmButton: false,
      timer: 1500,
    });

    setService({
      serviceName : '',
      serviceDescription : [''],
      serviceLocation : '',
      images: [],
    });

    setExistingImages([]);
    setNewImages([]);
    onSuccess();

  } catch (e){

    Swal.fire({
      icon: 'error',
      title: 'Error saving service!',
      text: e.message,
    });
  }

  }

  
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return(
    <Paper style={{ padding: 16 }}>
      <Typography varient="h6">{sid ? 'Edit Service' : 'Add Service'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField      
          label="Service Name"
          name="serviceName"
          value={service.serviceName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {service.serviceDescription.map((description, index) => (
          <Grid container key={index} spacing={1} alignItems="center">
            <Grid item xs={11}>
            <TextField
              label= {`Description Line ${index + 1}`}
              value={description}
              onChange={(event) => handleDescriptionChange(index, event)}
              fullWidth
              margin="normal"
              required
            />
            </Grid>
            {index > 0 && (
                // <Button onClick={() => handleRemoveDescriptionLine(index)} variant='outlined' color='error' startIcon={<DeleteIcon />}>
                //   Delete
                // </Button>
                <IconButton onClick={() => handleRemoveDescriptionLine(index)} style={{ marginTop: '1rem' }} aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            )}
          </Grid>
        ))}

        <Button
          onClick={addDescriptionLine}
          variant='outlined'
          startIcon = {<AddIcon />}
          color='success'
          style={{ marginTop: '10px', marginBottom: '10px'}}
        > Add new line
        </Button>

        <TextField
          label="Location"
          name="serviceLocation"
          value={service.serviceLocation}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          accept='image/*'
          multiple
          onChange={handleImageChange}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          style={{ marginTop:'15px', marginBottom: '25px' }}
        >
        Upload file
        <VisuallyHiddenInput type="file" />
        </Button>

        <Grid container spacing={2}>
          {existingImages.map((src, index) => (
            <Grid item key={index}>
              <div style={{ position: 'relative' }}>
                <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 100, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'existing')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
              <div style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'new')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error">{validationMessage}</Typography>}
        <Button type="submit" variant="contained" color="success" style={{ marginTop: '25px' }}>
          Save
        </Button>
        <Button onClick={onCancel} variant="outlined" style={{ marginTop: '25px', marginLeft: '10px' }}>
          Cancel
        </Button>
      </form>
    </Paper>
  )
}

const Image = styled('img')({
  width: 300,
  height: 300,
  objectFit: 'cover',
  margin: 5,
});

const ServiceDetails = ({ sid, onBack }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      const fetchedService = await fetchSelectedService(sid);
      if (fetchedService) {
        setService(fetchedService);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchService();
  }, [sid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Services List
      </Button>
      <Typography variant="h4">{service.serviceName}</Typography>
      <Typography variant="body1">
        Description: 
      <ul style={{ textAlign: 'justify'}}>
        {service.serviceDescription.map((description, index) => (
          <li key={index}>{description}</li>
      ))}          
      </ul>
      </Typography>
      <Typography variant="body1">Location: {service.serviceLocation}</Typography>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {service.images && service.images.map((src, index) => (
          <Grid item key={index}>
            <Image src={src} alt={`Product ${index}`} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const ServicesList = ({ onEditService, onViewService }) => {
  const {user}=useAuth();
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
      const fetchServiceList = async () => {
          const fetchedServices = await fetchServices();
          setServices(fetchedServices);
      };
      fetchServiceList();
  }, []);

  const handleDelete = async (id) => {
      try {
          const result = await Swal.fire({
              icon: 'warning',
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, cancel!',
          });

          if (result.isConfirmed){
              await deleteDoc(doc(db, 'services', id));
              setServices(services.filter(service => service.id !== id));

              Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: `The Service has been deleted.`,
                  showConfirmButton: false,
                  timer: 1500,
              });
          }
      } catch (error) {
          console.error("Error deleting service: ", error);
          Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'There was an error deleting the service.',
          });
      }
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

    return (
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                  <TableRow>
                      {/* <TableCell>ID</TableCell> */}
                      
                      <StyledTableCell align="center">Service Name</StyledTableCell>
                      <StyledTableCell align="center">Description</StyledTableCell>
                      <StyledTableCell align="center">Location</StyledTableCell>
                      <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(service => (
                  <StyledTableRow key={service.id}>
                      {/* <TableCell>{product.id}</TableCell> */}
                      <StyledTableCell align="center">{service.serviceName}</StyledTableCell>
                      <StyledTableCell>
                          <ul style={{ textAlign: 'justify'}}>
                              {service.serviceDescription.map((description, index) => (
                                  <li key={index}>{description}</li>
                              ))}
                          </ul>
                      </StyledTableCell>
                      <StyledTableCell align="center">{service.serviceLocation}</StyledTableCell>
                      <StyledTableCell align="center">
                          <Button disabled={!user.approved} onClick={() => onViewService(service.id)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                          <Button disabled={!user.approved} onClick={() => onEditService(service.id)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                          <Button disabled={!user.approved} onClick={() => handleDelete(service.id)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                      </StyledTableCell>
                  </StyledTableRow>
                 ))}
              </TableBody>
          </Table>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={services.length} 
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </TableContainer>    
  );

}