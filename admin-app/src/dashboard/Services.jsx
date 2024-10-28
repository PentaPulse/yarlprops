import React, { useState,useEffect } from 'react';
import { Button, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../api/firebase';
import {fetchSelectedService,updateService,addService,fetchServices}from '../api/db/services'
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import {useAuth} from '../api/AuthContext';
import { serviceFilters } from '../../src/components/menuLists';
import DeleteIcon from '@mui/icons-material/Delete';
import { itemNotification } from '../../src/api/db/notificationsManager';
import { addItemByMerchant } from '../../src/api/db/logsManager';

export default function Services () {
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

const ServicesForm =  ({ sid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [service, setService] = useState({
    merchantId: user.uid,
    merchantName:user.displayName,
    title: '',
    category: '',
    subCategory: '',
    description: [''],
    location: '',
    images: [],
    visibility: false
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
  }, [sid, user]);

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
      await updateService(sid, { ...service, images: allImageUrls, visibility: false});
      await itemNotification(user,service,'service','update')
      Swal.fire({
        icon: 'success',
        title: 'Service saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      await addService({ ...service, images: allImageUrls, visibility: false });
      await addItemByMerchant(user, service, 'service')
        await itemNotification(user,service,'service','add')
        Swal.fire({
          icon: 'success',
          title: 'Service saved, request sent to the admin panel for approval',
          showConfirmButton: false,
          timer: 1500,
        });
    }
    
    setService({
      merchantId: user.uid,
      title: '',
      category: '',
      subCategory: '',
      description: [''],
      location: '',
      images: [],
      visibitlty: false
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
};

  
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
          name="title"
          value={service.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={service.category}
            onChange={handleChange}
            required
          >
            {Object.keys(serviceFilters["categories"]).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={service.subCategory}
            onChange={handleChange}
            required
            disabled={!service.category}
          >
            {service.category &&
              serviceFilters["categories"][service.category].map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory}>
                  {subCategory}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {service.description.map((description, index) => (
          <Grid container key={index} spacing={1} alignItems="center">
            <Grid item xs={11.5}>
              <TextField
                label={`Description Line ${index + 1}`}
                value={description}
                onChange={(event) => handleDescriptionChange(index, event)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            {index > 0 && (
              <IconButton onClick={() => handleRemoveDescriptionLine(index)} style={{ marginTop: '1rem' }} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        ))}

        <Button
          onClick={addDescriptionLine}
          variant="outlined"
          startIcon={<AddIcon />}
          color="success"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          Add new line
        </Button>

        <TextField
          label="Location"
          name="location"
          value={service.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          accept="image/*"
          component="label"
          startIcon={<CloudUploadIcon />}
          variant="outlined"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          Upload Images
          <VisuallyHiddenInput type="file" onChange={handleImageChange} />
        </Button>

        <Grid container spacing={2}>
          {existingImages.map((src, index) => (
            <Grid item key={index}>
              <div style={{ position: 'relative' }}>
                <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 120, borderRadius: 5 ,objectFit: 'cover' }} />
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
                <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, borderRadius: 5 , objectFit: 'cover' }} />
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

        {validationMessage && (
          <Typography color="error" sx={{ mt: '1rem'}} gutterBottom>
            {validationMessage}
          </Typography>
        )}

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
      setLoading(true);
      const fetchedService = await fetchSelectedService(sid);
      setService(fetchedService);
      setLoading(false);
    };
    fetchService();
  }, [sid]);

  if (loading) return <CircularProgress />;

  if (!service) {
    return <Typography variant="body1">Service not found.</Typography>;
  }

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Services List
      </Button>
      <Typography variant="h4" gutterBottom>
        {service.title}
      </Typography>
      <Typography variant="subtitle1">
        Category: {service.category}
      </Typography>
      <Typography variant="subtitle1">
        Sub category: {service.subCategory}
      </Typography>
      <Typography variant="body1">
        Description:
      </Typography>
      <ul>
        {service.description.map((desc, index) => (
          <li key={index}><Typography variant='body1'>{desc}</Typography></li>
        ))}
      </ul>
      <Typography variant="body1">
        <strong>Location:</strong> {service.location}
      </Typography>
      <Typography variant="body1">Visibility: {(service.visibility === false) ? 'No':'Yes'}</Typography>
      <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 10 }}>
        {service.images.map((url, index) => (
          <Grid item key={index}>
            <img src={url} alt={`Service  ${index + 1}`} style={{ width: '185px', height: '175px', objectFit: 'cover', borderRadius: '10px' }} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const ServicesList = ({ onEditService, onViewService }) => {
  const {user}=useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
      const fetchServiceList = async () => {
          const fetchedServices = await fetchServices();
          setServices(fetchedServices);
          setLoading(false);
      };
      fetchServiceList();
  }, []);

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'services', serviceId));
        await updateDoc(doc(db,'systemusers',user.uid),{
          myServices:arrayRemove(serviceId)
        })
        setServices(services.filter(service => service.sid !== serviceId));

        Swal.fire(
          'Deleted!',
          'Service has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error deleting service',
          text: error.message,
        });
      }
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
      <Paper>
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Sub Category</StyledTableCell>
              {/* <StyledTableCell>Description</StyledTableCell> */}
              <StyledTableCell align="center">Location</StyledTableCell>
              <StyledTableCell align="center">Visibility On Site</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <StyledTableCell colSpan={4} align="center">
                  <CircularProgress />
                </StyledTableCell>
              </TableRow>
            ) : services.length > 0 ? (
              services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(service => (
                <StyledTableRow key={service.sid}>
                  <StyledTableCell align="center">{service.title}</StyledTableCell>
                  <StyledTableCell align="center">{service.category}</StyledTableCell>
                  <StyledTableCell align="center">{service.subCategory}</StyledTableCell>
                  {/* <StyledTableCell>{service.description}</StyledTableCell> */}
                  <StyledTableCell align="center">{service.location}</StyledTableCell>
                  <StyledTableCell align="center">{(service.visibility === false) ? 'No':'Yes'}</StyledTableCell>
                  <StyledTableCell>
                    <Button onClick={() => onEditService(service.sid)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                    <Button onClick={() => onViewService(service.sid)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                    <Button onClick={() => handleDeleteService(service.sid)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={4} align="center">
                  No services found.
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={services.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

}