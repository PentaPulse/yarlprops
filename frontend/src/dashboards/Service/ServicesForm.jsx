import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { TextField, Button, Paper, Typography, Grid, IconButton } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addService, fetchSelectedService, updateService } from '../../api/db/services';
import { storage } from '../../api/firebase';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default ServicesForm;
