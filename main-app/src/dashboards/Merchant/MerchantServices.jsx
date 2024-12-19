import { Button, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from 'sweetalert2';
import { addService, fetchSelectedService, updateService } from '../../api/db/services';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../../api/AuthContext';
import { serviceFilters } from '../../components/menuLists';
import { addItemByMerchant } from '../../api/db/logsManager';

export default function MerchantServices() {
  const [showAddService, setShowAddService] = React.useState(false);
  const [editingServiceId, setEditingServiceId] = React.useState(null);
  const [viewingServiceId, setViewingServiceId] = React.useState(null);

  const handleAddService = () => {
    setEditingServiceId(null);
    setShowAddService(true);
    setViewingServiceId(null);
  };

  const handleEditService = (serviceId) => {
    setEditingServiceId(serviceId);
    setShowAddService(true);
    setViewingServiceId(null);
  };

  const handleViewService = (serviceId) => {
    setViewingServiceId(serviceId);
    setShowAddService(false);
  };

  const handleSuccess = () => {
    setShowAddService(false);
    setViewingServiceId(null);
  };

  const handleCancel = () => {
    setShowAddService(false);
    setViewingServiceId(null);
  };

  return (
    <Container maxWidth={false} sx={{ p: { xs: 1, sm: 2, md: 3} }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddService}
            sx={{
              m: { xs: 1, sm: 2 },
              width: { xs: 'auto', sm: 'auto' }
            }}
          >
            Add Service
          </Button>
        </Grid>
        <Grid item xs={12}>
          
            {showAddService ? (
              <ServiceForm sid={editingServiceId} onSuccess={handleSuccess} onCancel={handleCancel} />
            ) : viewingServiceId ? (
              <ServiceDetail sid={viewingServiceId} onBack={handleCancel} />
            ) : (
              <ServiceList onEditService={handleEditService} onViewService={handleViewService} />
            )}
          
        </Grid>
    </Grid>
    </Container>
  );
}

const ServiceForm = ({ sid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [service, setService] = React.useState({
    merchantId: user.uid,
    merchantName:user.displayName,
    title: '',
    category: '',
    subCategory: '',
    description: [''],
    location: '',
    images: [],
    visibitlty: false
  });

  const [existingImages, setExistingImages] = React.useState([]);
  const [newImages, setNewImages] = React.useState([]);
  const [validationMessage, setValidationMessage] = React.useState('');

  React.useEffect(() => {
    if (sid) {
      const fetchServiceData = async () => {
        const fetchedService = await fetchSelectedService(sid);
        if (fetchedService) {
          setService(fetchedService);
          setExistingImages(fetchedService.images || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchServiceData();
    }
  }, [sid, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setService({ ...service, [name]: value });
  };

  const handleDescriptionChange = (index, event) => {
    const newdescription = [...service.description];
    newdescription[index] = event.target.value;
    setService({ ...service, description: newdescription });
  };

  const addDescriptionLine = () => {
    setService({ ...service, description: [...service.description, ''] });
  };

  const handleRemoveDescriptionLine = (index) => {
    const updatedDescriptions = service.description.filter((_, i) => i !== index);
    setService({ ...service, description: updatedDescriptions });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImages([...newImages, file]);
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const totalImages = existingImages.length + newImages.length;

    if (totalImages < 2 || totalImages > 5) {
      setValidationMessage('You must upload at least 2 images and no more than 5 images');
      return;
    }
    setValidationMessage('');

    try {
      const newImageUrls = await Promise.all(
        newImages.map(async (image) => {
          const imageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      const allImageUrls = [...existingImages, ...newImageUrls];

      if (sid) {
        await updateService(sid, { ...service, images: allImageUrls, visibility: false });
        //await itemNotification(user,service,'service','update')
        Swal.fire({
          icon: 'success',
          title: 'Service updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addService({ ...service, images: allImageUrls, visibility: false });
        await addItemByMerchant(user, service, 'service')
        //await itemNotification(user,service,'service','add')
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
        visibility: false
      });

      setExistingImages([]);
      setNewImages([]);
      onSuccess();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error saving service',
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

  return (
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4}, mr: {xs: 1, sm: 1, md: 1, lg: -13} }}>
      <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3 } }}>{sid ? 'Edit Service' : 'Add Service'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Service Name"
          name="title"
          value={service.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: { xs: 2, sm: 3 } }}
          required
        />
        <FormControl fullWidth sx={{ mb: { xs: 2, sm: 3 } }}>
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
        <FormControl fullWidth sx={{ mb: { xs: 2, sm: 3 } }}>
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
          <Grid container key={index} spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={11}>
              <TextField
                label={`Description Line ${index + 1}`}
                value={description}
                onChange={(event) => handleDescriptionChange(index, event)}
                fullWidth
                sx={{ mb: { xs: 1, sm: 2 } }}
                required
              />
            </Grid>
            {index > 0 && (
              <Grid item xs={1}>
                <IconButton onClick={() => handleRemoveDescriptionLine(index)} style={{ marginTop: '1rem' }} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}

        <Button
          onClick={addDescriptionLine}
          variant="outlined"
          startIcon={<AddIcon />}
          color="success"
          sx={{ mb: { xs: 2, sm: 3 }, width: { xs: '100%', sm: 'auto' } }}
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

        <Typography variant="body1" color="textSecondary" gutterBottom>
          (Note:- Add high quality images.)
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {existingImages.map((src, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
             <Paper 
              elevation={3}
              sx={{
                position: 'relative',
                paddingTop: '75%',
                overflow: 'hidden',
                borderRadius: 1
              }}
            >
                <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 120, borderRadius: 5 ,objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'existing')}
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    p: 0
                  }}
                >
                  X
                </Button>
              </Paper>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
              <Paper 
              elevation={3}
              sx={{
                position: 'relative',
                paddingTop: '75%',
                overflow: 'hidden',
                borderRadius: 1
              }}
            >
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
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* <Grid container spacing={1}>
          {existingImages.map((url, index) => (
            <Grid item key={index}>
              <img src={url} alt={`Service  ${index + 1}`} style={{ width: 150, height: 120, borderRadius: 5 ,objectFit: 'cover' }} />
              <Button onClick={() => handleRemoveImage(index, 'existing')} color="secondary">
                Remove
              </Button>
            </Grid>
          ))}
          {newImages.map((image, index) => (
            <Grid item key={index}>
              <img src={URL.createObjectURL(image)} alt={`New  ${index + 1}`} style={{ width: 150, height: 120, borderRadius: 5 ,objectFit: 'cover' }} />
              <Button onClick={() => handleRemoveImage(index, 'new')} color="secondary">
                Remove
              </Button>
            </Grid>
          ))}
        </Grid> */}
  

        {/* <Grid container justifyContent="flex-end" spacing={2} style={{ marginTop: 20 }}>
          <Grid item>
            <Button variant="contained" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="success" type="submit">
              Save
            </Button>
          </Grid>
        </Grid> */}
        {validationMessage && (
          <Typography color="error" sx={{ mt: '1rem'}} gutterBottom>
            {validationMessage}
          </Typography>
        )}
      <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6}>
            <Button 
              type="submit" 
              variant="contained" 
              color="success"
              fullWidth
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              onClick={onCancel} 
              variant="outlined"
              fullWidth
            >
              Cancel
            </Button>
            </Grid>
      </Grid>
      </form>
    </Paper>
  );
};

const ServiceDetail = ({ sid, onBack }) => {
  const [service, setService] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      const fetchedService = await fetchSelectedService(sid);
      setService(fetchedService);
      setLoading(false);
    };

    fetchServiceData();
  }, [sid]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!service) {
    return <Typography variant="body1">Service not found.</Typography>;
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mr: {xs: 1, sm: 1, md: 1, lg: -10, xl: -30} }}>
      <Typography variant="h4" sx={{ 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}>
        {service.title}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Category: {service.category}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Sub category: {service.subCategory}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Description:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
         {service.description.map((desc, index) => (
            <li key={index}><Typography variant='body1' sx={{ mb: 0.5 }}>{desc}</Typography></li>
        ))}
        </ul>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">
            <strong>Location:</strong> {service.location}
          </Typography>
          <Typography variant="body1">Visibility: {(service.visibility === false) ? 'No':'Yes'}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
        {service.images.map((url, index) => (
          <Grid item key={index}>
            <img src={url} alt={`Service  ${index + 1}`} style={{ width: '185px', height: '175px', objectFit: 'cover', borderRadius: '10px' }} />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={onBack} fullWidth sx={{ 
          mt: 3,
          maxWidth: { sm: 200 }
        }}>
        Back
      </Button>
    </Paper>
  );
};

const ServiceList = ({ onEditService, onViewService }) => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth()

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const q = await getDocs(query(collection(db, 'services'), where('merchantId', '==', user.uid)))
      const fetchedServices = q.docs.map((doc) => doc.data())
      setServices(fetchedServices);
      setLoading(false);
    };

    fetchData();
  }, [user.uid]);

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

  /*const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));*/
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        fontSize: '0.875rem'
      }
    },
    [`&.${tableCellClasses.body}`]: {
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        fontSize: '0.875rem'
      }
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    [theme.breakpoints.down('sm')]: {
      '& > *': {
        display: 'table-cell'
      }
    }
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: 'auto', overflow: 'hidden', mr: {xs: 1, sm: 1, md: 1} }}>
      <TableContainer sx={{ maxHeight: { xs: 440, sm: 600, md: 'none' } }}>
        <Table stickyHeader sx={{ minWidth: { xs: 300, sm: 750} }}>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>Name</StyledTableCell>
              <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Category</StyledTableCell>
              <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Sub Category</StyledTableCell>
              {/* <StyledTableCell>Description</StyledTableCell> */}
              <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Location</StyledTableCell>
              <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Visibility On Site</StyledTableCell>
              <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Actions</StyledTableCell>
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
                  <StyledTableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>{service.title}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{service.category}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{service.subCategory}</StyledTableCell>
                  {/* <StyledTableCell>{service.description}</StyledTableCell> */}
                  <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{service.location}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>{(service.visibility === false) ? 'No':'Yes'}</StyledTableCell>
                  <StyledTableCell>
                  <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Grid item xs={12} sm={10}>
                      <Button onClick={() => onEditService(service.sid)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                   </Grid> 
                   <Grid item xs={12} sm={10}>
                      <Button onClick={() => onViewService(service.sid)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                   </Grid>
                    <Grid item xs={12} sm={10}>
                      <Button onClick={() => handleDeleteService(service.sid)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                    </Grid>
                  </Grid>
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
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      />
    </Paper>
  );
};
